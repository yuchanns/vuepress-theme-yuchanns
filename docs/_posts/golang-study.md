---
title: 《Go语言学习笔记》要点随记（一）
date: 2019-09-26 00:56:00
category: golang
---
阅读《Go语言学习笔记》随手摘抄——
<!-- more -->
-><lazy-image src="/images/golang-study.jpg" /><-

[[TOC]]

<details>
<summary>kmpIndex by golang</summary>

```go
package main

import (
	"bytes"
	"errors"
	"fmt"
	"time"
)

func getNext(s string, next []int) {
	j, i := -1, 0
	length := len(s)
	next[0] = -1
	for i < (length - 1) {
		if j == -1 || s[i] == s[j] {
			i++
			j++
			if s[i] == s[j] {
				next[i] = next[j]
			} else {
				next[i] = j
			}
		} else {
			j = next[j]
		}
	}
}

func kmpIndex(s, sub string) (int, error) {
	fmt.Println("Comparing: ", s, " with ", sub)
	length := len(s)
	slength := len(sub)
	next := make([]int, slength)
	getNext(sub, next)
	i, j := 0, 0
	var a, b bytes.Buffer
	a.Grow(length)
	b.Grow(length)
	for (i < length) && (j < slength) {
		if j != -1 {
			a.WriteString(string(s[i]))
			b.WriteString(string(sub[j]))
			fmt.Println("Comparing: ", a.String(), " with ", b.String())
		}
		if j == -1 || s[i] == sub[j] {
			if j == -1 {
				a.Reset()
				b.Reset()
			}
			j++
			i++
		} else {
			j = next[j]
		}
		time.Sleep(time.Second)
	}
	if j == slength {
		return i - j, nil
	}
	return 0, errors.New("Not found")
}

func main() {
	result, err := kmpIndex("ABABCABCABABA", "ABABA")
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Match completed on index:", result)
	}
}

```
</details>

## 数据
* 退化赋值操作：前提条件：至少有一个新变量被定义，且必须是同一作用域
  ```go
  func main() {
    x := 100  // 定义新变量
    println(&x)

    x, y := 200, "abc"  // 只有y是被定义的新变量
    
    println(&x, x)
    println(y)

    {
      x, y := 200, 300  // 不同作用域，是新变量
      println(&x, x, y)
    }

    x := 300  // 错误
  }
  ```

* 全局变量无**未使用错误**

* 符号名字首字母大小写决定了作用域。首字母大写的为导出成员，可被包外引用

* 常量无**未使用错误**

* 常量组中如不指定类型和初始化值，与上一行非空常量右值相同
  ```go
  func main() {
    const (
      x uint16 = 120
      y  // 与x类型相同
      s = "abc"
      z  // 与s类型相同
    )
  }
  ```

* 使用iota实现一组自增常量值来实现枚举类型。自增默认数据类型为int，可显式指定
  ```go
  const (
    x, a = iota, iota * 10  // 0, 0 * 10
    y, b                    // 1, 1 * 10
    z, c                    // 2, 2 * 10
  )
  ```

* 常量无法读取地址

* 无类型声明的常量不会做强类型检查
  ```go
  const x = 100
  const y byte = x  // 相当于 const y byte = 100

  const a int = 100  // 显式指定类型
  const b byte = a  // 错误
  ```

* `byte`是`uint8`的别名，`rune`是`int32`的别名，但`int`不是`int64`的别名

* slice、map、channel是引用类型

* 语法歧义：转换的目标是指针、单向通道或没有返回值的函数类型，要用括号
  ```go
  (*int)(p)
  (<-chan int)(c)
  (func())(x)
  (func()int)(x)
  ```

* 函数返回局部指针是安全的

* 函数不支持有默认值的可选参数，不支持命名实参，必须安签名顺序传递指定类型和数量的实参

* 变参本质上是切片。将切片作为变参，需要展开操作。如果是数组，要转换成切片。切片可修改原数据

* 命名参数可由return隐式返回
  ```go
  func div(x, y int) (z int, err error) {
    if y == 0 {
      err = errors.New("division by zero")
      return
    }
    z = x / y
    return
  }
  ```

