---
title: 简单socket编程
date: 2019-08-18 14:44:00
tags:
  - workerman
  - socket
category: php
---
本文作为【Workerman源码解读】系列的补充——
<!-- more -->
[[toc]]
:::tip Network socket？
socket是在计算机网络节点内收发数据的内部端点，是一种**系统资源**、网络通信接口。中文一般将其翻译为套接字。应用程序可以通过socket使用各种协议与其他主机进行通信。
:::
php分别有两套函数可以创建socket：
* [原始socket](https://www.php.net/manual/zh/ref.sockets.php)：允许对较低层协议（如IP或ICMP）进行直接访问，常用于网络协议分析，检验新的网络协议实现，也可用于测试新配置或安装的网络设备<sup>[[1]](https://baike.baidu.com/item/%E5%A5%97%E6%8E%A5%E5%AD%97/9637606)</sup>。
* [流式socket](https://www.php.net/manual/zh/ref.stream.php)：用于创建流式socket或数据报socket，可以发送可靠的数据传输服务（流式）或高效率的通信（数据报）。

## 创建socket服务
使用socket或stream函数，既可以创建客户端也可以创建服务端。本文主要探讨流式创建服务端相关内容。
### 原始socket函数
使用原始socket创建服务端，一共有三个步骤，分别是创建、绑定、监听，就像“<el-popover placement="top" trigger="hover"><div slot>第一步，打开冰箱；<br/>第二步，把大象放入冰箱；<br/>第三步，关上冰箱！</div><span slot="reference" style="color: #F56C6C; cursor: pointer">**把大象放入冰箱**</span></el-popover>”一样简单：
```php
<?php

// 创建
$mainSocket = socket_create(AF_INET, SOCK_STREAM,  SOL_TCP);
// 绑定
socket_bind($mainSocket, '127.0.0.1', 9501);
// 监听
socket_listen($mainSocket);
```
在创建的时候，需要指定使用的网络协议（ipv4），使用的socket类型（流式）， 具体网络协议（tcp）。

其次，将指定的地址和端口绑定到创建好的mainSocket资源上。

最后，开始监听接入这个mainSocket资源的连接。
:::tip
如果你要创建的是socket客户端，那么只需要将第三步替换为`socket_connect`函数。
:::
当然，这只是创建好了socket服务端，我们还需要使用下列函数进行接收客户端连接、读取客户端、写入客户端、关闭客户端等操作。
```php
while (true) {
    $newConn = socket_accept($mainSocket);
    echo "new connection[" . (int) $newConn . "] comes in." . PHP_EOL;
    $msg = socket_read($newConn, 65535);
    echo 'recv: ' . $msg . PHP_EOL;
    socket_write($newConn, 'read: ' . $msg . PHP_EOL);
    socket_close($newConn);
    echo "connection[" . (int) $newConn . "] closed";
}
```
为了挂起socket服务，需要使用死循环来维持状态。

在循环中，`socket_accept`的作用是接收一个接入mainSocket服务的客户端连接，它会返回一个同样是系统资源的socket连接。这个连接指向了一个客户端，可以在与这个客户端通信的过程中使用。

当没有连接接入的时候，`socket_accept`将会阻塞代码的执行，等待连接接入。

使用`socket_read`读取连接传输过来的内容，第二个参数用于指定读取长度。设定为**65535**是因为一个完整的ipv4包最大长度为65535——<el-popover placement="top" trigger="hover" content="This 16-bit field defines the entire packet size in bytes, including header and data. The minimum size is 20 bytes (header without data) and the maximum is 65,535 bytes. All hosts are required to be able to reassemble datagrams of size up to 576 bytes, but most modern hosts handle much larger packets. Sometimes links impose further restrictions on the packet size, in which case datagrams must be fragmented. Fragmentation in IPv4 is handled in either the host or in routers." title="Total Length"><span slot='reference'>ipv4包使用16位二进制记录长度，因此最大长度为$2^{16}$<sup>[[2]](https://en.wikipedia.org/wiki/IPv4)</sup></span></el-popover>。

接着，`socket_write`往客户端连接中写入内容，并且关闭这连接。

这里我们使用telnet作为客户端，对服务端进行访问——

启动脚本，然后在某个终端中使用telnet连接这个服务器，在连接之后输入任意内容，会收到服务器的应答，然后连接被关闭。
<details>
<summary>查看通信记录</summary>

**服务端记录**：
```sh
$ php socket.php
new connection[5] comes in.
recv: hello socket!

connection[5] closed

```
**telnet客户端记录**：
```sh
$ telnet 127.0.0.1 9501
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
hello socket!
read: hello socket!

Connection closed by foreign host.
```
</details>

### 流式socket函数
使用原始socket函数，三个步骤，需要记忆的参数比较多，包括协议、类型等，很容易遗忘。我们也可以使用更好记忆的stream系列函数创建服务器。
:::warning
注意，接下来本文主要围绕stream系列函数进行讨论。
:::

在刚才的case中，telnet发送一段内容后就会被关闭连接。如果我们要再次向服务端发送信息，还需要再次创建连接——使用短连接一方面频繁创建耗费资源，另一方面使用体验也很差。而socket的优点之一就是可以维持长连接。我们只需要在不关闭连接的前提下循环读取客户端连接就可以了：
```php
<?php

$mainSocket = stream_socket_server(
    'tcp://127.0.0.1:9501',
    $errno,
    $errstr,
    STREAM_SERVER_BIND | STREAM_SERVER_LISTEN
);

if (!$mainSocket) {
    die("failed $errno: $errstr" . PHP_EOL);
}

while (true) {
    $newConn = stream_socket_accept($mainSocket, -1);
    echo "new connection[" . (int) $newConn . "] comes in." . PHP_EOL;
    while (true) {
        if (!is_resource($newConn)) {
            break;
        }
        $msg = fread($newConn, 65535);
        if (!$msg || strstr($msg, 'quit')) {
            fclose($newConn);
            echo "connection[" . (int) $newConn . "] closed" . PHP_EOL;
            break;
        }
        echo "recv: " . $msg . PHP_EOL;
        fwrite($newConn, 'read:' . $msg . PHP_EOL);
    }
}
```
<details>
<summary>查看通信记录</summary>

**服务端记录**：
```sh
$ php block_stream.php
new connection[6] comes in.
recv: hello stream

recv: goodbye

connection[6] closed

```
**客户端记录**：
```sh
$ telnet 127.0.0.1 9501
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
hello stream
read:hello stream

goodbye
read:goodbye

quit
Connection closed by foreign host.
```
</details>

创建、绑定、监听三个步骤被合并到一个`stream_socket_server`函数中，第一个参数指定协议以及地址和端口，第二第三个参数用于接收错误代号和错误信息，第四个参数用于指定绑定以及监听两个常量（进行位运算的结果）的flag。

由于使用该函数创建的mainSocket是一个**fd**(file descriptor，文件描述符)，因此可以使用文件相关的操作函数进行读取、写入、关闭等。

在接收连接之后，使用无限循环来反复读取连接内容。当连接断开（此时读取到false）或者读取到quit的时候关闭fd，否则读取到其他内容时就做出写入响应。

这样我们就保持了一个长连接，直到主动退出为止。
## 非阻塞连接与阻塞进程
我们注意到一个问题，当一个客户端和服务端建立起长连接之后，除非连接断开，否则再也没有第二个客户端可以连接到服务端。如果强行连接只会得到一个阻塞排队的结果，这意味着当我们要建立多个连接，将会需要多个服务端进程来处理。

当然从上文代码中看，会阻塞的原因是由于我们使用了第二层死循环读取，在断开连接前，代码只会在这层循环中无限执行。我们可以对此作出一些修改，使其变成支持多个连接。

```php
<?php

$mainSocket = stream_socket_server(
    'tcp://127.0.0.1:9501',
    $errno,
    $errstr,
    STREAM_SERVER_BIND | STREAM_SERVER_LISTEN
);

if (!$mainSocket) {
    die("failed $errno: $errstr" . PHP_EOL);
}
$clients = [];  // 使用一个客户端数组来保存复数客户端连接

while (true) {
    $newConn = stream_socket_accept($mainSocket, -1);
    echo "new connection[" . (int) $newConn . "] comes in." . PHP_EOL;
    $clients[] = $newConn;  // 接收到新连接之后将其存入数组
    foreach ($clients as $client) {  // 遍历客户端数组，获取连接然后读取内容
        if (!is_resource($client)) {
            $key = array_search($client, $clients);
            unset($clients[$key]);
            continue;
        }
        $msg = fread($client, 65535);
        if (!$msg || strstr($msg, 'quit')) {
            fclose($client);
            echo "connection[" . (int) $client . "] closed" . PHP_EOL;
            break;
        }
        echo "recv[" . (int) $client . "]: " . $msg . PHP_EOL;
        fwrite($client, 'read:' . $msg . PHP_EOL);
    }
}
```
运行脚本，先创建一个telnet客户端1连接，发送随意内容，得到了服务端的响应；再次发送随意内容，这次却得不到响应了。当我们创建另一个telnet客户端2连接，发送随意内容，此时客户端1和2都得到了服务端的响应。可见，客户端1的第二次响应被阻塞直到客户端2接入。原因也很容易想到，是因为`stream_socket_accept`阻塞造成的。
<details>
<summary>查看通信记录</summary>

**服务端**：
```sh
$ php src/block_stream.php
new connection[6] comes in.
recv[6]: hello stream

new connection[7] comes in.
recv[6]: hello stream

recv[7]: hello stream2

```
**客户端1**：
```sh
$ telnet 127.0.0.1 9501
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
hello stream
read:hello stream

hello stream
read:hello stream
```
**客户端2**：
```sh
$ telnet 127.0.0.1 9501
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
hello stream2
read:hello stream2
```
</details>

虽然保持了多个客户端连接，但是客户端的通信却受到socket接收连接的阻塞限制，这样不能及时响应是个很大的问题。为此，stream系列函数还提供了`stream_select`和`stream_set_blocking`两个函数来解决问题。
### select复用I/O
`stream_select`调用了Unix的select函数，通过过滤挂起的连接来实现i/o复用。
:::tip I/O复用
在和某一客户端进行频繁通信的过程中，需要尽可能的利用同一个连接，也就是建立长连接，复用以节省资源消耗。在类Unix和POSIX标准的操作系统中，系统调用提供了[select](https://en.wikipedia.org/wiki/Select_(Unix))、[poll](https://en.wikipedia.org/wiki/Poll_(Unix))和[epoll](https://en.wikipedia.org/wiki/Epoll)这些技术来实现I/O复用。

其中，epoll可以解决[c10k问题](https://en.wikipedia.org/wiki/C10k_problem)。select只能同时保存1024个连接。本文仅用于举例，根本目的在于为Workerman源码阅读做知识预备——Workerman中则使用epoll来实现i/o复用。
:::
`stream_select`一共接收5个参数，分别是引用可读取fd数组、引用可写入fd数组、引用最高优先级fd数组、秒级超时、微秒级超时。

以可读fd数组为例，使用者将保存的所有连接以数组形式传入，`stream_select`则将有活动（可以被读取）的连接过滤出来，无活动的连接剔除。

上文中，`stream_socket_accept`读取会发生阻塞的原因是当前读取的连接无活动，所以造成了阻塞等待活动。而通过`stream_select`过滤，无活动的连接将不会传入`stream_socket_accept`，这样就解决了多连接响应阻塞的问题。

由于可读fd数组是以引用形式传入，所以我们需要复制一个连接数组副本，原本用于保存所有连接，副本用于接受过滤连接。然后在每轮新的循环开头获取原本，传递副本进行过滤。
```php
<?php

$mainSocket = stream_socket_server(
    'tcp://127.0.0.1:9501',
    $errno,
    $errstr,
    STREAM_SERVER_BIND | STREAM_SERVER_LISTEN
);

if (!$mainSocket) {
    die("failed $errno: $errstr" . PHP_EOL);
}
$clients = [$mainSocket];  // 使用一个客户端数组来保存复数客户端连接，包括了mainSocket自身

while (true) {
    $reads = $clients;  // 每轮循环复制一份连接副本
    if (stream_select($reads, $writes, $expects, 600) < 1) {
        continue;  // 如果没有任何活动则跳过本轮循环
    } else if (in_array($mainSocket, $reads)) {  // 如果mainSocket被过滤后依然存在，说明将产生新的客户端连接
        $newConn = stream_socket_accept($mainSocket, -1);
        echo "new connection[" . (int) $newConn . "] comes in." . PHP_EOL;
        $clients[] = $newConn;  // 将新的客户端连接存入客户端数组
        $key = array_search($mainSocket, $reads);
        unset($reads[$key]);  // mainSocket只用于接收新的客户端，不参与收发数据，需要从可读取数组中释放掉
    }
    foreach ($reads as $client) {  // 遍历可读取数组，获取连接然后读取内容
        if (!is_resource($client)) {
            $key = array_search($client, $clients);  // 如果这个资源已经失效，需要从客户端数组的原本中除去
            unset($clients[$key]);
            continue;
        }
        $msg = fread($client, 65535);
        if ($msg === false || strstr($msg, 'quit')) {
            $key = array_search($client, $clients);  // 如果这个连接被关闭，需要从客户端数组的原本中除去
            unset($clients[$key]);
            fclose($client);
            echo "connection[" . (int) $client . "] closed" . PHP_EOL;
            continue;
        }
        // 正常处理逻辑
        echo "recv[" . (int) $client . "]: " . $msg . PHP_EOL;
        fwrite($client, 'read:' . $msg . PHP_EOL);
    }
}
```
经过select处理的数组内容将会改变，可以通过前后打印进行比较：
|过滤前|过滤后|
|---|---|
|array(3) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;[0]=></br>&nbsp;&nbsp;&nbsp;&nbsp;resource(5) of type (stream)<br/>&nbsp;&nbsp;&nbsp;&nbsp;[1]=><br/>&nbsp;&nbsp;&nbsp;&nbsp;resource(6) of type (stream)<br/>&nbsp;&nbsp;&nbsp;&nbsp;[2]=><br/>&nbsp;&nbsp;&nbsp;&nbsp;resource(7) of type (stream)<br/>}|array(1) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;[0]=><br/>&nbsp;&nbsp;&nbsp;&nbsp;resource(6) of type (stream)<br/>}|

此时再次运行脚本，多个连接彼此间就不会相互阻塞，任何一个客户端都可以快速获得服务端的响应。
<details>
<summary>查看通信记录</summary>

**服务端**：
```sh
$ php src/block_stream.php
new connection[6] comes in.
new connection[7] comes in.
recv[6]: heelo select

recv[7]: hello select

recv[6]: goodbye

recv[7]: goodbye

connection[6] closed
connection[7] closed

```
**客户端1**：
```sh
$ telnet 127.0.0.1 9501
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
heelo select
read:heelo select

goodbye
read:goodbye

quit
Connection closed by foreign host.
```
**客户端2**：
```sh
$ telnet 127.0.0.1 9501
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
hello select
read:hello select

goodbye
read:goodbye

quit
Connection closed by foreign host.

```
</details>

### socket非阻塞
借助系统调用select，服务端在循环过程中不必处理无活动的fd，自然就不会因为等待接收或者读取而产生阻塞。

但是会造成阻塞的不仅仅是无活动fd，有活动的fd有时候也会造成阻塞：当客户端传输一个过大的数据，`fread`无法快速读取完毕，将会阻塞直到读取完毕。这一动作将会影响后续其他fd的工作。

通过`stream_set_blocking`将fd设置为读取非阻塞，就可以解决这个问题。

当设置读取非阻塞时，如果`fread`无法立即读取完毕fdA，则会立即返回空给进程，这样进程就可以立即进入下一轮fd的遍历，执行其他fd的响应动作。当全部fd处理完毕则进入下一轮循环，如此往复。直到某一轮循环中fdA读取完毕，才会执行fdA的响应动作。这样有效避免了读取阻塞影响其他fd。
```php
// ...
stream_set_blocking($mainSocket, false);

while (true) {
    // ...
    stream_set_blocking($newConn, false);
    // ...
}
```
验证这个函数的作用，可以在代码中读取完毕fd之后再次读取fd：由于fd已经没有内容可以读取，如果未设置读取非阻塞，则进程将会一直阻塞等待读取；如果设置读取非阻塞，则进程会获得空返回，进入下一轮fd遍历。
## http协议下的长连接
上文中，我们提及的场景一直是以telnet作为客户端。然而众所周知，http协议是无状态的，在1.0的时候与服务端的通信甚至全部都是短连接形式，直到1.1才支持长连接。

无状态的http是如何进行保持长连接的呢？实际上并不是http本身与服务端进行长连接通信，而是浏览器与服务端进行了长连接通信，而http进行通信时复用了浏览器提供的长连接罢了。

原本接下来我打算详细写一写关于http协议的**request**和**response**规范，报文格式等内容，无奈时间飞逝，整理前文已经耗尽我一天的时间。时间有限，先简略说说，留待日后补全。

从1.1开始，http的请求头和响应头中各自包含了一个**Connection**字段，它的值可以是`keep-alive`或者`close`。前者表示使用长连接，后者表示使用短连接。1.1默认使用开启长连接。

需要注意的是，协议只是一种约定，不表示强制。即使客户端请求了长连接，也需要服务端在接收到这一请求之后选择不关闭连接，并返回通知同样的约定才有效。而客户端在收到长连接回应或者请求之后，也需要选择不关闭连接才能使连接不断开，起到复用的目的。此前我在网上查找资料的时候曾看到“长连接只需要任意一端发起即可生效”的错误说法，这样的论断大概是说话之人没有动手写过socket编程，只流于表面的测试得出的结论。

下面附上可以复用长连接与postman进行http通信的demo：
<details>
<summary>展开查看</summary>

```php
<?php

$mainSocket = stream_socket_server('tcp://127.0.0.1:9501', $errno, $errstr, STREAM_SERVER_BIND | STREAM_SERVER_LISTEN);

stream_set_blocking($mainSocket, false);  // 设置为非阻塞

$clients = [$mainSocket];

$onMessage = function ($conn, $data) {  // 回调处理传入。平时写业务代码就是这个部分
    fwrite($conn, json(['code' => 200, 'status' => 1, 'data' => [
        'greeting' => 'hello ' . $data['user'],
        'recv' => $data
    ]]));
};

while (true) {
    $reads = $clients;
    if (stream_select($reads, $writes, $excepts, 600) <= 0) {
        continue;
    }
    // 经过select的修改，reads的内容会变，重排顺序
    if (in_array($mainSocket, $reads)) {  // 当主socket活动，说明有新的客户端连接
        $newConn = stream_socket_accept($mainSocket);
        echo 'new connection[' . (int) $newConn . '] comes in.' . PHP_EOL;
        stream_set_blocking($newConn, false);
        $clients[] = $newConn;  // 将新连接放入客户端列表保存
        $key = array_search($mainSocket, $reads);
        unset($reads[$key]);  // 要去除主socket，不需要被轮询
    }
    foreach ($reads as $client) {
        $msg = fread($client, 65535);
        if (!$msg || strstr($msg, 'quit')) {
            echo 'close[' . (int) $client . ']' . PHP_EOL;
            $key = array_search($client, $clients);
            unset($clients[$key]);
            fclose($client);
        } else {
            echo 'recv[' . (int) $client . ']: ' . PHP_EOL . $msg . PHP_EOL;
            call_user_func($onMessage, $client, decode($msg));
        }
    }
}

function decode($buffer) {
    list($header,) = explode("\r\n\r\n", $buffer);
    $method = substr($header, 0, strpos($header, ' '));  // 解析请求方法
    preg_match("/\r\nContent-Type: ?(\d+)/i", $header, $matche);  // 获取请求正文的长度
    $content_length = $match[1] ?? 0;
    $request_lenght = $content_length + strlen($header) + 4;  // strlen("\r\n\r\n") === 4
    $poststr = substr($buffer, strlen($header) + 4);  // 获取请求正文
    $list = explode('&', $poststr);  // 拆分post请求正文的内容
    $postData = [];
    foreach ($list as $str) {
        list($key, $value) = explode('=', $str);
        $postData[$key] = $value;
    }
    return $postData;  // 返回拆分重组的post请求字段
}

function json($arr) {
    $content = json_encode($arr);
    $header = 'HTTP/1.1 200 ok' . "\r\n";
    $header .= 'Content-Type: application/json' . "\r\n";
    $header .= 'Connection: keep-alive' . "\r\n";
    $header .= 'Content-Length: ' . strlen($content) . "\r\n";
    $header .= "\r\n";
    return $header . $content;
}
```
</details>

-><lazy-image src="/images/A1CCC7E8-4613-45DD-ABCF-B70ECD6E143D.png" /><-
-><lazy-image src="/images/43C29F14-A6A3-4863-9117-6B2141787E8B.png" /><-
## 总结
* http实际上是tcp的封装，本质还是tcp连接。
* 使用系统调用select可以对io进行复用，只处理有活动的连接
* 设置stream无阻塞可以避免网络读取过程中的阻塞，是select之后的解决读取阻塞的手段。
* 注意区分进程阻塞和socket阻塞。本文提到的两个函数只是解决socket阻塞对进程产生的影响。但是响应过程中的其他io阻塞依然会阻塞进程，这一点正是Workerman和Swoole的区别。Swoole的底层协程调度可以避免响应过程中其他io对进程造成的阻塞。