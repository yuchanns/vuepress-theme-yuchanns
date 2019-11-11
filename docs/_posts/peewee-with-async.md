---
title: peewee与异步操作
date: 2018-12-17 22:49:14
tags:
- peewee
- tornado
category: python
---
<!-- more -->
[[toc]]

在[《peewee用法考察》](https://www.yuchanns.xyz/posts/2018/12/12/usage-of-peewee.html)中，我初步掌握peewee的一些常用操作。而做这些准备，是为了在tornado中使用。
tornado是一个异步网络IO非阻塞框架，这意味着涉及到IO阻塞操作，我们都应该以异步的形式去进行。而peewee本身并不是异步的，因此我们还需要引入另外一些库才能更好的契合tornado。

## 我们需要什么类库
* peewee-async
* aiomysql

[peewee-async](https://github.com/05bit/peewee-async)是一个基于asyncio的封装成的库，用于进行peewee异步操作。而peewee是基于pymysql进行操作的，pymysql异步操作mysql则需要aiomysql库的支持。
注意：目前支持tornado3.0+的peewee-async属于预发行版本，需要添加-pre参数下载。
> Version 0.6.0a is published as pre-release, mind the "a" in version identifier. That means in order to install it you should specify --pre flag for pip.

```sh
pip install -pre peewee-async
pip install aiomysql
```
## 与tornado结合：同步阻塞下的情况
```python
# -*- coding: utf-8 -*-
from tornado.web import Application, RequestHandler
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from models import *
import sys


class MainHandler(RequestHandler):
    def get(self):
        uid = self.get_argument('uid', 10000)
        query = User.select(User.uname).where(User.uid == uid).get()
        self.write('uname:%s' % query.uname)


class TestHandler(RequestHandler):
    def get(self):
        self.write('test here')


def main():
    app = Application([
        (r'/', MainHandler),
        (r'/test', TestHandler),
    ])
    try:
        server = HTTPServer(app)
        server.listen(8000)
        IOLoop.current().start()
    except KeyboardInterrupt:
        print('Exit')


if __name__ == '__main__':
    sys.exit(main())

```
启动mysql交互界面，锁住user表的读写操作，模拟硬盘IO阻塞。
```sql
use peewee;
lock table user write;
```
然后先后访问localhost:8000/和localhost:8000/test，我们会发现两个访问都阻塞在请求状态，直到我们进行
```sql
unlock table;
```
解锁写锁之后才能获得数据。
## 与tornado结合：异步硬盘IO非阻塞下的情况
为了使用peewee-async，首先我们需要对models.py文件一点修改：
```python
# -*- coding: utf-8 -*-

from peewee import *
"""引入peewee_async相关类库"""
from peewee_async import MySQLDatabase as AsyncMySQLDatabase, Manager

# database = MySQLDatabase('peewee', **{'charset': 'utf8', 'use_unicode': True, 'host': 'localhost', 'port': 3306, 'user': 'root', 'password': ''})
"""将数据库连接改成peewee_async.MySQLDatabase"""
database = AsyncMySQLDatabase('peewee', **{'charset': 'utf8', 'use_unicode': True, 'host': 'localhost', 'port': 3306, 'user': 'root', 'password': ''})


class UnknownField(object):
    def __init__(self, *_, **__): pass


class BaseModel(Model):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        """将事务改成atomic_async"""
        self.trans = database.atomic_async
        """添加一个Manager类"""
        self.object = Manager(database)

    class Meta:
        database = database

# 下略……

```
[peewee-async官方文档](https://peewee-async.readthedocs.io/en/latest/)写得很简略，使用方法也不难，只是在peewee原有的基础上多加了一点嵌套操作。
比如，查询操作：（其中async/await是python3.5+异步操作的新特性，若不明白请自行查阅官方文档）
```python
class MainHandler(RequestHandler):
    """使用async关键字标识异步操作"""
    async def get(self):
        user = User()
        uname = self.get_argument('uname', 'j')
        uid = self.get_argument('uid', 10002)
        try:
            """使用await关键字等待阻塞操作"""
            """单条查询使用object.get()方法将原本的peewee操作包裹起来"""
            row = await user.object.get(
                User.select(User.uname).where(User.uid == uid)
            )
            """多条查询"""
            query = await user.object.execute(
                User.select(User.uname).where(User.uname.startswith(uname))
            )
        except User.DoesNotExist:
            """当查不到数据的时候会抛出DoesNotExist错误"""
            self.write('查无数据')
        else:
            self.write('row uname: %s and query unames:%s' % (row.uname, ', '.join([row.uname for row in query])))

```
启动进程，当我们再次锁住user表写锁，然后先后访问localhost:8000/和localhost:8000/test，就会发现，虽然第一个请求还在阻塞状态，第二个请求却已经成功看到屏幕上打印出来的"test here"文字。而当我们解锁user表之后，第一个请求也能顺利完成。
## 其余常规操作
### 插入/更新数据
```python
async def post():
    """md5加密密码"""
    m = hashlib.md5()
    m.update('123456'.encode())
    pwd = m.hexdigest()
    """头像"""
    avartar = 'https://avatars2.githubusercontent.com/u/25029451'
    user = User()
    data_source = [
        (avartar, 'Doreis', pwd),
        (avartar, 'Dorein', pwd),
        (avartar, 'Doreiv', pwd),
    ]
    field = (User.avartar, User.uname, User.password)
    try:
        """插入多条数据"""
        await user.object.execute(
            User.insert_many(data_source, field)
        )
        result = await user.object.get(User.select(User.uid, User.integral).where(User.uname == 'Doreis'))
        """使用async关键字开启事务"""
        async with user.trans():
            """更新数据"""
            await user.object.execute(User.update(
                integral=result.integral+100
            ).where(User.uid == result.uid))
            """插入单条数据"""
            await user.object.execute(Integral.insert(
                uid=result.uid,
                change=100,
                total=result.integral + 100
            ))
            self.write('insert complete')
    except Exception as e:
        print(repr(e))
        self.write('insert failed')
```

### jion查询
 ```python
async def get(self):
    user = User()
    try:
        """join查询"""
        query_join = await user.object.execute(
            Balance.select(
                User.uname, Balance.change,
                Balance.total, Balance.addtime
            ).join(
                User, JOIN.RIGHT_OUTER,
                on=(Balance.uid == User.uid)
            ).where(
                Balance.uid == 10012
            ).order_by(-Balance.addtime)
        )
        for row_join in query_join:
            print('%s:%.2f:%.2f:%s' % (
                row_join.user.uname, row_join.change,
                row_join.total, row_join.addtime
            ))
    except User.DoesNotExist:
        """当查不到数据的时候会抛出DoesNotExist错误"""
        self.write('查无数据')
    else:
        self.write('query unames:%s' % (row.uname, ', '.join([row.uname for row in query])))
 ```
 
### union查询
 关于union操作，peewee_async原本并不支持。我开了个[issue](https://github.com/05bit/peewee-async/issues/116)询问了作者，作者表示做出一些修改就可以支持。
 > Not sure if `select()` coroutine could handle that but you can try it `peewee_async.select(union_query))`
 > If it works, then we can just add handling `ModelCompoundSelectQuery` to `execute()` via `select()`

所以，首先，我们对peewee_async库的源文件`peewee_async.py`中的
`execute()`做出一点修改：
```python
async def execute(query):
    """Execute *SELECT*, *INSERT*, *UPDATE* or *DELETE* query asyncronously.

    :param query: peewee query instance created with ``Model.select()``,
                  ``Model.update()`` etc.
    :return: result depends on query type, it's the same as for sync
        ``query.execute()``
    """
    """在这里，添加ModelCompoundSelectQuery类"""
    if isinstance(query, (peewee.Select, peewee.ModelCompoundSelectQuery)):
        coroutine = select
    elif isinstance(query, peewee.Update):
        coroutine = update
    elif isinstance(query, peewee.Insert):
        coroutine = insert
    elif isinstance(query, peewee.Delete):
        coroutine = delete
    else:
        coroutine = raw_query

    return (await coroutine(query))
```
这样在使用`execute()`方法时，peewee_async就能识别union。
```python
"""union查询"""
b_query = (Balance.select(
    Balance.b.alias('id'), Balance.change,
    Balance.total, Balance.addtime
))
i_query = (Integral.select(
    Integral.i.alias('id'), Integral.change,
    Integral.total, Integral.addtime
))
query_union = await user.object.execute(
    (b_query + i_query).order_by(SQL('addtime desc')).limit(2).offset(1)
)
```
### 聚合查询
```python
"""聚合函数"""
fn_max = await user.object.scalar(User.select(fn.MAX(User.balance)))
```
### 删除操作
```python
await user.object.execute(User.delete().where(User.uid == 10012))
```
简单的操作先记录到这里，其余操作未完待续~
