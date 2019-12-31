---
title: 多进程socket与惊群问题
date: 2019-09-01 13:55:00
tags:
  - workerman
  - socket
category: php
---
在上一篇文章中，我们使用`socket`函数简单创建了一个**tcp**服务器，并使用**select**维护多个长连接。遗憾的是select最多支持1024个连接，并且采用遍历的方式检查连接的活动状态，不够强大。
<!-- more -->
[[toc]]
## 前言
当连接超过1024个，程序就会提示`Warning: stream_select(): You MUST recompile PHP with a larger value of FD_SETSIZE.`。也许重新编译php并设置一个更大的fd size值可以增加一定的连接数，但是数量有限，且麻烦，没有尝试的价值。

历史上，人们曾被这个问题困扰过，先后提出了`poll`和`epoll`解决方案。poll解决了连接数的限制，但是和select一样使用轮询方式确定fd的状态。而epoll则是在poll的基础上，优化了查询机制，解决了轮询效率的问题。
:::tip 三者区别
* select：时间复杂度O(n)。当I/O事件发生时通过轮询所有的流来寻找能读写的流。同时处理的流越多，轮询时间越长。

* poll：时间复杂度O(n)。基于链表存储，突破了连接数的限制。

* epoll：时间复杂度O(1)。当I/O事件发生时，无需通过无差别轮询即可确定能读写的流。

* select是posix标准，符合此标准的操作系统均有实现；epoll是linux特有的，在osx上与之相对应的则是kqueue。
:::

对于php来说，可以通过event扩展经由libevent框架使用epoll或者kqueue。
## event扩展的使用
在使用前，需要安装libevent库和event扩展，这里不做展开。

event扩展提供了两个final修饰的类，**EventBase**和**Event**。其中，EventBase是事件基类，它的作用是保存挂起需要监听的事件，然后在事件被唤醒的时候调用回调函数进行处理；Event就是被监听的事件类本身。
```php
<?php
/** 
 * event.php
 * @author yuchanns@www.yuchanns.xyz
 */
$clients = [];  // 客户端连接池

$mainSocket = stream_socket_server(
    'tcp://127.0.0.1:9501',
    $errno,
    $errstr,
    STREAM_SERVER_BIND | STREAM_SERVER_LISTEN
);  // 创建服务器

stream_set_blocking($mainSocket, false);  // 服务器设置非阻塞

$eventBase = new \EventBase();  // 实例化事件基类，用于存放监听事件和回调操作

$mainEvent = new \Event(
    $eventBase,
    $mainSocket,
    \Event::READ | \Event::PERSIST,  // 这两个标记，前者表示监听读取事件，后者表示持续监听
    function ($fd) use (&$clients) {  // 回调函数中正常处理新连接操作
        $client = stream_socket_accept($fd);
        if (!$client) return;
        stream_set_blocking($client, false);
        $key = (int)$client;
        echo 'new client[' . $key . '] comes in.' . PHP_EOL;
        $clients[$key] = $client;  // 客户端入池
        echo 'count of clients: ' . count($clients) . PHP_EOL;
    }
);  // 创建一个主事件，用于监听所有新客户端的接入活动并注册回调处理方式

$mainEvent->add();  // 通过add方法将事件挂起，只有挂起的事件才会在事件发生时被EventBase触发回调

$eventBase->loop();  // 进入事件循环状态
```
对比select我们可以看到，EventBase的实例就相当于stream_select()一样，起到滤出被唤醒的fd的作用。只不过select是通过对我们给予的全连接进行遍历过滤，而EventBase则是直接对苏醒的fd进行回调处理操作。