* 普通函数和匿名函数都可以作为结构体字段或经通道传递

* go交叉编译：
  ```sh
  GOOS=linux GOARCH=amd64 go build -gcflags "-N -l" -v  
  ```

* 慎用`defer`，在main中循环读取文件时如果使用defer只会在main结束时调用。应把循环内部逻辑独立成函数，在内部调用defer，这样才函数结束时就会调用。defer降低性能

* 不建议使用`panic`，除非是不可恢复性的错误

* 拼接动态字符串可用`strings.Join`或`bytes.Buffer`
  ```go
  stringA := strings.Join([]string{"a", "a", "a"}, "")

  var b bytes.Buffer
  b.Grow(3)  // 预先准备足够的内存

  for i := 0; i < 3; i++ {
    b.WriteString("a")
  }

  stringB := b.String()
  ```

* 访问不存在的键值，使用ok-idiom模式判断
  ```go
  func main() {
      m := map[string]int{
          "a": 1,
          "b": 2,
      }

      m["a"] = 3  // 修改
      m["c"] = 4  // 新增

      if v, ok := m["d"]; ok {
          println(v)
      }

      delete(m, "d")  // 删除键值对
  }
  ```

* 字典`no addressable`，不能直接修改value成员（结构或数组），应该返回整个value，修改完毕后设置字典键值，或使用指针类型（指值是指针）
  ```go
  type user struct {
      name string
      age byte
  }

  func main() {
      m := map[int]user{
          1: {"Tom", 19},
      }

      u := m[1]
      u.age += 1
      m[1] = u

      m2 := map[int]*user{
          1: &user{"Jack", 20},
      }

      m2[1].age++
  }
  ```

* 字典初始化为空，未初始化则为nil，nil无法赋值，可以读
  ```go
  func main() {
      var m map[string]int
      println(m["a"])  // nil
      m["a"] = 1  // panic
      
      m2 := map[string]int{}

      fmt.Println(m == nil, m2 == nil)  // true false
  }
  ```
* 字典迭代期间增删键值是**安全**的。不能对字典进行并发操作，会导致进程崩溃
  * 启用`data race`检查问题
    ```sh
    go run -race test.go
    ```
  * 使用`sync.RWMutex`实现同步，避免读写操作同时进行
    ```go
    import (
      "sync"
      "time"
    )

    func main() {
      var lock sync.RWMutex
      m := make(map[string]int)

      go func() {
        for {
          lock.Lock()
          m["a"] += 1
          lock.Unlock()

          time.Sleep(time.Microsecond)
        }
      }()

      go func() {
        for {
          lock.RLock()

          _ = m["b"]
          lock.RUnlock()

          time.Sleep(time.Microsecond)
        }
      }()

      select {}
    }
    ```

* 字典对象本身就是指针包装；在创建时预先准备足够的空间有助于提升性能，减少扩张时的内存分配和重新哈希操作；对于海量小对象直接用字典存储键值拷贝数据，缩短gc时间；字典不会收缩内存，可适当替换成新对象
## 结构体
* 结构体建议使用命名初始化，否则作为字段类型时无法直接初始化；只有字段类型全部支持时，才能做相等操作；可使用指针操作结构字段，不能是多级指针
  ```go
  func main() {
      type file struct {
          name string
          attr struct {  // 匿名结构类型字段
              owner int
              perm  int
          }
      }

      f := file{
          name: "test",

          // attr: {  // 错误
          //     owner: 1,
          //     perm:  0755,
          // },
      }

      f.attr.owner = 1  // 正确方式
      f.attr.perm = 0755
  }
  ```

* 空结构自身和作为数组元素类型长度都为0。可作为通道元素类型用于事件通知
  ```go
  func main() {
    exit := make(chan struct{})

    go func() {
      println("hello, world!")
      exit <- struct{}{}
    }()

    <-exit
    println("end.")
  }
  ```
