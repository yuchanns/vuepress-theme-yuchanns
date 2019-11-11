---
title: 容器与单例和原型
date: 2019-05-28 23:27:00
tags:
  - design pattern
  - swoole
category: php
---
整理一下对单例模式、原型模式和容器的理解。
<!-- more -->
## 单例模式
### 介绍
摘自[Wikipedia-Singleton_pattern](https://en.wikipedia.org/wiki/Singleton_pattern)
::: tip 定义
In software engineering, the singleton pattern is a software design pattern that restricts the instantiation of a class to one "single" instance. 

在软件工程中，单例模式是指一种设计模式，它严格限制一个类同时只存在一个实例。
:::
单单看文字描述，虽然能够理解定义的意思，但是可能会使人产生疑惑，有什么使用单例模式的必要呢？

举个简单的例子：
> 在一个web项目中，我们会使用一个Request类的实例接收来自网络的请求。这个类往往会经过多道代码的处理，例如中间件、基础控制器等等。在传递过程中，经过处理的数据变动需要保存下来，保证最后交到服务层时有效。

在这个场景中，我们就有必要保证实例的唯一性，避免出现重复实例化而导致操作对象前后不一致的情况。
### 实现
那么如何实现单例模式呢？这里需要用到类的静态属性（static）。

我们编写一个Request类，它具有一个用于**保存唯一实例**的`$instance`静态变量和一个**获取唯一实例**的`getInstance`静态方法，除此之外是一些处理变量接收的方法。
```php
<?php

class Request
{
    private static $instance = null;

    private $_posts = [];

    public static function getInstance()
    {
        // 判断唯一实例是否已经存在
        // 如果不存在则进行一次实例化赋予
        if (!self::$instance) {
            self::$instance = new self;
        }
        // 返回唯一实例
        return self::$instance;
    }

    public static function post($name='')
    {
        if (!$name) {
            return self::getInstance()->_posts;
        }
        if (isset(self::getInstance()->_posts[$name])) {
            return self::getInstance()->_posts[$name];
        }
        return '';
    }

    public static function withPost($name='', $value='') {
        if ($name && $value) {
            self::getInstance()->_posts[$name] = $value;
            return true;
        }
        return false;
    }
}
```
这样一来，在一次生命周期中，无论你在哪个文件中调用Request类的实例，都会返回同一个实例给你，保证了实例的唯一性。
```php
<?php

// simple test
class MiddlewareA
{
    public function handler()
    {
        Request::getInstance()->withPost('argA', 'MiddlewareA');
    }
}

class MiddlewareB
{
    public function handler()
    {
        Request::getInstance()->withPost('argB', 'MiddlewareB');
    }
}

class App
{
    public function run()
    {
        Request::getInstance()->withPost('run', 'App');
        (new MiddlewareA)->handler();
        (new MiddlewareB)->handler();
    }

    public function display()
    {
        var_export(Request::getInstance()->post());
    }
}

$app = new App;
$app->run();
$app->display();
```

::: tip 在线演示
Request类单例模式
:::
<iframe height="600px" width="100%" src="https://repl.it/@yuchanns/singleton?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

因此单例模式有效地帮助使用者管理相应实例，避免不明来源实例的干扰。

## 容器
### 介绍
从上文我们知道了单例模式的类的写法。但是有个比较麻烦的问题，我们想要实现单例模式就需要在类自身内实现一个用于**保存唯一实例**的`$instance`静态变量和一个**获取唯一实例**的`getInstance`静态方法。

如果每个类都需要这样写，不但重复大量工作，而且当我们想要使用已经存在的类时，也需要hack地修改原有类的代码，这是非常低效而且不应该的行为。

因此我们可以抽象出一个类，专门用于管理单例模式的实例。这个类我们将之称为`容器`。

摘自网络
::: tip IoC容器
控制反转（Inversion of Control，缩写为IoC），是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。

其中最常见的方式叫做依赖注入（Dependency Injection，简称DI），还有一种方式叫“依赖查找”（Dependency Lookup）。

通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体（即IoC容器）将其所依赖的对象的引用传递给它。也可以说，依赖被注入到对象中。
:::
### 实现
单例模式管理容器类的功能要求有：
> 1. 一个用于保存自身唯一实例的$`instance`静态变量
> 2. 一个用于获取自身唯一实例的`getInstance`静态方法
> 3. 一个用于保存所管理的类群的唯一实例的`$singletons`数组变量
> 4. 一个用于获取所管理的类群的唯一实例的`get`方法

```php
<?php

class Container
{
    private static $instance = null;

    private $singletons = [];

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function get($name = '', $args=[])
    {
        if (!$name) {
            throw new Exception('class name is empty');
        }
        if (!isset($this->singletons[$name])) {
            $this->singletons[$name] = new $name($args);
        }
        return $this->singletons[$name];
    }
}
```
::: tip 在线演示
Container类管理单例模式
:::
<iframe height="600px" width="100%" src="https://repl.it/@yuchanns/container?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

在这个在线例子中，我们还可以看到单例模式的另一个优点——提高系统资源的利用。进程不必为每一次实例的使用重复消耗内存来进行创建。
## 原型模式
### 介绍
摘自[Wikipedia-Prototype_pattern](https://en.wikipedia.org/wiki/Prototype_pattern)
::: tip 定义
The prototype pattern is a creational design pattern in software development. It is used when the type of objects to create is determined by a prototypical instance, which is cloned to produce new objects. 

原型模式是软件开发中一种创造性的设计模式，被用于创建一个原型实例，并通过克隆的方式产出新的对象。
:::
单例模式虽好，但它并不是万金油。在某些情况下并不适用。

举个例子：
> 在一个web项目中，我们往往使用ORM模型来与数据库进行交互。当我们查询一批列表数据之后，有时候需要通过循环的方式为每条记录查询关联表的信息。这时候如果我们使用单例模式，就会发生查询条件逐轮累加的错误，导致查询失败。

有的人可能会想：既然如此，用原始的new关键字来实例化类不就可以了？虽然这样可以没错，但是还有一种方法可以更好地获取实例——克隆（clone）。

*Talk is cheap. Show me the code* ——让我们来看一个例子：
```php
<?php

const COUNT = 10000;

class A
{
    public function __construct()
    {
        $greeting = 'hello world';
    }
}

$time1 = microtime(true);
$usage1 = memory_get_usage();
foreach (range(1, COUNT) as $new) {
    $a1 = new A;
}
$time2 = microtime(true);
$usage2 = memory_get_usage();
foreach (range(1, COUNT) as $clone) {
    $a2 = clone $a1;
}
$time3 = microtime(true);
$usage3 = memory_get_usage();
echo '实例化类A耗时：' . ($time2 - $time1) . 's；耗内存：' . ($usage2 - $usage1) . 'b' . PHP_EOL;
echo '克隆实例a1耗时：' . ($time3 - $time2) . 's；耗内存：' . ($usage3 - $usage2) . 'b' . PHP_EOL;
```
此片段分别执行了10000次new操作和clone操作，最后查看输出结果我们可以发现：
> 实例化类A耗时：0.000946044921875s；耗内存：40b
> 
> 克隆实例a1耗时：0.00053691864013672s；耗内存：40b

虽然消耗的内存一致，但是耗时缩短了将近一半的时间。可以看出对于这种循环代码使用克隆将会是非常有益的。

同时，对原型模式的使用，我们同样可以交由容器来进行管理。
### 实现
原型模式管理容器类的功能要求有：
> 1. 一个用于保存自身唯一实例的$`instance`静态变量
> 2. 一个用于获取自身唯一实例的`getInstance`静态方法
> 3. 一个用于保存所管理的类群的原型实例的`$prototypes`数组变量
> 4. 一个用于获取所管理的类群的原型克隆的`get`方法

考虑到容器类的大部分要求相同，我们将单例模式管理容器类和原型模式管理容器类整合为同一个容器类，只在`get`方法中添加第三个参数，以布尔判断获取的是单例还是原型克隆。
```php
<?php

class Container
{
    private static $instance = null;

    private $singletons = [];
    
    private $prototypes = [];

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function get($name = '', $args=[], $prototype=false)
    {
        if (!$name) {
            throw new Exception('class name is empty');
        }
        if (!$prototype) {
            if (!isset($this->singletons[$name])) {
                $this->singletons[$name] = new $name($args);
            }
            return $this->singletons[$name];
        }
        if (!isset($this->prototypes[$name])) {
            $this->prototypes[$name] = new $name($args);
        }
        return clone $this->prototypes[$name];
    }
}
```
只需对上文的在线演示进行少量修改，就可以将单例使用改为原型。

## 总结
本文一共介绍了三个概念：单例模式、原型模式和容器。

* 单例模式：对类的实例进行管理，保证类的实例的唯一性，避免不明来源实例的干扰，同时提高系统资源的利用。
* 原型模式：对类的实例的克隆进行管理，缩短类的实例化耗时。
* 容器：专门用于管理类的实例，囊括了单例模式和原型模式，使已有类无hack可用于以上两种模式。

实际上，在swoole这类内存常驻型扩展中，容器具有更大的用途。

在swoole httpserver的整个生命周期中，经由容器进行类的实例化，可以在漫长的时间中对实例进行有效地管理，避免在这一部分中内存莫名溢出（当你接收到大量请求时这是很有可能发生的问题！）。singleton和prototype将常驻于整个生命周期，而clone在每一次请求完成后自动销毁释放，两种模式结合使用将大有裨益。

附：Case in Swoole
```php
<?php

use Swoole\Http\ {
    Request,
    Response
};

class Container
{
    /**
     * @var $instance Container
     */
    private static $instance = null;

    private $objPool = [];

    public function __construct()
    {
        echo "Container Initial".PHP_EOL;
    }

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function get($name)
    {
        if (!isset($this->objPool[$name])) {
            $this->objPool[$name] = new $name;
        }
        return $this->objPool[$name];
    }

    public function __destruct()
    {
        echo "Container Release".PHP_EOL;
    }
}

class Test
{
    private $value;

    public function __construct()
    {
        echo "Test initial".PHP_EOL;
        $this->value = 1;
    }

    public function get()
    {
        return $this->value;
    }

    public function add()
    {
        $this->value += 1;
    }

    public function __destruct()
    {
        echo "Test release".PHP_EOL;
    }
}

class App
{
    public function run()
    {
        $http = new swoole_http_server("127.0.0.1", 9501);

        $http->on("start", function ($server) {
            echo "Swoole http server is started at http://127.0.0.1:9501".PHP_EOL;
        });

        $http->on("request", function (
            Request $request,
            Response $response
        ) {
            $init = memory_get_usage();
            /* @var $test Test*/
            $test = Container::getInstance()->get('Test');
            $after = memory_get_usage();
            $test->add();
            $response->header("Content-Type", "text/plain");
            $response->end("usage:" . ($after - $init) . 'B' . PHP_EOL);
        });

        $http->start();
    }
}

(new App)->run();

// 在代码中我们实现了三个类：

// Container类，用作容器。
//   使用静态属性成员$instance存储自身实例化对象
//   使用对象池数组$objPool存储被管理对象。
// App类，用于启动Swoole的http服务器，接收请求和回应。
// Test类，即被管理对象的类。
```
