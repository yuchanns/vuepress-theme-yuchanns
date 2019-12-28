---
title: go对sql连接的并发处理
date: 2019-12-14 20:49:00
category: golang
tags:
  - gorm
  - sql
  - goroutine
  - channel
---
对于多个请求并发连接数据的操作，在没有看gorm以及标准库的源码之前，凭借我使用swoole的经验，我的想法是：在启动进程时，一次性创建一系列数据库长连接，然后使用通道来存储这些连接。这么做既可以防止同一个连接被同时使用，还可以跨协程分发连接。

事实上标准库也是这么做的。
<!-- more -->

-><lazy-image src="/images/strong_hamster.jpg" /><-

[本文由笔者一边思考写就，可能语言不够简练，留待日后修整]

## 数据库连接的处理
这部分go标准库**database/sql**已经帮我们完成了。简要了解一下。

我们知道，使用gorm创建数据库连接，需要调用**Open**方法。查看此方法源码，发现它会返回一个**gorm.DB**结构体的实例。而这个结构体中，有一个字段是db，此字段的类型是**gorm.SQLCommon**接口类：

以mysql为例，该字段值通过调用database/sql包的**Open**方法生成。而sql.Open又调用了**sql.OpenDB**方法。此方法会返回一个**sql.DB**结构体的实例，这个结构体的方法有点多，仔细看可以发现实现了Exec、Prepare、Query、QueryRow这四个方法，因此可以说它就是SQLCommon的实现（golang的接口判定规则真是奇妙）。

:::tip sql.OpenDB方法说明
// The returned DB is safe for concurrent use by multiple goroutines

// and maintains its own pool of idle connections. Thus, the OpenDB

// function should be called just once. It is rarely necessary to

// close a DB.
:::

通过上面的说明，可知sql.DB结构体自己维护着一个空闲连接池，并发使用是安全的。只需调用一次，几乎不需要关闭。

*gorm.DB的db字段就是管理数据库连接的地方。接下来我们简单阅读以下sql.DB结构体的内容。

```go
type DB struct {
	// Atomic access only. At top of struct to prevent mis-alignment
	// on 32-bit platforms. Of type time.Duration.
	waitDuration int64 // Total time waited for new connections.

	connector driver.Connector
	// numClosed is an atomic counter which represents a total number of
	// closed connections. Stmt.openStmt checks it before cleaning closed
	// connections in Stmt.css.
	numClosed uint64

	mu           sync.Mutex // protects following fields
	freeConn     []*driverConn
	connRequests map[uint64]chan connRequest
	nextRequest  uint64 // Next key to use in connRequests.
	numOpen      int    // number of opened and pending open connections
	// 用于信号通知新连接的请求
	// 一个goroutine运行connectionOpener()方法来监听这个通道
	// maybeOpenNewConnections往这个通道中发送信号（每个连接请求发送一次）
	// 在db.Close()中被关闭，并且让运行connectionOpener的goroutine退出
	openerCh          chan struct{}
	resetterCh        chan *driverConn
	closed            bool
	dep               map[finalCloser]depSet
	lastPut           map[*driverConn]string // stacktrace of last conn's put; debug only
	maxIdle           int                    // 最大空闲连接数，0表示默认，即2个
	maxOpen           int                    // 连接数上限，0表示无限
	maxLifetime       time.Duration          // maximum amount of time a connection may be reused
	cleanerCh         chan struct{}
	waitCount         int64 // Total number of connections waited for.
	maxIdleClosed     int64 // Total number of connections closed due to idle.
	maxLifetimeClosed int64 // Total number of connections closed due to max free limit.

	stop func() // stop cancels the connection opener and the session resetter.
}
```
关键的部位已用中文标示。

**openerCh**字段就是通知生成新连接的通道队列，默认最大值为`1000000`；**connRequests**字段的类型为连接请求通道的字典（`map[uint64]chan connRequest`）集合，用于保存连接的请求通道队列。

使用**DB.connectionOpenner**方法监听openerCh通道，此方法调用**DB.openNewConnection**创建新连接。然后通过**DB.connector.Connect**（此例中，connector是sql.dsnConnector，而它调用的Connect方法由标准库中`go-sql-driver/mysql`的**MySQLDriver.Open**方法实现）真正发起数据库连接，包裹在一个**driverConn**结构体实例中返回。如果失败则调用**DB.maybeOpenNewConnections**方法再次通知openerCh生成新连接；成功则通过**DB.putConnDBLocked**方法获取一个connRequests字典中的连接请求通道队列（即`chann connRequest`），将连接注入到该通道，并使用**DB.addDepLocked**添加一个依赖标记（类似于gc）——当引用为0时释放这个连接。

就这样，携带着一个sql.DB结构体的gorm.DB结构体实例返回给了gopher，这就是我们通过gorm.Open得到的“数据库连接”。

## gorm和数据库的交互
上面我们已经了解了`database/sql`标准库是如何创建新连接的。在不考虑gorm的情况下，我们直接使用该标准库，发起查询时应是如下操作：
```go
row, err := db.Query("select * from tbl_n")
// do something with row
row.Close()
```
当我们调用**DB.Query**方法时，它会调用私有方法**DB.query**，而此方法会通过**DB.conn**尝试获取缓存的连接或者新建的连接。现在，我们是第一次连接，所以没有缓存的连接，该方法直接走创建连接的流程，调用DB.connector.Connect方法——这个方法前文提到过。返回给DB.query方法一个连接，接着DB.query又调用了**DB.queryDC**方法经过一系列查询（此处不是我们关注的重点，略过），生成一个Rows结构体，返回给gopher使用。

然后我们调用**Row.Close**方法关闭查询。Close方法会调用Rows结构体中的**releaseConn**方法释放连接，这个方法实际上是由driverConn携带的：
```go
func (db *DB) query(ctx context.Context, query string, args []interface{}, strategy connReuseStrategy) (*Rows, error) {
	dc, err := db.conn(ctx, strategy)
	if err != nil {
		return nil, err
	}

	return db.queryDC(ctx, nil, dc, dc.releaseConn, query, args)
}

func (db *DB) queryDC(ctx, txctx context.Context, dc *driverConn, releaseConn func(error), query string, args []interface{}) (*Rows, error) {
    // ...
    rows := &Rows{
		dc:          dc,
		releaseConn: releaseConn,
		rowsi:       rowsi,
		closeStmt:   ds,
	}
	rows.initContextClose(ctx, txctx)
	return rows, nil
}
```
driverConn通过putConn方法再次调用DB.putConnDBLocked方法，如果没有排队等待的连接请求，将连接放入DB.freeConn中，成为被缓存的空闲连接。

---

在gorm中，当使用调用**DB.Find**等方法时，在进行一系列的组装之后，其最终都殊途同归于调用**DB.callCallbacks**方法。此方法接收一组闭包函数数组为参数，以回调的方式调用函数。这些闭包方法来自于**DB.parent.callbacks.queries**也就是Callback结构体中的增删改查数组。

有趣的是，在同一个包的另一个文件`gorm/callback_query.go`中，初始化注册了curd的默认回调函数。比如queryCallback函数：实质上在此函数中调用了**SQLCommon.Query**方法——前面我们提过，database/sql中的DB结构体是SQLCommon的实现，因此，此函数的作用就是进行调用上面所说的Query的方法。换言之，gorm把查询操作也视为回调队列的成员之一。