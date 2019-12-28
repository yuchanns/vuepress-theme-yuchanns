---
title: 动手实现简单协程（一）
date: 2019-11-16 19:50:00
tags:
  - coroutine
category: php
---
协程(**Coroutine**)是一种进程中主动允许暂停和恢复执行子例程的非抢占式多任务执行组件<sup>[[1]](https://en.wikipedia.org/wiki/Coroutine)</sup>。
<!-- more -->

如果你现在打开搜索引擎，对这一概念进行搜索，往往会得到“协程是一种微线程”、“是一种纯用户态的线程”等解释。这类说法并无错误，但往往干巴巴加抽象，让人一头雾水不知实体。实际上协程既不是线程，也不是进程，它可以在线程中实现，也可以在进程中实现，也可以和多线程结合使用。协程的实现复杂和麻烦，但本质却很简单。

协程的本质是`在单一的进程或单一的线程内通过模拟系统进程的切换等特性主动对一系列任务的让出(yield)和恢复(resume)进行调度`。

[[toc]]

其中的重点就是**中断**特性。

## 生成器
`yield`<sup>[[2]](https://www.php.net/manual/zh/language.generators.syntax.php)</sup>是php 5.5.0版本后加入的一个语言关键字。只能在函数体内部使用，作用是允许函数执行中断。例如：
```php
<?php

function test()
{
    for ($i=0; $i<10; $i++) {
        yield $i;
    }
}
foreach (test() as $item) {
    echo $item;
}
```
乍看之下，这个关键字造成的效果似乎和循环没什么区别，实际不然。如果你使用`var_dump`打印该函数会发现返回值是一个对象；进而获取其所属类，将会得到**Generator**<sup>[[3]](https://www.php.net/manual/zh/class.generator.php)</sup>这个类。
```php
var_dump(test());
// object(Generator)#1 (0) {
// }
echo get_class(test());  // Generator
```

这是一个生成器类，实现了迭代器(**Iterator**)接口。他一共有以下8个方法：
|方法|作用|
|---|---|
|current|返回当前产生的值|
|key|返回当前产生的键|
|next|继续生成|
|rewind|重置|
|send|向生成器发送一个值|
|throw|向生成器抛入一个异常|
|valid|检查是否被关闭|
|__wakeup|序列化回调|

生成器通过yield标识的位置产生中断，因此在上述例子中每次调用生成器才会生成返回一个i，而不是一次性生成10个i。当i最大值可观时，可以节省很多内存（比如，调用`range(0, 1000000)`将导致内存占用超过 100 MB，而使用生成器只需要不到1K字节的内存）。

利用这种中断特性，我们就可以实现协程。

上面我们提到，协程这一个概念可以使进程主动暂停和恢复执行子例程。程序编写者通过yield关键字来指定代码让出执行权的位置，并通过循环进行调度，就可以并发地执行两个方法（即子例程）。看下面这段代码：

```php
<?php
/**
 * 实现一个打印方法，将内容输出到终端中
 */
function printToConsole($msg)
{
    return fputs(STDOUT, $msg . PHP_EOL);
}

function task1()
{
    for ($i=0; $i<10; $i++) {
        yield printToConsole("task1 iter{$i}");
    }
}

function task2()
{
    for ($i=0; $i<5; $i++) {
        yield printToConsole("task2 iter{$i}");
    }
}

$list[] = task1();
$list[] = task2();

while (count($list) > 0) {
    foreach ($list as $k => $v) {
        $v->send('');  // 通过send方法调用生成器进行迭代
        if (!$v->valid()) {  // 当生成器不可用时剔除掉此生成器
            unset($list[$k]);
        }
    }
}
```

运行代码，我们得到了两个循环函数并发执行的结果。
<details>
<summary>输出结果</summary>
```sh
task1 iter0
task1 iter1
task2 iter0
task2 iter1
task1 iter2
task2 iter2
task1 iter3
task2 iter3
task1 iter4
task2 iter4
task1 iter5
task1 iter6
task1 iter7
task1 iter8
task1 iter9
```
</details>

## Task类
仔细观察上面的输出结果，发现在前四个输出中，task1连续执行了两次，接着是task2连续执行两次，然后才是两个task并发执行。会造成这种行为的原因是生成器在产生并赋予变量之后，就会立即执行第一个yield——详细内容可以阅读这篇文章《PHP yield分析》<sup>[[4]](https://www.cnblogs.com/lynxcat/p/7954456.html)</sup>——为此，我们可以通过手动调用`rewind`，阻止（实际上是重置）其自动调用来防止这种行为。

我们通过编写一个**Task**类来包装子例程，控制其行为。这个类接受例程id和一个生成器。它将例程id作为子例程的id号（我们称为协程id），使用isFinished包装生成器的valid方法。比较瞩目的是run方法，主要做了两件事：第一次调用生成器的时候手动操作rewind将其重置，并返回第一次生成结果；第二次以后返回通过send来调用生成行为的结果。
```php
<?php

class Task
{
    protected $taskId;
    protected $coroutine;
    protected $beforeFirstYield = true;

    public function __construct($taskId, Generator $coroutine)
    {
        $this->taskId = $taskId;
        $this->coroutine = $coroutine;
    }

    public function getTaskId()
    {
        return $this->taskId;
    }

    public function isFinished()
    {
        return !$this->coroutine->valid();
    }

    public function run()
    {
        if ($this->beforeFirstYield) {
            $this->beforeFirstYield = false;
            $this->coroutine->rewind();
            return $this->coroutine->current();
        }
        $ret = $this->coroutine->send(null);
        return $ret;
    }
}
```
于是，我们可以通过Task实例来实现上面的协程例子：
```php
<?php
// 因为上面的while嵌套循环实在太丑效率也低，我决定使用双向链表队列来代替list保存子例程
// 队列的FIFO特性保证子例程次序执行
$queue = new SplQueue();
$queue->enqueue(new Task(1, task1()));
$queue->enqueue(new Task(2, task2()));

while (!$queue->isEmpty()) {  // 在队列空之前持续循环
    $task = $queue->dequeue();  // 出列一个子例程
    $task->run();
    if (!$task->isFinished()) {  // 若子例程仍可用
        $queue->enqueue($task);  // 就再次入列
    }
}
```
再次执行脚本。可以得到两个例程次第并发执行的结果。

## 实现调度器
即使这样，这段代码还是有不少不便的地方。比如，每次使用协程的时候，都需要手写while循环，进行出列入列判断可用性等操作。这一过程可称作调度行为。

基于上述调度不便的原因，我们需要实现一个调度器类，节省使用者每次编写这些判断代码的麻烦。

```php
<?php

class Scheduler
{
    protected $maxTaskId = 0;
    protected $taskQueue;

    public function __construct()
    {
        $this->taskQueue = new SplQueue();
    }

    public function newTask(Generator $coroutine)
    {
        $tid = ++$this->maxTaskId;  // 调度器自动递增协程id
        $task = new Task($tid, $coroutine);
        $this->schedule($task);
        return $tid;
    }

    public function schedule(Task $task)
    {
        $this->taskQueue->enqueue($task);
    }

    public function run()
    {
        while (!$this->taskQueue->isEmpty()) {
            /**
             * @var $task Task
             */
            $task = $this->taskQueue->dequeue();
            $task->run();
            if (!$task->isFinished()) {
                $this->schedule($task);
            }
        }
    }
}
```

最后，我们通过调度器可以很方便地实现协程了——
```php
<?php

$scheduler = new Scheduler();
$scheduler->newTask(test1());
$scheduler->newTask(test2());
$scheduler->run();
```

## 总结
我们从一个简单的生成器代码案例入手，逐步根据需求实现了Task类和调度器类，代码趋于复杂，同时也便于复用节省麻烦。但无论如何，协程的本质并未变化，依旧是`在单一的进程或单一的线程内通过模拟系统进程的切换等特性主动对一系列任务的让出(yield)和恢复(resume)进行调度`。

当然，一个简单协程的实现不仅仅如此，正如上面所说的对进程的模拟，自然还包括模拟系统调用、信号传递、fork等等特征，下次再说 :)。