---
title: gorm使用笔记
date: 2019-12-08 23:28:00
category: golang
tags:
  - gorm
---
记录了gorm在业务场景下简单常用的功能
<!-- more -->
-><lazy-image src="/images/golang_tutorial_coverage.jpg" /><-

[[TOC]]

:::tip 相关链接
Demo源码 [yuchanns/gobyexample](https://github.com/yuchanns/gobyexample)

官方文档 [传送门](http://gorm.io/docs/)
:::

<details>
<summary>Demo表结构</summary>

```sql
CREATE TABLE `order` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_no` varchar(32) NOT NULL DEFAULT '',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'user_id',
  `total_price` int(10) unsigned NOT NULL DEFAULT '0',
  `postage` int(10) unsigned NOT NULL DEFAULT '0',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '0-pending 1-payed 2-transporting 3-received 4-confirmed 5-refunding 6-refunded 7-cancel',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `created_at` int(10) unsigned NOT NULL DEFAULT '0',
  `updated_at` int(10) unsigned NOT NULL DEFAULT '0',
  `deleted_at` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_no` (`order_no`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='Main order';

CREATE TABLE `order_item` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'related to order primary key',
  `s_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'shop id',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'user id',
  `g_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'related to goods primary key',
  `name` varchar(50) NOT NULL DEFAULT '',
  `num` int(10) unsigned NOT NULL DEFAULT '0',
  `price` int(10) unsigned NOT NULL DEFAULT '0',
  `is_deleted` int(10) unsigned NOT NULL DEFAULT '0',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '0-pending 1-payed 2-transporting 3-received 4-confirmed 5-refunding 6-refunded 7-cancel',
  `created_at` int(10) unsigned NOT NULL DEFAULT '0',
  `updated_at` int(10) unsigned NOT NULL DEFAULT '0',
  `deleted_at` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `g_id` (`g_id`),
  KEY `s_id` (`s_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='Order items';
```
</details>

## 连接数据库
### 连接mysql
```go
import (
    _ "github.com/go-sql-driver/mysql" // 记得引入mysql驱动
    "github.com/jinzhu/gorm"
)

// ...

DB, err := gorm.Open("mysql", "user:pwd@(localhost:3306)/gobyexample?charset=utf8&parseTime=True&loc=Local")
if err != nil {
    panic(err.Error())
}
defer DB.Close()
DB.LogMode(true) // 开启日志模式
```
## 结构体定义
### 忽视字段和**模型关联**
在结构体对应的字段的tag上写入`gorm:"-"`可以使gorm在写入数据库时忽视该字段
```go
const (
    OrderPending      uint8 = 0
    OrderPayed        uint8 = 1
    OrderTransporting uint8 = 2
    OrderReceived     uint8 = 3
    OrderConfirmed    uint8 = 4
    OrderRefunding    uint8 = 5
    OrderRefunded     uint8 = 6
    OrderCancel       uint8 = 7
) // 定义订单状态常量

var statusScope = []uint8{
    OrderPending,
    OrderPayed,
    OrderTransporting,
    OrderReceived,
    OrderConfirmed,
    OrderRefunding,
    OrderRefunded,
    OrderCancel,
}

type Order struct {
    ID          uint         `json:"id" gorm:"primary_key"`
    OrderNo     string       `json:"order_no" gorm:"type:varchar(32)"`
    UserId      uint         `json:"user_id"`
    TotalPrice  uint         `json:"total_price"`
    Postage     uint         `json:"postage"`
    Status      uint8        `json:"status" gorm:"type:tinyint(1)"`
    IsDeleted   uint         `json:"is_deleted" gorm:"type:tinyint(1)"`
    CreatedAt   int64        `json:"-"`
    UpdatedAt   int64        `json:"-"`
    DeletedAt   int64        `json:"-"`
    OrderItems  []*OrderItem `gorm:"foreignkey:OrderId"`    // Has Many
    CreatedTime string       `json:"created_time" gorm:"-"` // ignore this field
    UpdatedTime string       `json:"updated_time" gorm:"-"` // ignore this field
}

type OrderItem struct {
    ID          uint   `json:"id" gorm:"primary_key"`
    Order       *Order `gorm:"foreignkey:OrderId"` // Belongs To
    OrderId     uint   `json:"order_id"`
    SID         uint   `json:"s_id"`
    UserId      uint   `json:"user_id"`
    GID         uint   `json:"g_id"`
    Name        string `json:"name" gorm:"type:varchar(50)"`
    Num         uint   `json:"num"`
    Price       uint   `json:"price"`
    Status      uint8  `json:"status" gorm:"type:tinyint(1)"`
    IsDeleted   uint   `json:"is_deleted" gorm:"type:tinyint(1)"`
    CreatedAt   int64  `json:"-"`
    UpdatedAt   int64  `json:"-"`
    DeletedAt   int64  `json:"-"`
    CreatedTime string `json:"created_time" gorm:"-"` //ignore this field
    UpdatedTime string `json:"updated_time" gorm:"-"` //ignore this field
}
```
### 数据**自动完成**和**获取**
:::tip 查询钩子
查询钩子的声明周期如下
```go
// load data from database
// Preloading (eager loading)
AfterFind
```
:::
在查询之后自动将时间戳转换成`Y-m-d H:i:s`的格式
```go
// 查询钩子
func (o *Order) AfterFind() {
    o.CreatedTime = time.Unix(o.CreatedAt, 0).Format("2006-01-02 15:04:05")
    o.UpdatedTime = time.Unix(o.UpdatedAt, 0).Format("2006-01-02 15:04:05")
    // 通过指针传递使主订单和子订单相互引用
    for _, orderItem := range o.OrderItems {
		orderItem.Order = o
	}
}
```
:::tip 新增钩子
新增钩子的生命周期如下
```go
// begin transaction
BeforeSave
BeforeCreate
// save before associations
// update timestamp `CreatedAt`, `UpdatedAt`
// save self
// reload fields that have default value and its value is blank
// save after associations
AfterCreate
AfterSave
// commit or rollback transaction
```
:::
在新增之前，自动写入新增时间和更新时间的时间戳，对订单状态值进行边界检查
```go
// 新增钩子
func (o *Order) BeforeCreate(scope *gorm.Scope) (err error) {
    scope.SetColumn("CreatedAt", time.Now().Unix())
    scope.SetColumn("UpdatedAt", time.Now().Unix())
    if _, ok := scope.FieldByName("Status"); ok {
        for _, status := range statusScope {
            if status == o.Status {
                return
            }
        }
        return errors.New("status out of scope")
    }
    return
}
```
:::tip 更新钩子
更新钩子的生命周期如下
```go
// begin transaction
BeforeSave
BeforeUpdate
// save before associations
// update timestamp `UpdatedAt`
// save self
// save after associations
AfterUpdate
AfterSave
// commit or rollback transaction
```
:::
在更新之前自动写入更新时间戳，对订单状态值进行边界检查
```go
// 更新钩子
func (o *Order) BeforeUpdate(scope gorm.Scope) (err error) {
    scope.SetColumn("UpdatedAt", time.Now().Unix())
    scope.Set("gorm:save_associations", false) // 更新的时候不进行关联更新
    if _, ok := scope.FieldByName("Status"); ok {
        for _, status := range statusScope {
            if status == o.Status {
                return
            }
        }
        return errors.New("status out of scope")
    }
    return
}
```
### 指定表名
gorm默认使用复数表名
```go
func (o *Order) TableName() string {
	  return "order"
}

func (oi *OrderItem) TableName() string {
	  return "order_item"
}
```
## 插入数据
* 由于定义了模型关联，所以在插入主订单后自动插入子订单，并且自动从主订单获取自增主键填充到子订单相关字段

* 整个过程在事务中进行，是**原子性**的

* 本文使用`github.com/bwmarrin/snowflake`雪花算法生成唯一订单号
```go
var Node *snowflake.Node

func init() {
    var err error
    Node, err = snowflake.NewNode(1)
    if err != nil {
        panic(err.Error())
    }
}

func InsertGoods(DB *gorm.DB) uint {
    var userId, sId uint = 1088, 2
    // 子订单数组，记录相关商品订单信息
    // 此处使用指针以获取插入后的主键
    orderItems := []*model.OrderItem{
        {
            SID:    sId,
            UserId: userId,
            GID:    20,
            Name:   "FoodA",
            Num:    2,
            Price:  2000,
            Status: model.OrderPending,
        },
        {
            SID:    sId,
            UserId: userId,
            GID:    21,
            Name:   "FoodB",
            Num:    1,
            Price:  5000,
            Status: model.OrderPending,
        },
    }

    var totalPrice uint = 0
    for _, orderItem := range orderItems {
        totalPrice += orderItem.Price * orderItem.Num
    }

      // 主订单，记录订单主要信息
    order := model.Order{
        OrderNo:    Node.Generate().String(),
        UserId:     1088,
        TotalPrice: totalPrice,
        Postage:    1000,
        Status:     model.OrderPending,
        OrderItems: orderItems,
    }

    DB.Create(&order) // 传递指针以获取主键

    fmt.Println("order items primary key is ", orderItems[0].ID, " and ", orderItems[1].ID)
    return order.ID
}
// (/Users/yuchanns/Coding/golang/gobyexample/service/insert.go:57) 
// [2019-12-09 00:35:40]  [0.51ms]  INSERT  INTO `order_item` (`order_id`,`s_id`,`user_id`,`g_id`,`name`,`num`,`price`,`status`,`is_deleted`,`created_at`,`updated_at`,`deleted_at`) VALUES (1,2,1088,20,'FoodA',2,2000,0,0,1575822940,1575822940,0)  
// [1 rows affected or returned ] 

// (/Users/yuchanns/Coding/golang/gobyexample/service/insert.go:57) 
// [2019-12-09 00:35:40]  [0.46ms]  INSERT  INTO `order_item` (`order_id`,`s_id`,`user_id`,`g_id`,`name`,`num`,`price`,`status`,`is_deleted`,`created_at`,`updated_at`,`deleted_at`) VALUES (1,2,1088,21,'FoodB',1,5000,0,0,1575822940,1575822940,0)  
// [1 rows affected or returned ] 
// order items primary key is  1  and  2
// order primary key is  1
```
## 查询数据
* 使用**Preload**预加载自动加载关联模型
* gorm查询默认添加非软删除条件，需要使用**Unscoped**方法取消这一条件；在使用预加载时，通过闭包使用这一方法
```go
func QueryPreload(DB *gorm.DB) *model.Order {
    var order model.Order
    DB.Where("id = ?", 1).Preload("OrderItems", func(db *gorm.DB) *gorm.DB {
        return db.Unscoped()
    }).Unscoped().Find(&order)
    // 由于上面的AfterFind方法中将order指针放到orderItems数组中，所以也可以从orderItems中得到order
    return &order
}

// (/Users/yuchanns/Coding/golang/gobyexample/service/query.go:12) 
// [2019-12-08 23:02:46]  [0.89ms]  SELECT * FROM `order`  WHERE (id = 1)  
// [1 rows affected or returned ] 

// (/Users/yuchanns/Coding/golang/gobyexample/service/query.go:12) 
// [2019-12-08 23:02:46]  [0.58ms]  SELECT * FROM `order_item`  WHERE (`order_id` IN (1))  
// [2 rows affected or returned ] 
// query result is &{ID:1 OrderNo:1203664661971472384 UserId:1088 TotalPrice:9000 Postage:1000 Status:0 IsDeleted:0 CreatedAt:1575810993 UpdatedAt:1575810993 DeletedAt:0 OrderItems:[0xc0001de000 0xc0001de0a0] CreatedTime:2019-12-08 21:16:33 UpdatedTime:2019-12-08 21:16:33}
// the order items are &{ID:1 Order:0xc0000ce120 OrderId:1 SID:2 UserId:1088 GID:20 Name:FoodA Num:2 Price:2000 Status:0 IsDeleted:0 CreatedAt:1575810993 UpdatedAt:1575810993 DeletedAt:0 CreatedTime:2019-12-08 21:16:33 UpdatedTime:2019-12-08 21:16:33} and &{ID:2 Order:0xc0000ce120 OrderId:1 SID:2 UserId:1088 GID:21 Name:FoodB Num:1 Price:5000 Status:0 IsDeleted:0 CreatedAt:1575810993 UpdatedAt:1575810993 DeletedAt:0 CreatedTime:2019-12-08 21:16:33 UpdatedTime:2019-12-08 21:16:33}
```
## 更新数据
* 使用**Update**方法时，如果存在`UpdatedAt`字段，gorm会强制覆盖值为**time.Time**类型，优先级比钩子更高。
* 使用**Save**方法可以避免`UpdatedAt`被强制覆盖，通过**Select**方法设置允许更新的字段；否则会更新所有字段
```go
func UpdateAutoComplete(order *model.Order, DB *gorm.DB) (err error) {
	//DB.Set("gorm:save_associations", false).Model(&order).Unscoped().Update("Status", model.OrderPayed) // 不支持字段为int类型的UpdatedAt自动更新
	//DB.Model(&order).Updates(model.Order{Status: model.OrderTransporting, IsDeleted: 0}) // 不支持字段为int类型的UpdatedAt自动更新
	//DB.Model(&order).Unscoped().UpdateColumns(model.Order{Status: model.OrderTransporting, IsDeleted: 0})
	// 推荐写法：支持字段为int类型的UpdatedAt自动更新
    order.Status = model.OrderPayed
    // 允许Status和UpdatedAt字段更新
	err = DB.Unscoped().Select("Status", "UpdatedAt").Save(&order).Error
	return
}
```
## 事务
* 使用**Begin**开启事务获取带事务状态的`*gorm.DB`
* 使用**Commit**和**Rollback**进行提交回滚
* 可以使用闭包实现自动开闭事务
```go
func Transaction(order *model.Order, DB *gorm.DB) {
	tx := DB.Begin()
	InsertGoods(tx) // 注意传递的是tx而不是DB
	tx.Unscoped().Delete(order)
	tx.Rollback() // 回滚使上面的插入与删除无效
}
```
## 高级查询
### Join
```go
type OrderJoin struct {
	ID      uint64
	Name    string
	OrderNo string
}

func Join(DB *gorm.DB) []*OrderJoin {
	var orderJoins []*OrderJoin
	DB.Table("order_item").Joins("left join `order` on order.id = order_item.order_id").
		Select("order_item.id, name, order_no").Find(&orderJoins)
	return orderJoins
}
```
### Group
有关Rows结构体查看[标准库文档](https://golang.org/pkg/database/sql/#Rows)
```go
func Group(DB *gorm.DB) []map[string]interface{} {
	rows, _ := DB.Table("order_item").Select("order_id").Group("order_id").Rows()
	defer rows.Close() // rows是go标准库sql的结构体Rows的实例，存储着查询结果集
	m := make(map[string]interface{})
	var orderId string
	var list []map[string]interface{}
	for rows.Next() {
        rows.Scan(&orderId) // 必须一一对应查询出来的字段，否则会失败
        // 上面若查询Select("id, order_id")则使用row.Scan(&id, &orderId)接收
		m["order_id"] = orderId
		list = append(list, m)
		fmt.Printf("row is %+v\n", m)
	}
	return list
}
```
### Count
```go
func Count(DB *gorm.DB) (count int) {
	DB.Model(model.OrderItem{}).Unscoped().Where("order_id = ?", 1).Count(&count)
	return
}
```
### 子查询
使用**SubQuery**生成子查询语句
```go
func SubQuery(DB *gorm.DB) (orderItemSub model.OrderItem) {
	DB.Where("order_id = ?", DB.Table("order").Select("id").
		Where("id = ?", 1).SubQuery()).
		Unscoped().Find(&orderItemSub)
	return
}
```