* 匿名字段隐式地以类型名作为字段名，其成员可直接引用，但初始化时需当做独立字段；如嵌入其他包中的类型，则隐式字段名不包括包名；不能将基础类型和其指针同时嵌入，因为两者隐式名字相同；如果出现重名，就无法直接引用，需显式字段引用
  ```go
  type attr struct {
    perm int
  }

  type file struct {
    name string
    attr
    os.File
  }

  func main() {
    f := file{
      name: "test",
      attr: attr{  // 显式初始化匿名字段
        perm: 0755,
      },
      File: os.File()  // 不含包名
      *int
      // int  // 不可同时嵌入
    }

    f.perm = 0644  // 直接引用匿名字段成员
    println(f.perm)
  }
  ```
* 字段标签不是注释，是描述字段的元数据，**是**类型的组成部分，**不属于**数据成员。可用反射获取，常被用于格式校验、数据库关系映射等
  ```go
  type user struct {
    Name string `string:"昵称"`
    Sex  byte   `byte:"性别"`
  }

  func main() {
    u := user{"yuchanns", 1}
    v := reflect.ValueOf(u)
    t := v.Type()

    for i, n := 0, t.NumField(); i < n; i++ {
      fmt.Printf("%s: %v\n", t.Field(i).Tag, v.Field(i))
    }
    // string:"昵称": yuchanns
    // byte:"性别": 1
  }
  ```

* 在内存分配时，字段须做对齐处理，通常以所有字段中最长的基础类型宽度为标准。如果仅有空结构类型字段或其是最后一个字段，会按1对齐，长度为0

* 结构体的方法接收一个前置参数，称作receiver，类似于类中的this；receiver可以是任何**除接口和指针以外**的类型；当它是基础类型时，在方法中被调用是以复制的形式，是指针类型时，不会被复制；指针类型的receiver必须是合法指针（包括nil）或能取得实例地址；不能用多级指针调用方法
  ```go
  type Name int

  func (receiver Name) test() {
    receiver++
    println("test:", receiver)
  }

  func (receiver *Name) testPointer() {
    *receiver++
    println("testPointer:", *receiver)
  }

  func main() {
    var t Name = 1
    t.test()  // test: 2
    println("after test:", t)  // after test: 1
    t.testPointer()  // testPointer: 2
    println("after testPointer:", t)  // after testPointer: 2
  }
  ```

* 选择receiver的类型：
  * 指针类型
    * 需要修改实例状态
    * 大对象（减少复制成本）
    * 包含Mutex等同步字段（避免锁操作无效）
    * 无法确定的状况
  * 普通类型
    * 无需修改状态的小对象和固定值
    * 引用类型、字符串、函数等指针包装对象

* 可以像访问匿名字段成员那样来调用方法，同样具有同名遮蔽问题，可以利用这点实现覆盖操作

* 方法集决定结构体是否实现了某个接口
  * 类型T方法集合包含所有的receiver T方法
  * 类型*T方法集包含所有的receiver T + *T方法
  * 匿名嵌入S，T方法集包含所有receiver S方法
  * 匿名嵌入*S，T方法集包含所有receiver S + *S方法
  * 匿名嵌入S或*S，\*T方法集包含所有receiver S + *S方法

* 接口无需显式声明，可以先实现类型再抽象出接口。这种非侵入式设计方便代码重构时**解耦**分离接口，同时也便于**使用第三方库时抽象出所需的接口**，屏蔽不必关注的内容，也便于日后替换

* 接口不能有字段、不能定义方法、可以声明方法、可以嵌入其他接口

* 下面这段代码体现了**方法集决定是否实现了某个接口**的规则
  ```go
  package main

  type tester interface {
    test()
    string() string
  }

  type data struct{}

  func (*data) test() {}  // 这里的receiver使用的是指针

  func (data) string() string {
    return "teset"
  }

  func getString(t tester) {
    println(t.string())
  }

  func main() {
    var d data

    var t tester = &d  // 根据方法集，类型*T的方法集包含T + *T方法
    t.test()
    println(t.string())

    getString(&d)  // 同理
  }
  ```

* 嵌入其他接口，不能有方法同名，因为不支持重载；不能嵌入自身，会引起递归错误；超集可隐式转换为子集，反正不行；支持匿名接口类型，可直接用于变量定义或作为结构字段类型

