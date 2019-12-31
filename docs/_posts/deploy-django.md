---
title: 用Nginx+uwsgi部署Django
date: 2018-08-24 23:03:47
tags: 
- nginx
- uwsgi
- django
category: python
---
<!-- more -->
[[toc]]

自学python，从最熟悉的网站搭建入手。记录一下用nginx部署的过程。请注意：**本文参考了网上资源以及作者自身实践整理而成**。

## 使用环境
* ubuntu 16.04
* python 2.7

## 准备工作
* 首先是安装pip：

请把权限切成*超级用户*。

```sh
sudo -i  
apt-get install python-pip 
```
* 其次安装uwsgi：

```sh
pip install uwsgi --upgrade  
```
安装完uwsgi之后可以进行测试——创建一个python文件夹并创建test.py,内容如下：

```python
# /python/test.py

def application(env, start_response):
    start_response('200 OK',[('Content-Type','text/html')])
    return "Hello World" 
```
然后在终端运行：

```sh
uwsgi --http :8001 --wsgi-file /python/test.py 
```
并从浏览器访问ip:8001（例如192.168.199.202:8001），可以看到浏览器输出"Hello World"。至此，uwsgi安装完成。
* 安装Django：
由于我使用的是python2.7，因此django的版本应低于2，否则会安装失败。

```sh
pip install "django<2" 
```
然后用Django创建一个项目，用于之后部署：

```sh
cd /python
django-admin startproject mysite 
```
使用tree命令可以观察项目的树状结构：

```sh
.
├── manage.py
└── mysite
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py
1 directory, 5 files 
```
其中*/python/mysite/mysite/wsgi.py*即是本项目的入口文件（形同上面测试uwsgi时创建的test.py），后面部署时会用到。 接着测试一下django项目是否可以正常运行：

```sh
cd /python/mysite
python manage.py runserver 0.0.0.0:8000 
```
用浏览器访问服务器ip:8000（例如192.168.199.202:8000）发现报错提示"Disallowed Host at /,这是因为*mysite/settings.py*中的ALLOWED_HOSTS中一栏的参数为空。用vim打开并填上'localhost'和服务器ip然后保存，再次runserver即可看到Django的It worked!成功提示。

```python
# mysite/settings.py

DEBUG = True
ALLOWED_HOSTS = ['localhost','192.168.199.202']
# Application definition 
```
* 安装Nginx：
我使用Ubuntu的软件包管理器进行安装，安装完毕之后Nginx的配置文件在*/etc/nginx/nginx.conf*。

```sh
apt-get install nginx 
```

## 部署步骤 
* 配置uwsgi：
在安装uwsgi的准备过程中，我们曾测试过uwsgi是否正常运行，应用到了uwsgi的启动命令。但是如果每次启动网站都这么做就太麻烦了，所以可以创建ini配置文件来保存启动命令。
在你喜欢的位置创建ini文件。我是在*/python/uwsgi.ini.d*下创建的，内容如下：

```vim
# /python/uwsgi.ini.d 

[uwsgi]
socket = 127.0.0.1:9001
master = true //主进程
vhosts = true //多站模式
no-site = true //多站模式时不设置入口模块和文件
workers = 2 //子进程数
reload-mercy = 10
vacuum = true //退出、重启时清理文件
max-requests = 1000
limit-as = 512
buffer-size = 30000
pidfile = /var/run/uwsgi9001.pid //用来启动停止进程
daemonize = /python/uwsgi.ini.d/uwsgi9001.log //用来记录启动日志 
```
* 配置Nginx：
打开nginx的配置文件*/etc/nginx/nginx.conf*，查阅http{}模块，很容易发现服务器配置文件应写在*/etc/nginx/conf.d*下，以.conf为后缀：

```nginx
http {
    ##
    # Virtual Host Configs
    ##
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
} 
```
于是我们在/etc/nginx/conf.d创建一个mysite.conf文件，写入如下内容：

```nginx
server {
        listen      80;
        server_name 192.168.199.202;
 
        location / {
            include uwsgi_params;
            uwsgi_pass 127.0.0.1:9001;
            uwsgi_param UWSGI_CHDIR /python/mysite;
            uwsgi_param UWSGI_SCRIPT mysite.wsgi;
            index index.html index.htm;
            client_max_body_size 35m;
        }
} 
```
其中，server_name是你的服务器ip（实际生产环境中是域名），uwsgi_pass是nginx接收请求后转交给uwsgi处理经过的端口，需要与第5步中的ini内设置的端口一致，UWSGI_CHDIR是项目的根目录，UWSGI_SCRIPT是项目入口文件相对于项目的路径（'.'表示一个层级）。设置完成之后，在终端重启nginx以及运行uwsgi：

```sh
service nginx reload & uwsgi --ini /python/uwsgi.ini.d/uwsgi9001.ini 
```
然后在浏览器中访问服务器ip，却发现显示"Internal Server Error"报错信息。因为nginx顺利重启，所以错误应该不在于nginx，有可能是uwsgi的问题。于是我们去查看uwsgi的启动日志（配置环境应当养成查看日志的习惯），前面uwsgi的配置中，日志放在*/python/uwsgi.ini.d/uwsgi9001.log*。

```vim
Traceback (most recent call last):
  File "./mysite/wsgi.py", line 12, in <module>
    from django.core.wsgi import get_wsgi_application
ImportError: No module named django.core.wsgi
unable to load app 0 (mountpoint='') (callable not found or import error)
--- no python application found, check your startup logs for errors --- 
```
阅读启动日志，我们发现，错误原因是*ImportError: No module named django.core.wsgi*。也就是说，uwsgi并没有正确识别python的包环境，找不到Django。解决方法是在uwsgi9001.ini中添加Django的正确路径。
终端查询Django所在路径:

```sh
$ pip show django | grep -i location
Location: /usr/local/lib/python2.7/dist-packages 
```
然后在*/python/uwsgi.ini.d/uwsgi9001.ini*的最后一行添加如下内容并保存：

```vim
pythonpath = /usr/local/lib/python2.7/dist-packages 
```
再次启动uwsgi进程：

```sh
uwsgi --ini /python/uwsgi.ini.d/uwsgi9001.ini 
```
**注意：**如果端口被占用，可以使用uwsgi配置文件中设置的pidfile来进行停止

```sh
uwsgi --stop /var/run/uwsgi9001.pid  
```
或者杀死全部uwsgi进程

```sh
killall -9 uwsgi 
```
然后再次用浏览器访问服务器ip，这次成功显示了和使用runserver相同的Django的It worked!成功提示。至此，用Nginx+uwsgi对Django进行部署的步骤全部完成。
