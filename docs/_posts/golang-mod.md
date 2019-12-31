---
title: Go创建项目
draft: true
date: 2019-09-30 01:08:00
category: golang
---
要点速记——
<!-- more -->

* **GOPATH**
  * src：项目源码
  * bin：编译后的文件
  * pkg：远程包

:::tip
使用`GOPATH`是前期golang的限制，导致项目需要放在src下面。后来出现了go mod情况就不同了。
:::

* **Go mod**
  * `mod`是`vendor`升级版
  * 在任意位置（非GOPATH）下创建项目文件夹
  * 进入后创建main.go文件
  * 执行`go mod init 项目名称`即可在当前目录生成go.mod文件，标记当前项目包
  * 执行go get等方法不再关心下载到GOPATH的情况，可以直接在项目中引用
  * 查看go.mod可以看到引用包的情况，包含版本限制
  ```
  module goweb

  go 1.12

  require(
      github.com/astaxie/beego v1.12.0
      github.com/shiena/ansicolor v0.0.0-20151119151921-a422bbe96644 // indirect
  )
  ```

* **Goproxy**
  * 用于进行仓库代理，加快国内下载速度
  * 在GOPATH中被禁用，在GOPATH之外非go.mod中需要配合`GO111MODULE=on`开启，在go.mod文件夹中默认开启
  * 国内一般可使用`export GOPROXY=https://goproxy.io`

* **使用GDB调试**