* 只有当接口变量内部的两个指针（itab, data）都为nil时，接口才为nil。因此引发的常见错误如下：
  ```go
  package main

  type TestError struct{}

  func (*TestError) Error() string {
    return "error"
  }

  func test(x int) (int, error) {
    var err *TestError

    if x < 0 {
      err = new(TestError)
      x = 0
    } else {
      x += 100
    }

    return x, err
  }

  func main() {
    x, err := test(100)
    if err != nil {
      println(err) // 此处会被执行，因为err有类型，实现了error接口，且接口不为空
    }

    println(x)
  }

  ```
  正确做法：
  ```go
  package main

  type TestError struct{}

  func (*TestError) Error() string {
    return "error"
  }

  func test(x int) (int, error) {
    if x < 0 {
      return 0, new(TestError)
    }

    return x + 100, nil // 正确做法是明确返回nil
  }

  func main() {
    x, err := test(100)
    if err != nil {
      println(err) // 不会执行
    }

    println(x)
  }
  ```

* 类型推断可将接口还原为原始类型或判断是否实现了某个更为具体的接口类型
  ```go
  package main

  import "fmt"

  type data int

  func (d data) String() string {
    return fmt.Sprintf("data:%d", d)
  }

  func main() {
    var d data = 15
    var x interface{} = d

    if n, ok := x.(fmt.Stringer); ok { // 判断是否实现了Stringer接口
      fmt.Println(n)
    }

    if d2, ok := x.(data); ok { // 还原为原始类型
      fmt.Println(d2)
    }

    switch v := x.(type) { // 仅可在switch中使用x.(type)来获取接口类型并进行判断
    case nil:
      println("nil")
    case fmt.Stringer:
      fmt.Println(v)
    default:
      println("unknown")
    }

    e := x.(error) // 会引发panic，因为并没有实现error接口。如果使用ok-idiom模式不会引发panic
    fmt.Println(e)
  }

  ```
## 并发
* 并发goroutine会因为延迟执行立即复制参数。main函数需要通过通道阻塞或`sync.WaitGroup`计数器阻塞来等待goroutine执行
  ```go
  package main

  import (
    "sync"
    "time"
  )

  var c int

  func counter() int {
    c++
    return c
  }

  func main() {
    //exit := make(chan struct{}) // 使用通道进行通知
    var wg sync.WaitGroup
    a := 100

    wg.Add(1) // 虽然是原子操作，但需要在goroutine外累加计数器，否则可能会来不及执行动作
    go func(x, y int) {
      defer wg.Done() // 执行完毕递减计数器
      time.Sleep(time.Second)
      println("go:", x, y)

      //close(exit) // 执行完毕，通知通道关闭
    }(a, counter()) // 延迟执行，所以立即复制参数，此处a为100，而全局参数c为1

    a += 100
    println("main:", a, counter())
    //<-exit // 阻塞等待通道关闭
    wg.Wait() // 阻塞等待计数器为0
    println("main exit.")
  }
  ```

* `Gosched`可暂停当前任务释放线程去执行其他任务，然后等下次调度恢复执行；`Goexit`可以终止当前任务进行，并确保所有`defer`调用被执行，不会影响其他并发任务，不会引发panic，无法被捕获

