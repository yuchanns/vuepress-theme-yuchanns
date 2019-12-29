---
title: 【源码阅读】Workerman 01
date: 2019-08-03 21:26:00
tags:
  - workerman
category: php
---
Workerman源码阅读·一
<!-- more -->
[[toc]]
:::tip 介绍
[**Workerman**](https://github.com/walkor/Workerman)是一个异步php socket 即时通讯框架，是php程序员研究socket编程的一个好的着手点。
:::
-><lazy-image src="/images/TCP:IPmodel.jpg" /><-

Workerman可以创建websocket、http等应用层服务，实际上这些都是对**tcp**的封装，属于应用层。

## http服务启动篇
```php
<?php

require_once __DIR__ . '/../vendor/autoload.php';

$worker = new \Workerman\Worker('http://0.0.0.0:9501');

$worker->count = 4;

$worker->onMessage = function ($con) {
    /**
     * @var Workerman\Connection\TcpConnection $con
     */
    $con->send("hello world\n");
};

\Workerman\Worker::runAll();
```
Workerman的http服务启动十分简单：
> * 首先，我们实例化一个Worker类，并设置了需要监听的请求来源和端口
> * 接着我们设置了进程数目
> * 然后指定返回数据内容
> * 最后调用runAll方法运行

先来看看启动过程中Worker类做了哪些工作——
### 构造过程
```php
public function __construct($socket_name = '', $context_option = array())
{
    // sql_obejct_hash用于返回对象唯一哈希值
    $this->workerId                    = spl_object_hash($this);
    static::$_workers[$this->workerId] = $this;
    static::$_pidMap[$this->workerId]  = array();

    // debug_backtrace用于获取php代码载入过程的回溯
    // 得到自动载入文件所在的目录
    $backtrace                = debug_backtrace();
    $this->_autoloadRootPath = dirname($backtrace[0]['file']);

    // 创建socket服务的上下文数据流
    if ($socket_name) {
        $this->_socketName = $socket_name;
        if (!isset($context_option['socket']['backlog'])) {
            $context_option['socket']['backlog'] = static::DEFAULT_BACKLOG;
        }
        $this->_context = stream_context_create($context_option);
    }
}
```
* 首先获取自身实例化后的哈希值，并在$_workers池中保存自身
* 然后初始化$_pidMap映射池为空
* 由于加载流程是从composer自动加载机制开始，所以获取自动加载文件所在的目录路径作为根目录
* 创建一个socket服务的上下文数据流，并保存在上下文变量中

### 开始运行

:::warning runAll方法的工作内容
* checkSapiEnv --- 检查脚本运行环境
* init --- 初始化
* lock --- 加锁
* parseCommand --- 解析命令
* daemonize --- 守护进程
* initWorkers --- 执行Workers监听操作
* installSignal --- 注册信号处理器
* saveMasterPid --- 保存主进程pid
* unlock --- 解锁
* displayUI --- 展示ui
* forkWorkers --- 创建子Workers进程
* resetStd --- 重置标准库
* monitorWorkers --- 监控Workers
:::
1. **checkSapiEnv**使用[php_sapi_name](http://php.net/manual/en/function.php-sapi-name.php)方法获取当前脚本的运行环境，如果不是以command line的模式运行则退出。
    :::danger 假如不使用cli模式运行？
    当你使用cgi模式执行脚本，会得到`Warning: Use of undefined constant STDOUT`之类的提示。
    原因在于**STDOUT**是cli模式下为了减轻外壳环境的工作定义的常量。是cli的[feature](https://www.php.net/manual/zh/features.commandline.php)之一。
    :::
2. **init**负责初始化工作。首先使用[set_error_handler](https://www.php.net/manual/zh/function.set-error-handler.php)接管脚本错误处理，然后将当前执行动作的脚本文件绝对路径保存到$_startFile——这个文件路径之后会被用于生成记录进程pid的文件的命名。

   接着创建运行日志文件，将当前进程内类的状态标记为启动状态(**STATUS_STARTING**)，同时记录开始时间戳，并设置临时文件用于保存进程状态信息\$pidFile。条件允许的话还会将当前进程标题设置为`WorkerMan: master process  start_file=$_startFile`——使用`ps aux | grep WorkerMan`可以看到这个标题下的进程。
   
   再遍历\$_workers池，将worker对象下的子进程映射到\$_idMap池中。
   
   最后注册一个定时器信号处理器，用于处理定时任务。
3. **lock**尝试以只读模式获取上一步骤中pid文件的描述符，锁定(**LOCK_EX**)以阻止其他进程访问。
4. **parseCommand**解析脚本接收到的命令，并结合当前进程状态进行相应处理。通过[posix_kill](https://www.php.net/manual/zh/function.posix-kill.php)[($pid, 0)](https://stackoverflow.com/questions/7613136/how-to-check-whether-process-ended-or-not-with-php)可以判断进程是否依然存活。
    :::warning 脚本可执行命令
    start, stop, restart, reload, status, connections
    :::
5. **daemonize**（当设置为守护进程时）将当前php进程的执行权限掩码[临时设置为0或者说0000](https://stackoverflow.com/questions/12116121/php-umask0-what-is-the-purpose)，也就是**全用户可读写**(0666)，然后将当前进程创建为守护进程。
    :::tip 如何创建守护进程？
    普通的进程与终端会话绑定，当终端关闭，进程也会结束，只有守护进程才可以后台运行。退出父进程，关闭会话，子进程则可以在后台运行。创建子进程之后，父进程会得到子进程的pid，而子进程会得到0。父子进程都会执行后续的动作。
    
    * 使用[pcntl_fork](https://www.php.net/manual/zh/function.pcntl-fork.php)创建子进程，后续通过pid值判断使父进程($pid>0)退出。
    * 使用[posix_setsid](https://www.php.net/manual/en/function.posix-setsid.php)在子进程中创建新的会话，使子进程独立。
    * 使用[umask](https://www.php.net/manual/en/function.umask.php)重设子进程执行权限，避免继承父进程权限出现问题。
    :::
    ```php
    umask(0);  // 重设执行权限为0666
    $pid = pcntl_fork();
    if (-1 === $pid) {  // -1表示fork失败
        throw new Exception('fork fail');
    } elseif ($pid > 0) {  // 大于0说明是父进程在执行
        exit(0);
    }
    if (-1 === posix_setsid()) {  // -1表示创建会话失败
        throw new Exception("setsid fail");
    }
    ```
6. **initWorkers**真正执行**listen**操作。
    * 设置自动加载类的根目录
    * 获取设置的应用层通讯协议和监听地址，记录对应的协议类 **\Protocols\Http**。这时候可以看到http协议监听的真正地址其实就是`tcp://$address`。
    * 使用[stream_socket_server](https://www.php.net/manual/zh/function.stream-socket-server.php)创建一个流式socket服务器并保存到$_mainSocket，设置好监听地址、创建标志以及上下文。
    :::tip stream_socket_server和socket_create的区别？
    比起stream_socket_server，[socket_create](https://www.php.net/manual/zh/function.socket-create.php)是一个[更为底层的函数](https://stackoverflow.com/questions/9760548/php-sockets-vs-streams)，这意味着创建者将从更精细的粒度去创建socket服务，可以选择socket类型（**SOCK_STREAM**，**SOCK_DGRAM**，**SOCK_SEQPACKET**）。相对的，stream_socket_server在创建时即指定了类型为**SOCK_STREAM**或**SOCK_DGRAM**。
    
    可选参数errno和errstr用于标记系统级别调用socket服务时发生的错误。
    :::
    * 使用[socket_import_stream](https://www.php.net/manual/zh/function.socket-import-stream.php)将封装在高层函数中的$_mainSocket资源导入，以便于将socket的选项[socket_set_option](https://www.php.net/manual/zh/function.socket-set-option.php)设置为keepalive和禁用[Nagle算法](https://en.wikipedia.org/wiki/Nagle%27s_algorithm#Negative_effect_on_larger_writes)（这个算法是为了避免发送大量的小包，但是会造成延迟）。
    * 通过[stream_set_blocking](https://www.php.net/manual/zh/function.stream-set-blocking.php)设置此流式socket资源为非阻塞模式。
1. **installSignal**为进程注册信号处理器。
2. **saveMasterPid**获取当前进程的pid并将其保存到$pidFile文件中。
3. **unlock**释放对$pidFile文件的锁定。
4. **displayUI**将启动提示信息输出到控制台或者日志文件中。
5. **forkWorkers**负责根据设定进程数fork出子进程。主进程将子进程pid保存到$_pidMap池中；子进程清除自身的定时器，设置好用户/组以及进程标题，执行**run**方法进入事件循环，如果意外退出则输出状态码250。
6. **resetStd**重置标准IO。
7. **monitorWorkers**将主进程状态设置为运行中，并进入死循环，监控所有子进程状态，当当前进程接收到信号或者子进程异常退出时做出相应处理。
## 事件篇
通过上一节的分析得知，Workerman主进程运行起来之后，只负责**监控**子进程运行。而子进程才是负责网络请求调度的进程。

子进程通过**forkWorkers**创建，然后执行**run**动作进入运行状态。继续追踪代码，可以看到子进程会先通过**getEventLoopName**获取一个全局事件类的实例。
```php
/**
 * Available event loops.
 *
 * @var array
 */
protected static $_availableEventLoops = array(
    'libevent' => '\Workerman\Events\Libevent',
    'event'    => '\Workerman\Events\Event', 
    'swoole'   => '\Workerman\Events\Swoole'
);
```
Workerman可使用的事件循环类包括Libevent、Event、Swoole以及默认的Select。前三者取决于php环境是否安装了对应的扩展。
:::tip libevent扩展和event扩展的关系
-><lazy-image src="/images/libevent.png" /><-

两个扩展均依赖于[**libevent库**](https://github.com/libevent/libevent)（*注：这里说的不是扩展*）。event扩展具有稳定版，而libevent扩展一直处于beta状态。
:::
:::warning 注意
本文假定使用者安装了event扩展，接下来的内容以 **\Workerman\Events\Event**为准。
:::
### 事件接口
Workerman中，所有的事件类都符合其定义的事件接口标准：
<details>
<summary>展开接事件接口源码</summary>
```php
<?php
namespace Workerman\Events;

interface EventInterface
{
    /**
     * Read event.
     *
     * @var int
     */
    const EV_READ = 1;

    /**
     * Write event.
     *
     * @var int
     */
    const EV_WRITE = 2;

    /**
     * Except event
     *
     * @var int
     */
    const EV_EXCEPT = 3;

    /**
     * Signal event.
     *
     * @var int
     */
    const EV_SIGNAL = 4;

    /**
     * Timer event.
     *
     * @var int
     */
    const EV_TIMER = 8;

    /**
     * Timer once event.
     *
     * @var int
     */
    const EV_TIMER_ONCE = 16;

    /**
     * Add event listener to event loop.
     *
     * @param mixed    $fd
     * @param int      $flag
     * @param callable $func
     * @param mixed    $args
     * @return bool
     */
    public function add($fd, $flag, $func, $args = null);

    /**
     * Remove event listener from event loop.
     *
     * @param mixed $fd
     * @param int   $flag
     * @return bool
     */
    public function del($fd, $flag);

    /**
     * Remove all timers.
     *
     * @return void
     */
    public function clearAllTimer();

    /**
     * Main loop.
     *
     * @return void
     */
    public function loop();

    /**
     * Destroy loop.
     *
     * @return mixed
     */
    public function destroy();

    /**
     * Get Timer count.
     *
     * @return mixed
     */
    public function getTimerCount();
}
```
</details>

* 首先，接口包含6种事件常量：
    * **EV_READ**: 读取事件
    * **EV_WRITE**: 写入事件
    * **EV_EXCEPT**: 排除事件
    * **EV_SIGNAL**: 信号事件
    * **EV_TIMER**: 定时事件
    * **EV_TIMER_ONCE**: 单次定时事件
* 其次，接口要求实现6个方法：
    * **add**: 为事件循环添加监听者
    * **del**: 移除监听者
    * **clearAllTimer**: 清除定时器
    * **loop**: 主循环
    * **destroy**: 销毁事件循环
    * **getTimerCount**: 获取定时器数量
### Event事件类
:::warning 注意
下文中涉及到三个类，请注意区分！

当提到 **Event**，指的是 **\Workerman\Events\Event**事件类。

当提到 **\Event**，指的是libevent库通过event扩展提供的 **\Event**类。

当提到 **\EventBase**，指的是libevent库通过event扩展提供的 **\EventBase**类。
:::
* 构造函数：实例化了一个[\EventBase](https://www.php.net/manual/zh/class.eventbase.php)对象保存到$_eventBase变量。
    :::tip \EventBase
    \EventBase是event扩展所提供的libevent事件基础结构类。它保存了一组事件，并通过轮询的方式确定哪些事件处于活动状态。可以通过手册查看其结构。
    :::
* 注册函数：回到子进程的**run**动作中，可以看到，事件实例通过**resumeAccept**添加了一个用于继续接受新的请求的带有回调函数的监听者，最后事件类调用了**loop**方法进入主循环状态，等待事件活动并执行监听者的回调函数。
    <details>
    <summary>展开add源码</summary>
    ```php
    public function add($fd, $flag, $func, $args=array())
    {
        if (class_exists('\\\\Event', false)) {
            $class_name = '\\\\Event';
        } else {
            $class_name = '\Event';
        }
        switch ($flag) {
            // 去除与此时无关的判断
            default :
                $fd_key = (int)$fd;
                $real_flag = $class_name::READ;
                $event = new $class_name($this->_eventBase, $fd, $real_flag, $func, $fd);
                if (!$event||!$event->add()) {
                    return false;
                }
                $this->_allEvents[$fd_key][$flag] = $event;
                return true;
        }
    }
    ```
    </details>
    
    在此处**add**函数接受\$_mainSocket描述符，事件读取标志**EV_READ**和**acceptConnection**回调函数作为参数。它首先获取[\Event](https://www.php.net/manual/zh/class.event.php)类，然后根据**EV_READ**获取\Event类自身的**READ**标志，接着传入\EventBase实例、\$_mainSocket、READ标志和回调函数实例化一个\Event对象事件event，并将event挂起保存到传入的\EventBase实例中，等待发生后执行回调。最后将event保存到Event实例中。
    :::tip \Event
    \Event类既可以表示准备读取或写入的文件描述符、即将准备读取或写入的文件描述符，也可以触发超时到期、信号发生和用户事件。
    :::
* 小结：上文的三个类一口气看下来也许会使读者感到迷惑。现在我们来总结一下，理清楚三者之间的关系。
  
  首先，Event类是Workerman实现的基于event扩展的事件循环类，作为整个进程中的全局事件类，它负责注册**socket服务器准备好被读取**的事件。
  
  而事件本身是由\Event实例化来表示，它保存了事件触发后的回调函数。\EventBase则用于保存事件并通过轮询识别事件的活跃状态。当事件处于活跃状态，就会被触发，进而执行回调函数。
  
  也就是说，全局事件类进行注册的过程就是将\Event实例关联保存到\EventBase实例中，由\EventBase轮询挂起的\Event实例。当实例活跃，就会触发执行回调函数。
  
  这里有一篇[starkoverflow的文章](https://stackoverflow.com/questions/40882596/looping-behaviour-in-php-event)也可以作为参考。
* 回调函数1：在读取事件中，使用**acceptConnection**作为回调函数。
  
  这个函数通过[stream_socket_accept](https://www.php.net/manual/zh/function.stream-socket-accept.php)接受新传入的连接并获取请求地址，然后将两者传入一个TcpConnection对象，同时将用户定义的行为以及Worker的一些信息包括使用的协议类等属性注册到这个对象上。
  
  追踪TcpConnection类内部，可以看到这个类统计了连接数。在实例化之后将连接设为非阻塞，然后通过[stream_set_read_buffer](https://www.php.net/manual/zh/function.stream-set-read-buffer.php)将连接的缓冲区设置为0——这样做可以保证fread读取完整。
  
  紧接着建立起tcp连接之后该对象又在全局事件类中注册了读取事件和回调函数**baseRead**。
* 回调函数2：**baseRead**接受连接之后，使用[fread](https://www.php.net/manual/zh/function.fread.php)读取连接的内容，获取读取的字节长度，使用对应的协议(**\Protocols\Http**)的**input**方法对缓冲进行解析，获取当前请求包长度，从接受的缓冲中去掉请求包的内容，调用对应协议的**decode**方法对请求包进行解码。最后将TcpConnection实例和解码获得的数据传递给用户定义的**onMessage**回调函数。
* 协议解析：**input**方法首先通过截取空行(\r\n\r\n)判断是否是合法的http协议请求报文，然后获取请求头，解析请求的方法，调用**getRequestSize**得到整个请求包的长度。
* 请求包解码：**decode**，待补充===

## 总结
通过本次源码阅读，我了解了Workerman从多进程创建、通过事件循环接手请求到解析http协议报文最后将数据转交到业务代码的流程。

等之后有空会补上总结性流程图以便更好理解和回忆起这部分内容:)。

---
*TODO: 补充http协议报文详解、对请求包解码过程、底层php socket创建流程总结、事件循环简单样例。*