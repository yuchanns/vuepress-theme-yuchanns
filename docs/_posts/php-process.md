---
title: php进程解析
date: 2019-08-11 15:17:00
tags:
  - workerman
category: php
---
本文作为【Workerman源码解读】系列的补充——
<!-- more -->
[[toc]]
:::tip 什么是进程
[进程](https://en.wikipedia.org/wiki/Process_(computing))是计算机程序的实例，包含了其代码和活动。

计算机程序是被动的指令集合，而进程是这些指令的实际执行。

进程可以有多个，他们可能都指向同一个程序。

进程间无法直接通信，通常可以使用管道、消息队列、信号量、socket、stream等方式间接通信。
:::
php默认是**单进程**模式的，但是通过[pcntl扩展](https://www.php.net/manual/zh/book.pcntl.php)就可以支持**多进程**编程。
## 创建一个简单的进程
依照上述维基百科的定义，只要我们写出代码，然后将其运行起来，便可以得到一个进程。简单写一个死循环*loop.php*，然后在shell中使用`ps aux | grep loop.php`命令进行观察：
```php
<?php

while (true) {
    //
}
```

```sh
# shell1启动进程
php loop.php
# shell2观察进程
ps aux | grep loop.php
yuchanns  40053 100.0  0.1  4342852  16396 s001  R+  3:33PM   0:14.22 php loop.php
```
可以看到，我们获得了一个pid为40053的php进程。

当我们使用`ctrl + c`关闭窗口的时候，再次查看进程，就会发现这个进程已经消失了。

从这里我们可以得出一个特性，一般情况下，一个进程是跟开启会话的终端进行连接绑定的。这意味着**一旦断开了会话，进程也就会消失**。

## 创建多进程
同一个程序可以有多个进程。任何进程都是基于最初的系统pid为1的进程fork出来的。我们这里讨论的多进程是指从第一个loop.php程序的进程fork出来的多个副本进程——即父子进程。

子进程获得父进程的数据空间、堆和栈的副本，彼此之间并不共享资源。

php依赖于[pcntl_fork](https://www.php.net/manual/zh/function.pcntl-fork.php)创建子进程。此函数调用一次，但是会返回两次。分别在fork之后的父进程和子进程中返回一次。子进程中返回值为0，父进程中返回值为子进程的pid。我们可以据此判断当前执行代码的进程是父进程还是子进程，并对其后续的执行步骤做出区分。
```php
<?php
$pid = pcntl_fork();
if ($pid === -1) {  // 如果返回-1说明fork失败
    die('fork failed');
} else if ($pid > 0) {
    echo 'parent started...' . PHP_EOL;
} else {
    echo 'child started...' . PHP_EOL;
}
while (true) {
    //
}
```
分别在父子进程中执行一个死循环，然后使用ps观察进程：
```sh
# shell1启动进程
php loop.php
parent started...
child started...
# shell2观察进程
ps aux | grep loop.php
yuchanns  41323 100.0  0.1  4342852  16484 s000  R+    3:53PM   2:37.06 php loop.php
yuchanns  41324  99.9  0.0  4352068    740 s000  R+    3:53PM   2:37.01 php loop.php
```
这样我们就得到了两个进程，他们的pid相差为1，并且在同一个终端输出了提示文字。

这时候如果我们关闭了会话，会发生什么事呢？随着父进程的关闭，子进程是否能保存下来？

答案是，很不幸，子进程依赖于父进程，而父进程依赖于会话。所以**一旦父进程退出，子进程也会跟着退出**。

孩子终究要长大独立生活，不能总依赖于父母养活。那么如何才能使子进程独立生存，不依赖于父进程呢？

仔细思考一下，父进程之所以能够存活，依赖于会话，所以，如果子进程也获得了会话，应该就能独立存活。

## 创建守护进程
[posix_setsid](https://www.php.net/manual/zh/function.posix-setsid.php)就是用于使进程获得会话权的函数。
```php
<?php
$pid = pcntl_fork();
if ($pid === -1) {  // 如果返回-1说明fork失败
    die('fork failed');
} else if ($pid > 0) {
    echo 'parent started...' . PHP_EOL;
} else {
    posix_setsid();  // 使子进程也能拥有独立的会话
    echo 'child started...' . PHP_EOL;
}
while (true) {
    //
}
```
再次执行上述操作，启动进程，关闭会话。过程中使用ps命令进行观察。这次我们会发现，父进程退出之后，子进程依旧显示在运行当中。

这就是守护进程的创建原理。

突然间，我们发现，子进程独立是独立了，但是离了终端，子进程变成了一个自由撒野的🐻孩子，我们要怎么跟管教它，要求它执行命令呢？

## 使用进程间通信
不用着急，上面说过，进程间通信，可以使用管道、消息队列、信号量、socket、stream等方式。

事实上，刚才观察进程所使用的`ps aux | grep loop.php`就是通过管道（就是这个符号`|`）对两个进程进行通信，将运行`ps`得到的输出使用`grep`过滤出我们想要的结果。

我们可以通过信号量，对刚才独立的子进程发出一个执行退出的命令。

```sh
kill -9 42545
```
### 信号类型
上述命令中的9是一个信号量，代表着无论当前进程在做什么事情，收到后立即退出的意义。通常我们应当避免使用这个命令，因为它会使进程立即退出，造成一些难以预料的后果。

下面列出一些php定义的对应信号常量
<details>
<summary>点击查看</summary>
```php
define ('WNOHANG', 1);
define ('WUNTRACED', 2);
define ('WCONTINUED', 16);
define ('SIG_IGN', 1);
define ('SIG_DFL', 0);
define ('SIG_ERR', -1);
define ('SIGHUP', 1);
define ('SIGINT', 2);
define ('SIGQUIT', 3);
define ('SIGILL', 4);
define ('SIGTRAP', 5);
define ('SIGABRT', 6);
define ('SIGIOT', 6);
define ('SIGBUS', 7);
define ('SIGFPE', 8);
define ('SIGKILL', 9);
define ('SIGUSR1', 10);
define ('SIGSEGV', 11);
define ('SIGUSR2', 12);
define ('SIGPIPE', 13);
define ('SIGALRM', 14);
define ('SIGTERM', 15);
define ('SIGSTKFLT', 16);
define ('SIGCLD', 17);
define ('SIGCHLD', 17);
define ('SIGCONT', 18);
define ('SIGSTOP', 19);
define ('SIGTSTP', 20);
define ('SIGTTIN', 21);
define ('SIGTTOU', 22);
define ('SIGURG', 23);
define ('SIGXCPU', 24);
define ('SIGXFSZ', 25);
define ('SIGVTALRM', 26);
define ('SIGPROF', 27);
define ('SIGWINCH', 28);
define ('SIGPOLL', 29);
define ('SIGIO', 29);
define ('SIGPWR', 30);
define ('SIGSYS', 31);
define ('SIGBABY', 31);
define ('PRIO_PGRP', 1);
define ('PRIO_USER', 2);
define ('PRIO_PROCESS', 0);
```
</details>
有了对应的英文称呼，我们可以更方便地记忆不同信号的意义。

除了上述的9也就是**SIGKILL**以外，这里主要讲**SIGINT**和**SIGTERM**。

* SIGINT：打断进程运行，也就相当于我们在会话终端执行`ctrl + c`
* SIGTERM：终止进程运行。这个命令要求进程自己退出。也就是说，当进程执行完当前的命令，完整保存好所有的数据后才会退出。可以保证正常退出。

:::tip SIGKILL和SIGINT的区别？
当我们向进程发送这两个信号时，进程都会立即退出，看起来似乎没什么区别。

实际上，SIGKILL是**不可被进程捕捉**的信号，只要发送，立即执行，而SIGINT则可以被进程拦截获取，延迟退出，在此之前进行一些其他的操作。
:::

### 安装信号处理器
除了SIGKILL以外的信号可以被捕捉，但是进程我们怎么获取信号，也需要在代码中进行相关的设置。

pctnl提供了[pcntl_signal](https://www.php.net/manual/zh/function.pcntl-signal.php)函数，用于安装进程对信号进行处理的处理器。

当然，在安装完信号处理器之后，我们还需要调用[pcntl_signal_dispatch](https://www.php.net/manual/zh/function.pcntl-signal-dispatch.php)，调用这些处理器等待信号。

```php
<?php
$pid = pcntl_fork();
if ($pid === -1) {  // 如果返回-1说明fork失败
    die('fork failed');
} else if ($pid > 0) {
    echo 'parent started...' . PHP_EOL;
    exit(0); // 父进程立即退出
}
posix_setsid();  // 子进程获取会话权
echo 'child started...' . PHP_EOL;

$loop = true;  // 死循环开关

// 捕捉SIGINT信号，在关闭之前写入日志
pcntl_signal(SIGINT, function ($signo) use (&$loop) {
    file_put_contents('loop.log', 'child stopped.');
    $loop = false;  // 通过引用的方式，关闭死循环。
});

while ($loop) {
    pcntl_signal_dispatch();  // 调用安装的信号处理器
}
```
运行脚本，创建出守护进程之后，使用终端对进程发送`kill -2`的命令，我们可以看到守护进程关闭之前，程序同级目录下产生了一个*loop.log*文件，里面记录了我们规定进程关闭前写入的信息。
### 题外话
刚才我们对进程通信，都是先通过终端获取进程的pid，然后对其发送kill信号命令来执行。这样的过程其实很麻烦。

参考Workerman（或者说其他的守护进程），我们可以在守护进程启动的时候，使用[posix_getpid](https://www.php.net/manual/zh/function.posix-getpid.php)函数获取自身的pid，然后保存到固定的位置。

接着在脚本程序中添加一道命令，接收一个stop参数，并从固定位置读取pid，使用[posix_kill](https://www.php.net/manual/zh/function.posix-kill.php)函数对进程发送停止信号。
<details>
<summary>查看代码</summary>
```php
<?php
$pidFile = 'loop.pid';

global $argv;  // 获取全局脚本变量

if (isset($argv[1]) && $argv[1] === 'stop') {  // 获取全局命令第二个参数
    $file_pid = file_get_contents($pidFile);
    if (!$file_pid) {  // 如果没有内容，说明进程未运行
        echo 'process is not run.' . PHP_EOL;
    } else {  // 对进程发出退出命令
        posix_kill($file_pid, SIGINT);
    }
    exit;
}
$pid = pcntl_fork();
if ($pid === -1) {  // 如果返回-1说明fork失败
    die('fork failed');
} else if ($pid > 0) {
    echo 'parent started...' . PHP_EOL;
    exit(0); // 父进程立即退出
}
posix_setsid();  // 子进程获取会话权
echo 'child started...' . PHP_EOL;


if (!is_file($pidFile)) {
    touch($pidFile);  // 如果pidFile不存在就创建
    chmod($pidFile, 0622);  // 并设置它的权限
}
$pid = posix_getpid();  // 获取pid
$fd = fopen('loop.pid', 'r');  // 获取loop.pid
if (!$fd || !flock($fd, LOCK_EX)) {  // 对资源文件进行独占锁，避免并发写入
    echo 'process already run.' . PHP_EOL;
    exit;
}
file_put_contents($pidFile, $pid);  // 将pid写入pidFile
flock($fd, LOCK_UN);  // 释放锁


$loop = true;  // 死循环开关

// 捕捉SIGINT信号，在关闭之前写入日志
pcntl_signal(SIGINT, function ($signo) use (&$loop, $pidFile) {
    file_put_contents('loop.log', '[' . date('Y-m-d H:i:s') . '] ' . 'child stopped.');
    @unlink($pidFile);  // 删除pidFile
    $loop = false;  // 通过引用的方式，关闭死循环。
});

while ($loop) {
    pcntl_signal_dispatch();
}
```
</details>

先后在shell中执行：
```sh
php src/loop.php
parent started...
child started...

php src/loop.php stop 
```
我们可以看到*loop.pid*创建又消失，进程也同步出现和消失。而*loop.log*则留下新的记录，表明进程来过又离去。

在代码中，使用[flock](https://www.php.net/manual/zh/function.flock.php)是为了对*loop.pid*进行独占性加锁，避免同时多道进程对其进行写入。一旦多个进程同时写入，就会发生阻塞。

## 总结
创建守护进程的步骤：首先创建出一个父进程，然后fork出子进程，接着设置子进程获取会话，最后退出父进程。子进程便成为了守护进程。

进程间可以通过信号进行通信，除了**SIGKILL**以外的信号可以被进程所捕获。捕获进程需要安装信号处理器，并在进程启动之后对处理器进行调用以等待信号的传入。

这些知识，不仅止于php，对于其他语言的编程也同样适用。