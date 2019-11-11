---
title: Django二级域名配置
date: 2018-08-22 21:38:54
tags: 
- django
category: python
---
<!-- more -->
[[toc]]

在部署网站的时候我发现django的urls并不支持二级域名的配置，而在实际工作环境中，我们经常会遇到需要使用二级域名的情况。比如网站的pc版面和手机版面，域名分别是 www.mysite.com 和 m.mysite.com 。虽然可以通过 mysite.com/home/ 和 mysite.com/wap/ 这样的方式进行访问，但这并不是一个很好的解决方案。
接着我在github上发现一个"django-hosts"插件可以为django提供这个功能，经过漫长的折腾之后总算配置成功。
github地址：https://github.com/jazzband/django-hosts
官方说明文档地址：https://django-hosts.readthedocs.io/en/latest/
下面总结一下配置步骤。
## 初始状态
* 环境：ubuntu 16.04
* 版本：python2.7
* webserver：nginx + uwsgi
* 通过pip安装django_hosts插件：
```
pip install django-hosts
```

关于如何部署nginx+uwsgi+django请查阅我的另一篇日志[《用Nginx部署Django+uwsgi》](https://www.yuchanns.org/2018/08/24/deploy-django/)。
以下是我部署好的可以正确访问的项目的结构树：

```
.
├── db.sqlite3
├── home
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── migrations
│   │   └── __init__.py
│   ├── models.py
│   ├── templates
│   │   └── home
│   │       └── index.html
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── manage.py
└── mysite
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py

4 directories, 15 files
```
其中关键文件的配置如下：

```python
# mysite/urls.py

from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', include('home.urls')),
]
```

```python
# home/urls.py

from django.conf.urls import url
import views

urlpatterns = [
    url(r'^$', views.index),
]
```

```python
# home/views.py

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, 'home/index.html', locals())
```

```html
<!-- home/templates/home/index.html -->

<DOCTYPE html>
<html>
<head>
<title>home</title>
</head>
<body>
<p>here is home</p>
</body>
</html>
```
nginx和uwsgi的配置则如下：
```nginx
# /etc/nginx/conf.d/www.conf

server{
        listen 80;
        server_name www.mysite.com;
        location / {
            include uwsgi_params;
            uwsgi_pass 127.0.0.1:9001;
            uwsgi_param UWSGI_CHDIR /python/mysite;
            uwsgi_param UWSGI_SCRIPT mysite.wsgi;
            client_max_body_size 35m;
        }
}
```

```nginx
# /etc/nginx/conf.d/m.conf

server{
        listen 80;
        server_name m.mysite.com;
        location / {
            include uwsgi_params;
            uwsgi_pass 127.0.0.1:9001;
            uwsgi_param UWSGI_CHDIR /python/mysite;
            uwsgi_param UWSGI_SCRIPT mysite.wsgi;
            client_max_body_size 35m;
        }
}
```

```sh
# /python/uwsgi/uwsgi9001.ini

[uwsgi]
socket = 127.0.0.1:9001
master = true
vhosts = true
no-site = true
workers = 2
reload-mercy = 10
vacuum = true
max-requests = 1000
limit-as = 512
buffer-szie = 30000
pidfile = /python/uwsgi/uwsgi9001.pid
daemonize = /python/uwsgi/uwsgi9001.log
pythonpath = /usr/local/lib/python2.7/dist-packages
```

访问 www.mysite.com 和 m.mysite.com 均可以成功看到页面。

请先确保网站可以正常访问，便于后续如果报错方便排查。

## 配置步骤
* 首先，我们注销掉mysite/urls.py中的路由，这样访问网站将会变成django默认的It worked!，方便后面观察配置效果

```python
# mysite/urls.py

from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    #url(r'^$', include('home.urls')),
]
```
* 然后，创建一个mysite/hosts.py文件，作为插件的配置文件。内容如下：

```python
# mysite/hosts.py

from django_hosts import patterns, host

host_patterns = patterns('',
    host(r'www', 'home.urls', name='www'),
)
```
* 接着，在mysite/settings.py里注册django-hosts的app以及中间件，以及添加两个参数供插件调用：

```python
# mysite/settings.py

# ...省略未变动内容
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'home',
    'django_hosts',  # 注册django_hosts的app
]

MIDDLEWARE = [
    'django_hosts.middleware.HostsRequestMiddleware',  # 在中间件列表开头加入django_hosts的中间件
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_hosts.middleware.HostsRequestMiddleware',  # 在中间件列表结尾加入django_hosts的中间件
]

ROOT_URLCONF = 'mysite.urls'
ROOT_HOSTCONF = 'mysite.hosts'  # 添加ROOT_HOSTCONF参数
DEFAULT_HOST = 'www'  # 添加默认的host
# ...省略未变动内容
```
* 重新加载uwsgi9001.ini。再次访问网页（ www.mysite.com ）。此时又可以见到显示着"here is home"的页面。实际上，在这一步操作，我得到了"Error 500--Internal Server Error"报错。查询uwsgi的日志得知是找不到pkg_resource模块。在踩了很多坑，浪费了几个小时后，我发现问题仅仅是因为setuptools版本不够新而已。执行
```
pip install setuptools --upgrade
```
即可解决问题。
* 到这里，我们已经确保了插件可以正常工作（这样拆解步骤的流程有利于在出问题时快速定位到出错的环节！）。下面我们开始配置二级域名 m.mysite.com 。
* 在项目根目录执行
```
python manage.py startapp wap
```
创建wap的app（记得到mysite/settings.py里注册wap的app！）。修改views.py以及创建wap/urls.py和wap/templates/wap/index.html文件，内容如下：

```python
# wap/urls.py

from django.conf.urls import url
import views

urlpatterns = [
    url(r'^$', views.index),
]
```

```html
<!-- wap/templates/wap/index.html -->

<DOCTYPE html>
<html>
<head>
<title>wap</title>
</head>
<body>
<p>here is wap</p>
</body>
</html>
```

```python
# wap/views.py

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, 'wap/index.html', locals())
```
* 在mysite/hosts.py文件里添加路由：

```python
# mysite/hosts.py

from django_hosts import patterns, host

host_patterns = patterns('',
    host(r'www', 'home.urls', name='www'),
    host(r'm', 'wap.urls', name='m'),  # 新增的二级域名
)
```
* 最后，再次加载uwsgi9001.ini，分别访问 www.mysite.com 和 m.mysite.com 成功地访问到了home和wap各自的页面。

## 总结
通过上面的配置，我们可以知道，django-hosts这个插件的原理就是在hosts.py里通过识别二级域名将路由导向到各自app指定的的urls.py。然后我们再对各自的urls.py进行配置就完成了。
