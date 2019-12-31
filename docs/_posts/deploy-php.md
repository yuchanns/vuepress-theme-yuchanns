---
title: 搭建LNMP环境
date: 2018-08-27 22:35:28
tags:
- linux
- lnmp
- nginx
category: php
---
<!-- more -->
[[toc]]

## 准备工作
**注：本文使用xshell连接虚拟机中的ubuntu进行环境部署**
* 安装[ubuntu 16.04](https://www.ubuntu.com/download/desktop)。
* 如果是在虚拟机中安装，则给系统安装ssh：

```sh
sudo apt-get install openssh-server
```
* 开放部分端口：

```sh
sudo iptables -I INPUT -p tcp --dport 22 -j ACCEPT  # 用于通过xshell和系统远程通信
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT  # 用于外部访问Webserver
sudo iptables-save  # 保存设置使防火墙规则生效
```
* 如果是在虚拟机中安装，查看本机IP地址：

```sh
ifconfig
```
## 安装环境
* 首先切换成管理员身份便于后续安装：

```sh
sudo -i
```
* 添加并更新源：

```sh
apt-get install python-software-properties  # 安装apt源管理工具
add-apt-repository ppa:nginx/stable  # 添加nginx稳定版安装源
add-apt-repository ppa:ondrej/php  # 添加php安装源
apt-get install update  # 更新软件源
apt-get install vim tree  # 顺便安装一下vim编辑器和tree
```
* 安装mysql：

```sh
apt-get install mysql-server
```
安装过程中会要求设置mysql root账号的密码。
* 安装php：

```sh
apt-get install php5.6 php5.6-fpm php5.6-mysql php5.6-curl php5.6-memcache  # 这里我选择了php5.6版本
```
* 设置*/etc/php/5.6/fpm/php.ini*使其支持pathinfo模式（主要是为了兼容Thinkphp框架）

```sh
# /etc/php/5.6/fpm/php.ini

# 搜索到;cgi.fix_pathinfo=1，去掉前面的分号并把值改为0
cgi.fix_pathinfo=0
```
* 安装nginx：

```sh
apt-get install nginx
```
## 配置环境
* 设置网站根目录：

```sh
mkdir /www  # 根据自身需求选择网站根目录，我习惯设置在/www里面
chmod -R 755 /www  # 所有者拥有读写执行权限，其他人拥有读执行权限
```
查阅*/etc/nginx/nginx.conf*的*http{}*模块，我们可以得知nginx的日志位于*/var/log/nginx*，包括access.log和error.log，前者是nginx的工作日志，后者是启动失败记录的日志——如果nginx出错可以到此来查阅原因。此时，我们注意到*http{}*模块尾部有这样一段代码：

```nginx
# /etc/nginx/nginx.conf

include /etc/nginx/sites-enabled/*;
```
这段代码表示引入网站子配置文件。子配置文件的好处在于每个网站的配置独立，方便管理。
进入*/etc/nginx/sites-enabled/*，创建一个default文件，作为默认网站配置：
```nginx
# /etc/nginx/sites-enabled/default

server {
    listen 80;  # 监听80端口
    listen [::]:80 default_server;
    root /www;  # 默认网站根目录
    index index.php;  # 默认寻找文件
    server_name _;
    
    location / {
        if (!-e $request_filename){  # 配置重写规则
            rewrite ^/(.*)$ /index.php?s=/$1 last;  # 为网址重写添加index.php
            # 这样网址可以省略index.php
        }    
        try_files $uri $uri/ =404;
    }
    
    location ~ \.php$ {  # 接收经过重写的请求
        try_files $uri $uri/ =404;  # 规定重定向URI变成死循环时跳转到404报错
        fastcgi_split_path_info ^(.+\.php)(.*)$;  # 正则匹配请求网址的pathinfo内容
        fastcgi_param PATH_INFO$fastcgi_path_info;  # 将取得的pathinfo赋值给PATH_INFO变量
        # 这样php就可以通过$_SERVER['PATH_INFO']获取pathinfo的信息
        fastcgi_pass unix:/var/run/php/php5.6-fpm.sock;  # fastcgi交由php5.6-fpm进行管理
        fastcgi_index index.php;  # 将index.php作为默认首页文件
        include fastcgi_params;  # 引入/etc/nginx/fastcgi_params文件的全部fastcgi_param
    }
}
```
编辑*/etc/nginx/fastcgi_params*文件，在最后一行添加新的参数：

```nginx
# /etc/nginx/fastcgi_params

# 在最后一行添加
fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
# 表示nginx传给fpm的完整路径为根目录/文件相对路径，例如：
# /www/test/index.php
```
输入：

```sh
service nginx reload
```
重启nginx。如果重启失败，说明配置文件的语法存在错误。可以查询error.log日志检查错误的地方，进行修改。
* 配置项目网站
复制一份*/etc/nginx/sites-enabled/default*到同目录下，建议命名与项目名称相同，便于管理：

```sh
cd /etc/nginx/sites-enabled
cp default mysite
```
对项目网站配置文件做一点修改：

```nginx
server {
    # ...省略不变配置
    root /www/mysite/public;  # 修改为你的项目入口文件所在路径
    server_name mysite.com;  # 修改为你的域名
    # ...省略不变配置
}
```
重启php-fpm和nginx：

```sh
service php5.6-fpm reload
service nginx reload
```
* 如果是在虚拟机中部署，需要在Windows的hosts文件中添加以下内容才能访问到服务器的项目：

```sh
# 虚拟机IP 网站域名
192.168.199.134 mysite.com
```
* 创建项目入口文件index.php

```php
# /www/mysite/public/index.php

<?php
echo phpinfo();
```
访问 mysite.com 即可看到phpinfo()输出的信息。到此，LNMP环境基础搭建完毕。
