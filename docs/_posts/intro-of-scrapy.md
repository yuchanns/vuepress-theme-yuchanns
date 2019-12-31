---
title: Scrapy入门
date: 2019-02-11 10:30:56
tags:
 - scrapy
 - 爬虫
category: python
---
-><lazy-image src="https://scrapy.org/img/scrapylogo.png" /><-

[[toc]]

想要掌握python，接触爬虫是一个不可避免的方向。
<!-- more -->

当然，爬虫并不是python的专利，很多语言都可以实现，但这并不是现在本文要研究的。同样地，不使用框架裸爬也不是本文的目标。

python的爬虫框架有很多：Scrapy、PySpider、Crawley、Portia、Newspaper、Beautiful Soup、Grab、Cola等等。

本次入门学习爬虫，决定选择Scrapy。

参考：[官方文档](https://docs.scrapy.org/en/latest/)

python版本：`3.7`
Scrapy版本：`1.6`

## 安装准备

使用pip安装即可`pip install scrapy`

顺便一提，在本地环境开发学习python的时候，常常会有切换python版本的需要。因此，我通常使用虚拟环境来管理python的版本。我使用版本管理软件是[Miniconda](https://conda.io/en/latest/miniconda.html)。安装方法不多说（你可以选择bash安装、deb安装、源码编译等多种方式）。简要说明使用方法：
```sh
# 切换到32位虚拟环境
set CONDA_FORCE_32BIT=1

# 切换到64位虚拟环境
set CONDA_FORCE_32BIT=

# 创建新的虚拟环境 > conda create -n 环境名称 python版本
conda create -n py27 python=2.7

# 激活虚拟环境 > source activate 环境名称
source activate py27

# 退出虚拟环境 > source deactivate
source deactivate
```

## 创建爬虫项目
和大部分框架一样，首先使用下列命令创建一个新的爬虫项目。本文以[我个人博客](https://www.yuchanns.xyz)为爬虫目标：
```sh
scrapy startproject yuchanns
```
然后我们得到如下项目结构，注释说明了对应的用途：
```sh
.
├── scrapy.cfg               # scrapy配置文件
└── yuchanns                 # 项目模块，放置你的爬虫代码
    ├── __init__.py
    ├── items.py             # items定义文件
    ├── middlewares.py       # 中间件
    ├── pipelines.py         # 管道文件
    ├── settings.py          # 项目配置文件
    └── spiders              # 爬虫放置目录
        └── __init__.py

```
## 最简单的爬取
蜘蛛代码就编写在`./yuchanns/spiders`中。

文件名字可以随意取，原则上取我们要爬虫的部分的名称更方便区分。比如我要爬取的是[https://www.yuchanns.xyz/posts/](https://www.yuchanns.xyz/posts/)，所以文件取名为`post_spider.py`。

接着我们书写最简单的爬取代码：
```python
# ./yuchanns/spiders/post_spider.py
# @Author yuchanns@www.yuchanns.xyz

import scrapy

class PostSpider(scrapy.Spider):
    # 类名也可以随意取
    # 原则上取我们要爬虫的部分的名称更方便区分
    name = 'post'  # 蜘蛛的名称，必须是唯一的
    # name是Scrapy识别蜘蛛的身份标识
    allowed_domains = (
        'yuchanns.xyz',
    )  # 限制爬取的域名范围，超出范围则忽略
    
    def start_requests(self):
        # 当蜘蛛启动时候会调用这个方法
        urls = (
            'https://www.yuchanns.xyz/posts/',
        )  # 指定我们要爬取的地址
        for url in urls:
            # 使用yield迭代进行爬虫，节省内存
            # callback调用回调方法处理数据
            yield scrapy.Request(url=url, callback=self.parse)
            
    def parse(self, response):
        # 回调方法，处理数据
        # 先简单的将爬去的内容全部装入名为post的文件中
        with open('post', 'wb') as post:
            post.write(response.body)

```
`scrapy.Spider`的子类有三个必须定义的属性：

* `name`：蜘蛛唯一识别身份标识

* `start_requests()`：蜘蛛启动所调用的方法

* `parse`：回调方法，处理数据用

在根目录下执行`scrapy crawl post`，即可进行爬虫。这里的post就是代码中定义的name。

然后我们可以发现根目录下生成了一个名为post的文件，打开内容就是我们爬取的页面的所有代码。
```html
<!-- post content -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Posts | yuchanns&#39;Atelier</title>
    <meta name="description" content="focus on python|php">
    <link rel="icon" href="/yuchanns.png">
    <!-- 省略 -->
```

## 简单处理爬取内容
成功爬取内容之后，我们要做的就是对数据进行处理，提取。

以post为例，我们的目标是提取出此页面的每一篇文章的标题、时间、分类、标签这四个数据。

首先我们应该在`./yuchanns/items.py`定义post页面所需要的数据的结构。定义结构的意义在于方便后面的管道处理数据。
```python
# ./yuchanns/items

import scrapy

class PostItem(scrapy.Item):
    # 名字惯例便于区分
    # 定义四个字段类
    title = scrapy.Field()
    date = scrapy.Field()
    category = scrapy.Field()
    tags = scrapy.Field()

```
然后对`post_spider.py`进行修改，对`response`对象进行`xpath`处理。

> XPath 使用路径表达式来选取 XML 文档中的节点或节点集。节点是通过沿着路径 (path) 或者步 (steps) 来选取的。

为了方便，我们可以使用Chrome打开爬取的网页，在DevTools的Elements选项卡中，选中要处理的字段，右键，复制 > 复制XPath，获得XPath：

-><lazy-image src="https://i.imgur.com/s3vcPdk.jpg" /><-
```python
# ./yuchanns/spiders/post_spider.py
# @Author yuchanns@www.yuchanns.xyz

# >>> 修改：引入PostItem
from yuchanns.items import PostItem

import scrapy

class PostSpider(scrapy.Spider):
    # 类名也可以随意取
    # 原则上取我们要爬虫的部分的名称更方便区分
    name = 'post'  # 蜘蛛的名称，必须是唯一的
    # name是Scrapy识别蜘蛛的身份标识
    allowed_domains = (
        'yuchanns.xyz',
    )  # 限制爬取的域名范围，超出范围则忽略
    
    def start_requests(self):
        # 当蜘蛛启动时候会调用这个方法
        urls = (
            'https://www.yuchanns.xyz/posts/',
        )  # 指定我们要爬取的地址
        for url in urls:
            # 使用yield迭代进行爬虫，节省内存
            # callback调用回调方法处理数据
            yield scrapy.Request(url=url, callback=self.parse)
            
    def parse(self, response):
        # 回调方法，处理数据
        # 先简单的将爬去的内容全部装入名为post的文件中
        # with open('post', 'wb') as post:
        #     post.write(response.body)
        # >>> 修改：处理获得对应的数据
        items = []
        for each in response.xpath('//*[@id="app"]/div/'
                                   'main/div/div[2]/div'):
            # 遍历每一个posts-list-item
            item = PostItem()  # 实例化PostItem对象
            title = each.xpath('a/h3/text()').extract_first()
            date = each.xpath('p[1]/span[1]/span'
                              '/span/text()').extract_first()
            category = each.xpath('p[1]/span[2]/a/span/'
                                  'span/text()').extract_first()
            tags = ''.join([tag.extract().replace('\n', '')
                           .strip() for tag in each
                           .xpath('p[1]/span[3]/span/span/a/text()')])

            item['title'] = title.replace('\n', '').strip()
            item['date'] = date.replace('\n', '').strip()
            item['category'] = category.replace('\n', '').strip()
            item['tags'] = tags
            items.append(item)
        print(items)
        return items

```
再次爬取，我们可以在控制台看到打印出我们处理收集的数据：
```sh
[{'category': 'lisp',
 'date': '2019-02-10',
 'tags': 'scheme,尾递归',
 'title': 'Scheme学习笔记（一）——尾递归'}, {'category': 'lisp',
 'date': '2019-01-15',
 'tags': 'scheme',
 'title': '初识Scheme'}, {'category': '学习',
 'date': '2019-01-13',
 'tags': 'mysql',
 'title': 'MySQL学习笔记01'}, {'category': 'TODO', 'date': '2019-01-05', 'tags': '', 'title': '2TODOList'}, {'category': 'python',
 'date': '2018-12-18',
 'tags': 'peewee,tornado',
 'title': 'peewee与异步操作'}, {'category': 'python',
 'date': '2018-12-12',
 'tags': 'peewee,orm',
 'title': 'peewee用法考察'}, {'category': 'python',
 'date': '2018-11-18',
 'tags': 'PyQt5',
 'title': 'PyQt5中使用Qprinter打印热敏小票'}, {'category': 'python',
 'date': '2018-11-10',
 'tags': 'PyQt5',
 'title': 'PyQt5中使用QWebChannel和内嵌网页进行js交互'}, {'category': 'php',
 'date': '2018-10-09',
 'tags': 'swoole,延时任务',
 'title': 'php延时任务'}, {'category': 'php',
 'date': '2018-08-28',
 'tags': 'linux,lnmp,nginx',
 'title': '搭建LNMP环境'}, {'category': 'python',
 'date': '2018-08-25',
 'tags': 'nginx,uwsgi,django',
 'title': '用Nginx+uwsgi部署Django'}, {'category': 'python',
 'date': '2018-08-23',
 'tags': 'django',
 'title': 'Django二级域名配置'}]
```

## 使用Pipeline组件处理数据
通常，在`parse`方法的最后我们会将items返回，这样items就会被交到`Item Pipeline`中。然后我们就可以在piplines中进行进一步的加工处理，例如录入数据库等。

我们在`./yuchanns/pipelines.py`中书写组件代码，同时不要忘记将组件**注册**到`./yuchanns/settings.py`的`ITEM_PIPELINES`中！
```python
# ./yuchanns/settings.py
# 注册管道组件

# Configure item pipelines
# See https://doc.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
   'yuchanns.piplines.PostPipline': 100,
}  # 包含管道组件和执行顺序的字典，顺序范围0~1000
```

管道组件必须包含下面这个方法：

* `process_item(self, item, spider)`：当item通过每个管道组件时都会调用，不作任何处理的情况下我们应该返回`item`或者返回一个`Twisted Deferred`，传递给下一个管道组件

管道组件还提供以下几个方法：

* `open_spider(self, spider)`：当蜘蛛被打开时调用
* `close_spider(self, spider)`：当蜘蛛被关闭时调用

在本例中，我们使用pymysql将数据录入到mysql中。

首先给出post表的数据结构：
```sql
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT '' COMMENT '文章标题',
  `date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `category` varchar(50) DEFAULT '' COMMENT '文章分类',
  `tags` varchar(200) DEFAULT '' COMMENT '文章分类',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Posts爬虫数据收集'
```
然后书写`./yuchanns/pipelines.py`：
```python
# ./yuchanns/pipelines.py
# @Author yuchanns@www.yuchanns.xyz

import pymysql

class PostPipeline(object):
    db = None
    cursor = None

    def process_item(self, item, spider):
        # 注意这里是每个item调用一次
        data = (item['title'], item['date'], 
                item['category'], item['tags'])
        self.cursor.execute(
            "insert into `posts`(`title`, `date`, `category`"
            ", `tags`) values (%s, %s, %s, %s)", data)
        self.db.commit()
        return item

    def open_spider(self, spider):
        # 创建数据库连接
        self.db = pymysql.connect("localhost", "root", "", "scrapy")
        # 获得游标对象
        self.cursor = self.db.cursor()

    def close_spider(self, spider):
        # 关闭数据库连接
        self.db.close()

```
查看mysql，可以知道数据确实已经存入mysql
```sql
mysql> use scrapy
Database changed
mysql> select * from posts;
+----+--------------------------------------------------------+---------------------+----------+---------------------+
| id | title                                                  | date                | category | tags                |
+----+--------------------------------------------------------+---------------------+----------+---------------------+
|  1 | Scheme学习笔记（一）——尾递归                           | 2019-02-10 00:00:00 | lisp     | scheme,尾递归       |
|  2 | 初识Scheme                                             | 2019-01-15 00:00:00 | lisp     | scheme              |
|  3 | MySQL学习笔记01                                        | 2019-01-13 00:00:00 | 学习     | mysql               |
|  4 | 2019-TODOList                                          | 2019-01-05 00:00:00 | TODO     |                     |
|  5 | peewee与异步操作                                       | 2018-12-18 00:00:00 | python   | peewee,tornado      |
|  6 | peewee用法考察                                         | 2018-12-12 00:00:00 | python   | peewee,orm          |
|  7 | PyQt5中使用Qprinter打印热敏小票                        | 2018-11-18 00:00:00 | python   | PyQt5               |
|  8 | PyQt5中使用QWebChannel和内嵌网页进行js交互             | 2018-11-10 00:00:00 | python   | PyQt5               |
|  9 | php延时任务                                            | 2018-10-09 00:00:00 | php      | swoole,延时任务     |
| 10 | 搭建LNMP环境                                           | 2018-08-28 00:00:00 | php      | linux,lnmp,nginx    |
| 11 | 用Nginx+uwsgi部署Django                                | 2018-08-25 00:00:00 | python   | nginx,uwsgi,django  |
| 12 | Django二级域名配置                                     | 2018-08-23 00:00:00 | python   | django              |
+----+--------------------------------------------------------+---------------------+----------+---------------------+
12 rows in set (0.00 sec)
```
当然，实际使用时，出于这样或那样的原因（比如逐条插入数据效率低下之类的），我们通常不会这样将数据直接存入数据库。

## 总结
现在，我们对Scrapy的使用有一个大概的认知。

首先，使用`scrapy startproject projectname`创建一个爬虫项目。

然后，在`./projectname/spiders`文件夹下编写蜘蛛代码，每个蜘蛛的`name`都是独一无二的。

接着，在编写过程中，我们使用`XPath`语法获取需要的数据，并用`./projectname/items.py`定义结构类接收数据，然后传入Item Pipelines。

最后，在`./projectname/pipelines.py`中编写管道组件，对数据进行处理，并注册到`./projectname/settings.py`的`ITEM_PIPELINES`。