* 使用**CSP**（Communicating Sequential Process<sup>[[1]](https://en.wikipedia.org/wiki/Communicating_sequential_processes)</sup>）通道通信来代替内存共享，实现并发安全；使用内置函数`cap`获取通道长度，`len`获取已缓冲数量
  ```go
  func main() {
    exit := make(chan struct{}) // 通道用作事件通知
    c := make(chan int, 3) // 通道用作通信

    go func() {
      c <- 1
      c <- 2
      c <- 3
      println("len in goroutine:", len(c)) // 3
      close(exit) // 关闭通道
    }()

    println("cap:", cap(c)) // 3
    println("len in main:", len(c)) // 0

    <-exit // 阻塞等待通道关闭

    println(<-c) // 取出goroutine传入csp通道的数据
    println(<-c)
    println(<-c)
  }
  ```

* 可使用ok-idiom和range处理收发数据
  ```go
  func main() {
    done := make(chan struct{})
    c1, c2 := make(chan int), make(chan int)

    go func() {
      for {
        x, ok := <-c1
        if !ok {
          return
        }

        println("ok-idiom:", x)
      }
    }()

    go func() {
      defer close(done)

      for x := range c2 {
        println("range:", x)
      }

      time.Sleep(time.Second)  // 避免协程1执行未完毕
    }()

    c1 <- 1
    c1 <- 2
    c1 <- 3
    close(c1) // 关闭通道不代表通道被释放，可以从已关闭的通道读取数据
    c2 <- 1
    c2 <- 2
    c2 <- 3
    close(c2) // 但是往已关闭通道发送数据会引发panic
    <-done
  }
  ```

* 一次性事件使用close效率更好，连续或多样性事件可通过传递不同的数据标志或使用`sync.Cond`实现；无论收发，nil通道都会阻塞，关闭nil通道会引发panic

* 可使用类型转换来限制通道方向获得单向通道；单向通道不可逆向操作，不可转换为双向，不能close接收端
  ```go
  c := make(chan int)
	var send chan<- int = c // 只发送
  var recv <-chan int = c // 只接收
  close(c)  // 直接关闭通道c即可
  ```

* 使用`select`随机选择多个通道中的一个，当然同一个通道也可以case随机；所有通道不可用时会使用`default`；将已完成的通道设置为nil就会被阻塞不再被select选中
  ```go
  func main() {
    var wg sync.WaitGroup
    wg.Add(2)

    a, b := make(chan int), make(chan int)

    go func() { // 接收
      defer wg.Done()

      for {
        var (
          name string
          x    int
          ok   bool
        )

        select {
        case x, ok = <-a:
          if !ok { // 设为nil将会阻塞不再被选中
            a = nil
            println("set a nil")
            break
          }
          name = "a"
          println(name, x)
        case x, ok = <-b:
          if !ok { // 设为nil将会阻塞不再被选中
            b = nil
            println("set b nil")
            break
          }
          name = "b"
          println(name, x)
        }

        if a == nil && b == nil {
          return
        }
      }
    }()

    go func() { // 发送
      defer wg.Done()
      defer close(a)
      defer close(b)

      for i := 0; i < 10; i++ {
        select {
        case a <- i:
        case b <- i * 10:
        }
      }
    }()

    wg.Wait()
  }
  ```

* 还可以用default来执行一些其他逻辑，比如说扩充通道
  ```go
  data := []chan int{
    make(chan int, 3)
  }
  // 中间省略
  go func() {
    for i := 0; i < 10; i++ {
      select {
      case data[len(data)-1] <- i:  // 持续取最后一个通道
      default:  // 通道满了生成新的通道
        data = append(data, make(chan int, 3))
      }
    }
  }()
  ```

* 实例：通过工厂模式组装带有通道和协程功能的对象，利用上面提到的方法集匿名嵌入结构
  ```go
  package main

  import (
    "fmt"
    "sync"
  )

  type Receiver struct {
    sync.WaitGroup
    data chan int
  }

  func NewReceiver() *Receiver {
    r := &Receiver{
      data: make(chan int),
    }

    r.Add(1)
    go func() {
      defer r.Done()
      for x := range r.data {
        fmt.Println("recv:", x)
      }
    }()

    return r
  }

  // 闭包方式省去close和Wait操作
  func (r *Receiver) Invoke(f func(r *Receiver)) {
    f(r)
    close(r.data)

    r.Wait()
  }

  func main() {
    r := NewReceiver()
    r.Invoke(func(r *Receiver) {
      r.data <- 1
      r.data <- 2
    })
  }
  ```

* 上面利用了匿名函数，可以使用户节省书写close和Wait的工夫；可以用于Pool比如mysql连接池，调用Invoke方法自动从通道取出一个有效连接，传递给闭包使用，接着自动放回通道中；

* 单个数据传输，由于频繁加锁会造成性能问题，可以将数据打包，减少传输次数，利用内存换取性能提升；goroutine处于接收或发送的阻塞状态，一直未被唤醒，不会gc，会造成资源泄露

* 使用锁的时候注意使用指针receiver，避免因复制导致锁失效；不支持递归锁；性能要求高的场景避免使用defer


---
未完待续 >>