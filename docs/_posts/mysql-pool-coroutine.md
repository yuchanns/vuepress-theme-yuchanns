---
title: 协程下的mysql连接池实现分析
date: 2019-06-25 15:31:00
tags:
  - swoole
  - mysql
  - 协程
category: php
---
本文的思考源于一篇文章的拓展。
<!-- more -->
[[toc]]
## 前言
:::tip 参考文章
[《Swoole4.x之协程变量访问安全与协程连接池实现》](https://segmentfault.com/a/1190000019571411)
:::
由这篇文章我们可以得知，传统php-fpm模式下的单例模式在协程中会发生跨协程污染的问题，而解决方法就是**创建一个协程上下文管理器，以协程id做隔离，分别实现每个协程中的单例连接**。
```php
<?php
// 例子摘抄
class dbContext
{
    private $container = [];

    private static $instance;

    public static function getInstance()
    {
        if(!isset(self::$instance)){
            self::$instance = new dbContext();
        }
        return self::$instance;
    }

    function dbCon()
    {
        $cid = \co::getCid();
        if(!isset($this->container[$cid])){
            $this->container[$cid] = new stdClass();
            defer(function (){
                $this->destroy();
            });
        }
        return $this->container[$cid];
    }

    function destroy()
    {
        $cid = \co::getCid();
        if(isset($this->container[$cid])){
            unset($this->container[$cid]);
        }
    }
}

go(function (){
    go(function (){
        dbContext::getInstance()->dbCon()->key = 'one';
        //假设这sql执行了1s
        \co::sleep(1);
        var_dump(dbContext::getInstance()->dbCon()->key);
    });
    go(function (){
        dbContext::getInstance()->dbCon()->key = 'two';
        //假设这sql执行了0.1s
        \co::sleep(0.1);
        var_dump(dbContext::getInstance()->dbCon()->key);
    });
});
```
然而这只是原理实现，实际上使用的mysql依旧是短连接，需要重复创建，很消耗资源。所以我们需要实现一个连接池，以达到**连接复用**的目的。
## 源码分析
这篇文章的作者写有一个基于swoole的开源框架，[easyswoole](https://github.com/easy-swoole/easyswoole)。所以我们可以直接研究它的源码，看看是怎么实现mysql连接池的。
:::tip 源码
[easyswoole demo](https://github.com/easy-swoole/demo/blob/3.x-pool/App/Utility/Pool/MysqlPool.php)
:::
> 注：以下路径全部以demo根目录为起点

### 对调用方式进行分析
首先我们在[`App/HttpController/Index.php`](https://github.com/easy-swoole/demo/blob/3.x-pool/App/HttpController/Index.php)中可以看到：

easyswoole操作数据库的方法是，调用MysqlPool::invoke方法，以回调的形式进行操作。
```php
<?php

namespace App\HttpController

use App\Utility\Pool\MysqlPool;
use App\Utility\Pool\MysqlObject;
use App\Model\Member\MemberModel;

MysqlPool::invoke(function(MysqlObject $db) {
    $memberModel = new MemberModel($db);
});
```
其中，回调参数接受一个类型为MysqlObject的实例变量$db。这个变量将会作为Model类的构造函数参数使用。

我们先看看invoke方法的实现原理。
### 对MysqlPool::invoke进行分析
:::tip 代码定义跳转
MysqlPool->AbstractPool->TraitInvoker
:::
如上，我们通过代码跳转最终知道了invoker方法是通过trait特性混入AbstractPool抽象类的。
```php
<?php
// 方法源码摘抄
public static function invoke(callable $call,float $timeout = null)
{
    $pool = PoolManager::getInstance()->getPool(static::class);
    if($pool instanceof AbstractPool){
        $obj = $pool->getObj($timeout);
        if($obj){
            try{
                $ret = call_user_func($call,$obj);
                return $ret;
            }catch (\Throwable $throwable){
                throw $throwable;
            }finally{
                $pool->recycleObj($obj);
            }
        }else{
            throw new PoolEmpty(static::class." pool is empty");
        }
    }else{
        throw new PoolException(static::class." convert to pool error");
    }
}
```
这个方法接受一个回调函数和浮点型作为参数。在方法体中，我们可以看到注入到回调参数中的MysqlObject类的实例是变量`$object`。而这个实例是通过`$pool`实例调用getObj方法获得的。

接着回溯，可以得知`$pool`实例是由PoolManager进行管理的。简单查阅方法可知getPool返回给我们一个键名为`MysqlPool`的AbstractPool的实例。
### 对AbstractPool进行分析
继续查看AbstractPool的getObj方法，去除掉一些异常抛出之后的源码：
```php
<?php
// getObj方法摘抄
public function getObj()
{
    $object = null;
    if($this->poolChannel->isEmpty()){
        $this->initObject();
    }
    $object = $this->poolChannel->pop();
    return $object;
}
```
先不管具体变量的内容，只看字面，我们可以知道，getObj的实现内容就是：
> 首先判断连接池是否为空，如果为空，则调用initObject进行实例化。接着通过pop方法推出一个`$object`，将变量返回。

接着看看$this->poolChannel是什么：
```php
<?php
use Swoole\Coroutine\Channel;

public function __construct(PoolConf $conf)
{
    $this->poolChannel = new Channel($conf->getMaxObjectNum() + 8);
}
```
从构造函数可以看出，$this->poolChannel是一个Swoole协程的通道实例。
:::tip 文档
[Swoole协程通道](https://wiki.swoole.com/wiki/page/p-coroutine_channel.html)
:::
这个Channel的作用与php自身的Array类似，只是基于协程实现。所以，在通道非空的情况下，调用pop方法可以读取一个`$object`数据，予以返回。

暂且回到invoke方法的代码中，我们可以看到，在执行回调函数完毕以后，有个`finally`操作，调用了`$pool`实例的recycleObj方法对连接进行回收。查看此方法会发现所谓的回收其实就是操作Channel将`$object`push回去。
### 对$obj的产生进行分析
我们开始关注initObject方法，看看$obj是怎么产生的：
```php
<?php
// 去除掉一些判断和异常抛出
private function initObject():bool
{
    $obj = null;
    $obj = $this->createObject();
    if(is_object($obj)){
        $this->poolChannel->push($obj);
        return true;
    }
    return false;
}
```
可以看到，$obj是由createObject方法生成的，并且在生成后push到poolChannel中。

最后我们得知createObject方法是一个抽象方法，需要用户自己实现，定义它的产出。

回到MysqlPool类，我们可以看到：
```php
<?php
/**
 * Created by PhpStorm.
 * User: Tioncico
 * Date: 2019/3/5 0005
 * Time: 20:42
 */
namespace App\Utility\Pool;
use EasySwoole\Component\Pool\AbstractPool;
use EasySwoole\Mysqli\Config;
use EasySwoole\Mysqli\Mysqli;
class MysqlPool extends AbstractPool
{
    protected function createObject()
    {
        //当连接池第一次获取连接时,会调用该方法
        //我们需要在该方法中创建连接
        //返回一个对象实例
        //必须要返回一个实现了AbstractPoolObject接口的对象
        $conf = \EasySwoole\EasySwoole\Config::getInstance()->getConf("MYSQL");
        $dbConf = new Config($conf);
        return new MysqlObject($dbConf);
        // TODO: Implement createObject() method.
    }
}
```
所谓的`$obj`变量其实就是MysqlObject继承了`EasySwoole\Mysqli\Mysqli`的实例，而在这个类中，调用的则是Swoole扩展的协程mysql客户端。
:::tip 文档
[Swoole协程mysql](https://wiki.swoole.com/wiki/page/p-coroutine_mysql.html)
:::
所以说，这个`$obj`就是一个建立了连接的协程mysql客户端实例。

回到最开头，我们可以看到，MysqlPool::invoke的实现原理就是从poolChannel通道中获取mysql连接实例（如果通道中无实例则进行创建）并作为回调函数的参数，提供给Model使用。至于Model中如何使用，完全看使用者的写法定义。在使用完毕后，invoke方法会自动将连接实例放回poolChannel以供再次使用。
## 阶段性总结
通过上面的分析，我们得知，easyswoole对协程下的mysql连接池的管理实现如下：
> 1.使用一个单例池管理器管理mysql连接池MysqlPool
> 
> 2.这个MysqlPool使用Swoole的协程Channel存取mysql协程客户端连接实例
> 
> 3.MysqlPool通过invoke方法为每次的数据库操作提供一个连接实例

对比一下**前言**中所提到的协程上下文管理器，原理是类似的。只不过我们通过Channel操作代替`$container`来存取连接实例，达到了一样的协程隔离效果。并且由于Channel在当前进程中是全局共享的独立协程，可以对连接实例进行保存，达到了连接复用的效果。

