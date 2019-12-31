---
title: 一个goweb项目的结构
date: 2019-12-15 23:31:00
category: golang
---
要使用一种语言实现一个项目，对项目结构的规划是首中之重。
<!-- more -->

-><lazy-image src="/images/gin-gonic.jpg" /><-

我们作为后来者，加入一个已经成型的项目，那么不管对项目的结构有什么天大的意见，自然还是要按照此前的规范来——而本文探讨的是当创建一个全新的项目时，应该如何合理规划项目的结构。

## 整体结构
经过对github上的一些开源项目的调研，我整理出了一份整体结构图，尽量合理地分配各个模块的功能。

-><lazy-image src="/images/webstructure.png" /><-

如图，一个app被分为6部分：
:::tip app structure
* cmd
* config
* http
* dao
* service
* model
:::
## cmd
存放**main.go**和编译后的二进制文件所在。
## config
存放一些配置文件(yaml、toml)，比如mysql、redis、rabbitmq、docker等。
## http
存放web引擎启动的代码文件（例如gin-gonic的engine）、路由信息文件和handler文件。

启动webengine时，需要启动的一些服务，包括向engine注入路由、获取数据库连接注入到service等，而handler文件则是在路由进来之后负责调用service里的业务代码处理逻辑和返回结果。
## dao
可能有的人会觉得dao和model作用似乎重叠了。实际不然——

dao全称**Data Access Object**，意思即对外提供数据接口，包括提供数据库连接、缓存连接、队列连接等等。它的作用仅仅只有提供连接和一些连接的使用方法，并负责维护连接池。

在启动web引擎时，dao的结构体负责获取连接，然后供http文件将其注入到service中。
## service
service即提供处理业务逻辑和中间件的服务。将其抽象出来之后可达到公共逻辑复用的效果。

所有service中的结构体都应实现某种规范约定的interface。这样的interface中包含了固定的字段用于保存web引擎启动时注入的dao提供的连接，使得所有业务逻辑都可以按照同样的方式调用连接进行数据操作。
## model
model层即一些结构体，仅作为承接service中通过dao暴露的连接操作查询返回的数据的载体，不进行任何其他业务逻辑操作。

## 其他的...
当然，除了这几个核心模块之外，项目中应该还包含了测试单元的编写，这里没有列出。

在web引擎启动过程中往service中注入dao、注入路由等，这一过程也可以通过依赖翻转注入(Dependency Injection)来进行，以达到解耦的目的。