需要注意的是创建事件实例时，添加[**PERSIST**](https://www.php.net/manual/en/event.persistence.php)标记。此标记表示事件即使执行了回调操作也依旧保持挂起状态，否则事件将会自动被释放。

编写一个简单的客户端，发起大量连接，可以发现使用event扩展的tcp服务器可以保持上万长连接。理论上1G内存可以支持10w连接。由于我使用单机（Mac）脚本模拟客户端，发起连接动作会受到端口数量限制，所以成功创建的长连接数保持在**10477**左右——这一值在Linux上大约是**20k**上下。如果使用多台机子做客户端发起连接请求，就可以看到更多的连接数被保存。
<details>
<summary>展开查看客户端代码</summary>

```php
<?php
/** 
 * client.php
 * @author yuchanns@www.yuchanns.xyz
 */
$clients = [];
foreach (range(1, 20000) as $c) {
    try {
        $client = stream_socket_client('tcp://127.0.0.1:9501', $errno, $errstr, 60);
        echo 'connect' . $c . PHP_EOL;
        if (is_resource($client)) {
            $clients[] = $client;
        }
        usleep(500);
    } catch (\Exception $e) {
        break;
    }
}
while (true) {
    // loop forever
}
```
</details>
同理，我们对客户端连接也可以进行事件创建，挂起，并使用一个事件池进行维护（高亮部分）。

```php {9,34-50}
<?php
/** 
 * events.php
 * @author yuchanns@www.yuchanns.xyz
 */
$clients = [];
$events = [];  // 添加一个事件池，用与保存客户端连接事件

$mainSocket = stream_socket_server(
    'tcp://127.0.0.1:9501',
    $errno,
    $errstr,
    STREAM_SERVER_BIND | STREAM_SERVER_LISTEN
);

stream_set_blocking($mainSocket, false);

$eventBase = new \EventBase();

$mainEvent = new \Event(
    $eventBase,
    $mainSocket,
    \Event::READ | \Event::PERSIST,
    function ($fd) use (&$clients) {
        $client = stream_socket_accept($fd);
        if (!$client) return;
        stream_set_blocking($client, false);
        $key = (int)$client;
        echo 'new client[' . $key . '] comes in.' . PHP_EOL;
        $clients[$key] = $client;
        echo 'count of clients: ' . count($clients) . PHP_EOL;
        $clientEvent = new \Event(
            $eventBase,
            $client,
            \Event::READ | \Event::PERSIST,
            function ($fd) use (&$clients, &$events) {
                $key = (int) $fd;
                if (!$fd || feof($fd)) {  // 失效资源及时释放
                    unset($clients[$key], $events[$key]);
                    echo 'client[' . $key . '] closed' . PHP_EOL;
                    return;
                }
                $msg = fread($fd, 65535);
                echo 'recv: ' . $msg . ' from client[' . $key . ']' . PHP_EOL;
            }
        );  // 创建客户端读取事件
        $clientEvent->add();  // 将客户端事件挂起
        $events[$key] = $clientEvent;  // 事件入池
    }
);

$mainEvent->add();

$eventBase->loop();
```
我们对客户端代码略作修改，令所有客户端有效连接每隔10秒向服务端报时。
<details>
<summary>展开查看报时客户端代码（高亮部分）</summary>

```php {23-26}
<?php
/** 
 * client_alarm.php
 * @author yuchanns@www.yuchanns.xyz
 */
$clients = [];
foreach (range(1, 10477) as $c) {
    try {
        $client = stream_socket_client('tcp://127.0.0.1:9501', $errno, $errstr, 60);
        if (is_resource($client)) {
            echo 'connected success' . PHP_EOL;
            $clients[] = $client;
        }
        usleep(500);
    } catch (\Exception $e) {
        break;
    }
}

while (true) {
    foreach ($clients as $client) {
        fwrite($client, 'now is ' . date('Y-m-d H:i:s', time()) . PHP_EOL);
    }
    sleep(10);
}
```
</details>
可以看到所有的客户端事件正常接收并执行了回调操作。

（通过上一篇文章）我们知道，无论是设置非阻塞，或者使用select、epoll等I/O复用技术，针对的都是网络IO，属于cpu操作。换言之，对于业务代码中的阻塞无能为力。考虑一下这种情况：业务代码中涉及到了mysql或者redis操作，由于数据量大，会产生一定的阻塞时间。此时将会导致所有的活跃的连接阻塞等待执行。这种情况该如何处理？
```php {17-20}
// 修改客户端事件的回调函数，使偶数连接阻塞20秒执行
$clientEvent = new \Event(
    $eventBase,
    $client,
    \Event::READ | \Event::PERSIST,
    function ($fd) use (&$clients, &$events) {
        $key = (int) $fd;
        if (!$fd || feof($fd)) {
            unset($clients[$key], $events[$key]);
            echo 'client[' . $key . '] closed' . PHP_EOL;
            return;
        }
        $msg = fread($fd, 65535);
        echo 'recv: ' . $msg . ' from client[' . $key . ']' . PHP_EOL;
        if ($key % 2 === 0) {  // 偶数连接数阻塞20秒
            sleep(20);
        }
        fwrite($fd, 'read: ' . $msg);
    }
);
```

## 结合多进程
在select、poll、epoll尚未出现的时代，socket使用同步阻塞的方式接受连接，一个进程处理一个连接，因此多个连接需要多个进程。这个方法虽然效率低下，但对于I/O复用的epoll时代依旧具有借鉴价值。我们可以在一个进程维护多个连接的前提下，创建多个子进程，共同监听一个端口，同时处理多个请求业务逻辑。

这样做的优点有：同时处理复数请求，平摊到多个cpu核心上，协调cpu负载，避免单个请求阻塞所有请求（尽管他仍然会阻塞一部分请求）。

结合此前掌握的[《php多进程解析》](https://www.yuchanns.xyz/posts/2019/08/11/php-process.html)知识，socket结合多进程的思路如下：
* 首先在主进程中创建一个监听端口的描述符，并设置为非阻塞。
* 然后调用pcntl_fork函数创建复数子进程。
* 子进程将会得到同一个监听端口描述符的副本，接着各自使用event扩展创建主事件和客户端事件，维护各自的连接。
* 主进程则阻塞等待子进程返回状态。

我们以创建两个子进程为例，实现如下代码：
```php
<?php
/**
 * multi_sockets.php
 * @author yuchanns@www.yuchanns.xyz
 */
$clients = [];  // 客户端连接池
$events = []; // 事件池

$mainSocket = stream_socket_server(
    'tcp://127.0.0.1:9501',
    $errno,
    $errstr,
    STREAM_SERVER_BIND | STREAM_SERVER_LISTEN
);  // 创建服务器

stream_set_blocking($mainSocket, false);  // 服务器设置非阻塞

foreach (range(1, 2) as $child) {
    $pid = pcntl_fork();
    if ($pid < 0) {
        die(logTime() . 'fork failed.');
    } else if ($pid === 0) {
        childEvent();
    }
}

// 父进程行为
echo logTime() . 'parent[' . posix_getpid() . '] waiting...' . PHP_EOL;
pcntl_wait($status);
exit(0);

// 子进程行为
function childEvent()
{
    global $mainSocket, $clients, $events;
    $cpid = posix_getpid();
    echo logTime() . 'child[' . $cpid . '] starting...' . PHP_EOL;
    $eventBase = new \EventBase();  // 实例化事件基类，用于存放监听事件和回调操作

    $mainEvent = new \Event(
        $eventBase,
        $mainSocket,
        \Event::READ | \Event::PERSIST,  // 这两个标记，前者表示监听读取事件，后者表示持续监听
        function ($fd) use (&$clients, &$events, $eventBase, $cpid) {  // 回调函数中正常处理新连接操作
            echo logTime() . 'child[' . $cpid . '] wakeup and try to accept...' . PHP_EOL;
            set_error_handler(function () {});
            $client = stream_socket_accept($fd, 0);
            restore_error_handler();
            if (!$client) {
                echo logTime() . 'child[' . $cpid . '] accepted failed...' . PHP_EOL;
                return;
            };
            echo logTime() . 'child[' . $cpid . '] accepted success...' . PHP_EOL;
            stream_set_blocking($client, false);
            $key = (int) $client;
            echo logTime() . 'new client[' . $key . '] comes in from child[' . $cpid . ']...' . PHP_EOL;
            $clients[$key] = $client;  // 客户端入池
            $clientEvent = new \Event(
                $eventBase,
                $client,
                \Event::READ | \Event::PERSIST,
                function ($fd) use (&$clients, &$events, $cpid) {
                    $key = (int) $fd;
                    if (!$fd || feof($fd)) {  // 失效资源及时释放
                        unset($clients[$key], $events[$key]);
                        echo logTime() . 'client[' . $key . '] closed from child[' . $cpid . ']...' . PHP_EOL;
                        return;
                    }
                    $msg = fread($fd, 65535);
                    echo logTime() . 'recv: ' . $msg . ' from client[' . $key . '] from child[' . $cpid . ']...' . PHP_EOL;
                    if ($key % 2 === 0) {  // 偶数连接数阻塞20秒
                        sleep(20);
                    }
                    fwrite($fd, logTime() . 'resp: ' . $msg . ' in child[' . $cpid . ']...' . PHP_EOL);
                }
            );  // 创建客户端读取事件
            $clientEvent->add();  // 将客户端事件挂起
            $events[] = $clientEvent;  // 事件入池
        }
    );  // 创建一个主事件，用于监听所有新客户端的接入活动并注册回调处理方式

    $mainEvent->add();  // 通过add方法将事件挂起，只有挂起的事件才会在事件发生时被EventBase触发回调

    $eventBase->loop();  // 进入事件循环状态
}

function logTime() {
    return '[' . date('Y-m-d H:i:s' , time()) . ']';
}
```
运行脚本观察控制台输出结果， 可以从服务端输出看到客户端A（09:35:34）比客户端B（09:35:42）先发出请求，但由于我们**设置了偶数连接阻塞20秒**，所以B（09:35:42）反而比A（09:35:54）先得到响应，不被阻塞。
<details>
<summary>展开查看控制台输出</summary>

* 服务端
```sh
$ php event/event_.php 
[2019-09-01 09:34:46]parent[23022] waiting...
[2019-09-01 09:34:46]child[23023] starting...
[2019-09-01 09:34:46]child[23024] starting...
[2019-09-01 09:34:51]child[23024] wakeup and try to accept...
[2019-09-01 09:34:51]child[23023] wakeup and try to accept...
[2019-09-01 09:34:51]child[23024] accepted success...
[2019-09-01 09:34:51]new client[6] comes in from child[23024]...
[2019-09-01 09:34:51]child[23023] accepted failed...
[2019-09-01 09:34:56]child[23024] wakeup and try to accept...
[2019-09-01 09:34:56]child[23023] wakeup and try to accept...
[2019-09-01 09:34:56]child[23024] accepted success...
[2019-09-01 09:34:56]child[23023] accepted failed...
[2019-09-01 09:34:56]new client[7] comes in from child[23024]...
[2019-09-01 09:35:09]child[23023] wakeup and try to accept...
[2019-09-01 09:35:09]child[23024] wakeup and try to accept...
[2019-09-01 09:35:09]child[23023] accepted success...
[2019-09-01 09:35:09]new client[6] comes in from child[23023]...
[2019-09-01 09:35:09]child[23024] accepted failed...
[2019-09-01 09:35:34]recv: hi im A!
 from client[6] from child[23023]...
[2019-09-01 09:35:42]recv: hi im B!
 from client[7] from child[23024]...
```
* 连接到进程23023的客户端A(6)
```sh
$ telnet 127.0.0.1 9501
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
hi im A!
[2019-09-01 09:35:54]resp: hi im A!
 in child[23023]...
```
* 连接到进程23024的客户端B(7)
```sh
$ telnet 127.0.0.1 9501
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
hi im B!
[2019-09-01 09:35:42]resp: hi im B!
 in child[23024]...
```
</details>
但与此同时，我们仔细查看服务端控制台输出日志，也会发现如下记录：

> [2019-09-01 09:34:51]child[23024] wakeup and try to accept...
>
> [2019-09-01 09:34:51]child[23023] wakeup and try to accept...
>
> [2019-09-01 09:34:51]child[23024] accepted success...
>
> [2019-09-01 09:34:51]new client[6] comes in from child[23024]...
>
> [2019-09-01 09:34:51]child[23023] accepted failed...

这意味着当一个新的客户端建立请求连接时，子进程的fd（$mainSocket）们都被唤醒了，彼此竞争对新连接的接受权。随着其中一个fd的成功，余者即得到失败的结果。

## 惊群效应与解决方案
上一节中，因为一个请求而唤醒了所有子进程的fd（$mainSocket）的现象，被称作[**惊群效应(Thundering herd problem)**](https://en.wikipedia.org/wiki/Thundering_herd_problem)。
:::tip 惊群效应
[摘自Wikipedia]在计算机科学中，当大量等待事件的进程或线程在事件发生时被唤醒，但只有一个进程能够处理该事件时，就会出现惊群问题。在所有进程醒来后，它们将开始处理事件，但只有一个会成功。所有进程都将竞争资源，甚至导致计算机卡顿，直到惊群重归平静。
:::

惊群效应有什么危害呢？

我们知道，唤醒描述符需要进行进程切换，而进程切换需要时间，会消耗cpu资源。当有大量客户端并发建立连接请求时，多个子进程在短时间内被重复唤醒，并且因为竞争失败再次休眠。频繁的进程切换可能会导致**系统卡死！**

如何解决惊群效应？

事实上，对于惊群问题，我们应该辩证的看待——

使用socket创建服务器，其主要目的在于维护复数长连接方便通信。也就是说，多数客户端在建立第一次连接之后，就会长期复用同一个连接。在这种情况下，惊群问题只会发生在初次建立连接的时候，因此我们可以适当地放任这一效应的产生，不必过度担心。当然，如果业务场景中存在短时间内的大量客户端建立并发，为了避免系统卡死，我们可以：
* 如果业务代码io阻塞少， 则减少子进程数。
* 在每个子进程处理完当前连接请求后进行一定时间的休眠阻塞，避免多个子进程同时被唤醒。

如果业务场景是大量的短连接通信，那我们还使用什么异步非阻塞长连接服务呢？

其他的解决方案——

在不使用select、poll、epoll的情况下，Linux对原生的socket从内核层面解决了惊群效应。
<details>
<summary>展开查看原生socket同步阻塞多进程代码</summary>

```php
<?php
$clients = [];

$mainSocket = stream_socket_server(
    'tcp://127.0.0.1:9501',
    $errno, $errstr,
    STREAM_SERVER_BIND | STREAM_SERVER_LISTEN
);  // 创建服务器

foreach (range(1, 2) as $child) {
    $pid = pcntl_fork();
    if ($pid < 0) {
        die('fork failed...');
    } else if ($pid === 0) {
        childAction();
    }
}
// for parent process
pcntl_wait($status);
exit(0);

function childAction()
{
    global $mainSocket, $clients;
    $cpid = posix_getpid();
    while (true) {
        $client = stream_socket_accept($mainSocket, 600);
        if (!$client) {
            echo 'child[' . $cpid . '] accepted failed.' . PHP_EOL;
            continue;
        }
        echo 'child[' . $cpid . '] accepted success.' . PHP_EOL;
        $key = (int) $client;
        $clients[$key] = $client;
    }
}
```
</details>
对于Nginx来说，每个请求建立时，只有子进程取得全局锁的fd才会被唤醒，避免了惊群效应的产生。

epoll本身在2016年也通过新增一个EPOLLEXCLUSIVE标记来解决这个问题。由于php是通过扩展以及框架间接调用epoll，所以无法利用这一点。

关于惊群问题，可以参考这篇博文获得更详细的了解：[《聊聊网络事件中的惊群效应》](https://manjusaka.itscoder.com/posts/2019/03/28/somthing-about-thundering-herd/)。

## 总结
* epoll支持更多连接数，只唤醒有I/O事件的进程，效率高。php可以通过event扩展来利用它。
* 当业务代码中阻塞较多时，可以考虑使用多进程提高同时处理请求数。
* 辩证看待惊群问题，结合实际应用场景采取合适的解决方案。