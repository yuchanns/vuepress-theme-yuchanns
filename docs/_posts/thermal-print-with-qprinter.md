---
title: PyQt5中使用Qprinter打印热敏小票
date: 2018-11-17 22:37:20
tags:
- PyQt5
category: python
---
<!-- more -->
在[《PyQt5中使用QWebChannel和内嵌网页进行js交互》](https://www.yuchanns.xyz/posts/2018/11/10/interaction-on-qwebchannel.html)一文中，我记录了如何使用QWebchannel与内嵌网页进行js交互，其根本目标在于使用Qt5调起打印机服务。在这篇文章中我将介绍一下具体使用Qprinter打印超市热敏小票的过程。
**参考内容：**
[Qt5官方文档](//doc.qt.io/qt-5/index.html)
[《pyqt5的 QPrinter 使用模板》 by 一心狮](https://www.jianshu.com/p/bb8e9b3ad9f7)


本文包含以下内容：
1.使用html进行热敏打印的方法
2.分析存在的问题
3.提出另一种打印方法来解决问题
## 使用html进行热敏打印 ##
### python端代码 ###
```python
# -*- coding:utf-8 -*-
# webprint.py


from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QObject, pyqtSlot, QUrl, QSizeF
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtPrintSupport import QPrinter, QPrinterInfo
from PyQt5.QtGui import QTextDocument
import sys


class Printer:
    def __init__(self):
        self.p = QPrinterInfo.defaultPrinter()  # 获取默认打印机
        self.print_device = QPrinter(self.p)  # 指定打印所使用的装置

    def print(self, content):
        # 设置打印内容的宽度，否则打印内容会变形
        self.print_device.setPageSizeMM(QSizeF(110, 250))
        d = QTextDocument()  # 使用QTextDcument对html进行解析
        d.setDocumentMargin(0)  # 将打印的边距设为0
        # 设置全局生效的默认样式
        d.setDefaultStyleSheet('''
        * {padding:0;margin: 0;}
        h1 {font-size: 20px;}
        h3 {font-size: 16px;}
        .left {float: left;}
        .right {float:right;}
        .clearfix {clear: both;}
        ul {list-style: none;}
        .print_container {width: 250px;}
        .section2 label {display: block;}
        .section3 label {display: block;}
        .section4 .total label {display: block;}
        .section4 {border-bottom: 1px solid #DADADA;}
        .section5 label {display: block;}
        ''')
        d.setHtml(content)  # 注入html内容
        d.print(self.print_device)  # 调用打印机进行打印


class Print(QObject):
    def __init__(self):
        super().__init__()
        self.printer = Printer()

    @pyqtSlot(str, result=str)
    def print(self, content):
        self.printer.print(content)
        return


if __name__ == '__main__':
    app = QApplication(sys.argv)
    browser = QWebEngineView()
    browser.setWindowTitle('使用PyQt5打印热敏小票')
    browser.resize(900, 600)
    channel = QWebChannel()
    printer = Print()
    channel.registerObject('printer', printer)
    browser.page().setWebChannel(channel)
    url_string = "file:///python/print/webprint.html"  # 内置的网页地址
    browser.load(QUrl(url_string))
    browser.show()
    sys.exit(app.exec_())

```

### 网页端代码 ###
```html
<!-- webprint.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>使用PyQt5打印热敏小票</title>
</head>
<style type="text/css">
    * {padding:0;margin: 0;}
    h1 {font-size: 20px;}
    h3 {font-size: 16px;}
    .left {float: left;}
    .right {float:right;}
    .clearfix {clear: both;}
    ul {list-style: none;}
    .print_container {width: 250px;}
    .section2 label {display: block;}
    .section3 label {display: block;}
    .section4 .total label {display: block;}
    .section4 {border-bottom: 1px solid #DADADA;}
    .section5 label {display: block;}
</style>
<body>
<div id="capture">
    <div class="print_container">
        <h3>便利店</h3>
        <span>***************************************</span>
        <div class="section3">
            <label>订单号：700001001201811161631123558</label>
            <label>下单时间：2018-10-16 16:31:14</label>
            <label>收银员：王小明</label>
        </div>
        <span>***************************************</span>
        <div class="section4">
            <div style="border-bottom: 1px solid #DADADA;">
                <table style="width: 100%;">
                    <thead>
                    <tr>
                        <td width="60%">品名</td>
                        <td width="20%">数量</td>
                        <td width="20%">金额</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>今麦郎</td>
                        <td>1</td>
                        <td>100.00</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="total">
                <label class="left">合 计</label>
                <label class="right">100.00</label>
                <div class="clearfix"></div>
                <label class="left">收款金额</label>
                <label class="right">100</label>
                <div class="clearfix"></div>
                <label class="left">找零金额</label>
                <label class="right">0.00</label>
                <div class="clearfix"></div>
            </div>
            <div style="text-align: right;">
                <label>顾客已付款</label>
            </div>
            <span>***************************************</span>
        </div>
        <div class="section5">
            <label>电话：</label>
        </div>
        <span>***************************************</span>
        <div class="section5">
            <label>欢迎光临，谢谢惠顾！</label>
            <label>便利店</label>
        </div>
    </div>
</div>
<div>
    <button onclick="do_print()">进行html打印</button>
</div>
<script src="qwebchannel.js" type="text/javascript"></script>
<script>
    window.onload = function() {
        new QWebChannel(qt.webChannelTransport, function (channel) {
            window.printer = channel.objects.printer;
        });
    }

    function do_print() {
        if (printer !== null) {
            var html = document.querySelector('#capture').innerHTML;
            printer.print(html);
        }
    }
</script>
</body>
</html>
```

关于使用qwebchannel进行js交互的内容这里不再赘述，请查阅本文开头提到的文章。

## 问题分析 ##
运行上述代码，我们可以成功地调起打印机服务。但是打印出来的内容却惨不忍睹，热敏小票的左边和顶部空出一大片空白，以至于打印出来的票据内容丢失了大半！
为什么会这样呢？在代码中我们已经对QTextDocument进行了setDocumentMargin设置，打印时却依然有巨大的边距。
一开始我以为是margin设置无效，后来查看了pyqt5的源码以及在Google上搜索，才得知QTextDocument强制左边和顶部留白。事实上默认的margin已经是0了。这样一来使用QTextDocument进行打印的计划宣告破产，我不得不苦苦思索，在互联网上胡搜一通，看看是否有人遇到相同的问题。
值得一提的是，热心的（:p）简书网友[一心狮](https://www.jianshu.com/u/37523151aa34)，他向我提供了一种思路：

> 先在项目内，放置一个已经排版好的excel文件。然后用win32com，对这个 execl文件，进行操作，如赋值，如打印

这确实是一个不错的方法，遗憾的是对我来说不太适用。超市热敏小票的内容不是固定长度的，而且我打算用pyinstaller将所有代码封装成一个独立的可执行程序（exe），放置一个excel文件也不太方便。
后来在Stackoverflow我偶然的看见了一个同样的问题，具体链接我忘了保存。下面只有一个回答，答者粗略地提到一个解决方法——Qt5打印图片不会留边距，可以从这个角度着手，把要打印的内容转为图片再打印。这条曲线救国的思路真是太棒了！

## 使用图片进行热敏打印 ##
想要使用图片打印，首先就要把文字内容转成图片才行。幸好这世上已经有人提供了简单方便的html转图片方案，而且是在网页端进行的！这个方案就是使用起来方便简单的[html2canvas](//html2canvas.hertzen.com/)：
> The script allows you to take "screenshots" of webpages or parts of it, directly on the users browser. The screenshot is based on the DOM and as such may not be 100% accurate to the real representation as it does not make an actual screenshot, but builds the screenshot based on the information available on the page.

简而言之就是支持对html页面的部分进行“截屏”操作。
使用方法极其简单：
```javascript
html2canvas(document.querySelector("#capture")).then(canvas => {
    document.body.appendChild(canvas)
});
```

转好了图片，我们只需在python端对图片数据流使用QPainter连接打印机进行打印即可。
### python端代码 ###
```python
# -*- coding:utf-8 -*-

from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QObject, pyqtSlot, QUrl
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtPrintSupport import QPrinter, QPrinterInfo
from PyQt5.QtGui import QPainter, QImage
import sys, base64


class Printer:
    def __init__(self):
        self.p = QPrinterInfo.defaultPrinter()
        self.print_device = QPrinter(self.p)

    def print_(self, data_url):
        image_content = base64.b64decode(data_url)  # 数据流base64解码
        image = QImage()
        image.loadFromData(image_content)  # 使用QImage构造图片
        painter = QPainter(self.print_device)  # 使用打印机作为绘制设备
        painter.drawImage(0, 0, image)  # 进行绘制（即调起打印服务）
        painter.end()  # 打印结束


class Print(QObject):
    def __init__(self):
        super().__init__()
        self.printer = Printer()

    @pyqtSlot(str, result=str)
    def print_(self, data_url):
        # 去除头部标识
        self.printer.print_(data_url.replace('data:image/png;base64,', ''))
        return


if __name__ == '__main__':
    app = QApplication(sys.argv)
    browser = QWebEngineView()
    browser.setWindowTitle('使用PyQt5打印热敏小票')
    browser.resize(900, 600)
    channel = QWebChannel()
    printer = Print()
    channel.registerObject('printer', printer)
    browser.page().setWebChannel(channel)
    url_string = "file:///python/print/webprint.html"  # 内置的网页地址
    browser.load(QUrl(url_string))
    browser.show()
    sys.exit(app.exec_())

```

### 网页端代码 ###
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>使用PyQt5打印热敏小票</title>
</head>
<style type="text/css">
    * {padding:0;margin: 0;}
    h1 {font-size: 20px;}
    h3 {font-size: 16px;}
    .left {float: left;}
    .right {float:right;}
    .clearfix {clear: both;}
    ul {list-style: none;}
    .print_container {width: 250px;}
    .section2 label {display: block;}
    .section3 label {display: block;}
    .section4 .total label {display: block;}
    .section4 {border-bottom: 1px solid #DADADA;}
    .section5 label {display: block;}
</style>
<body>
<div id="capture">
    <div class="print_container">
        <h3>便利店</h3>
        <span>***************************************</span>
        <div class="section3">
            <label>订单号：700001001201811161631123558</label>
            <label>下单时间：2018-10-16 16:31:14</label>
            <label>收银员：王小明</label>
        </div>
        <span>***************************************</span>
        <div class="section4">
            <div style="border-bottom: 1px solid #DADADA;">
                <table style="width: 100%;">
                    <thead>
                    <tr>
                        <td width="60%">品名</td>
                        <td width="20%">数量</td>
                        <td width="20%">金额</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>今麦郎</td>
                        <td>1</td>
                        <td>100.00</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="total">
                <label class="left">合 计</label>
                <label class="right">100.00</label>
                <div class="clearfix"></div>
                <label class="left">收款金额</label>
                <label class="right">100</label>
                <div class="clearfix"></div>
                <label class="left">找零金额</label>
                <label class="right">0.00</label>
                <div class="clearfix"></div>
            </div>
            <div style="text-align: right;">
                <label>顾客已付款</label>
            </div>
            <span>***************************************</span>
        </div>
        <div class="section5">
            <label>电话：</label>
        </div>
        <span>***************************************</span>
        <div class="section5">
            <label>欢迎光临，谢谢惠顾！</label>
            <label>便利店</label>
        </div>
    </div>
</div>
<div>
    <button onclick="do_print_()">进行图像打印</button>
</div>
<script src="qwebchannel.js" type="text/javascript"></script>
<script src="html2canvas.min.js" type="text/javascript"></script>
<script>
    window.onload = function() {
        new QWebChannel(qt.webChannelTransport, function (channel) {
            window.printer = channel.objects.printer;
        });
    }

    function do_print_() {
        if (printer !== null) {
            html2canvas(document.querySelector("#capture")).then(canvas => {
                var data_url = canvas.toDataURL();
                printer.print_(data_url);
            });
        }
    }
</script>
</body>
</html>
```

运行代码，我们欣喜地发现，热敏小票的排版终于正常了！
事实上，无论是图片打印，或者excel打印，都是同样的曲线救国思路。在得知第一种方法的情况下，我却没能想到第二种方法，看来我的联想能力还有待锻炼。

以上，就是我的解决历程。
## 附：完整代码（包含两种打印方式） ##
### python端代码 ###
```python
# -*- coding:utf-8 -*-

from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QObject, pyqtSlot, QUrl, QSizeF
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtPrintSupport import QPrinter, QPrinterInfo
from PyQt5.QtGui import QTextDocument, QPainter, QImage
import sys, base64


class Printer:
    def __init__(self):
        self.p = QPrinterInfo.defaultPrinter()
        self.print_device = QPrinter(self.p)

    def print(self, content):
        self.print_device.setPageSizeMM(QSizeF(110, 250))
        d = QTextDocument()
        d.setDocumentMargin(0)
        d.setDefaultStyleSheet('''
        * {padding:0;margin: 0;}
        h1 {font-size: 20px;}
        h3 {font-size: 16px;}
        .left {float: left;}
        .right {float:right;}
        .clearfix {clear: both;}
        ul {list-style: none;}
        .print_container {width: 250px;}
        .section2 label {display: block;}
        .section3 label {display: block;}
        .section4 .total label {display: block;}
        .section4 {border-bottom: 1px solid #DADADA;}
        .section5 label {display: block;}
        ''')
        d.setHtml(content)
        d.print(self.print_device)

    def print_(self, data_url):
        image_content = base64.b64decode(data_url)  # 数据流base64解码
        image = QImage()
        image.loadFromData(image_content)  # 使用QImage构造图片
        painter = QPainter(self.print_device)  # 使用打印机作为绘制设备
        painter.drawImage(0, 0, image)  # 进行绘制（即调起打印服务）
        painter.end()  # 打印结束


class Print(QObject):
    def __init__(self):
        super().__init__()
        self.printer = Printer()

    @pyqtSlot(str, result=str)
    def print(self, content):
        self.printer.print(content)
        return

    @pyqtSlot(str, result=str)
    def print_(self, data_url):
        # 去除头部标识
        self.printer.print_(data_url.replace('data:image/png;base64,', ''))
        return


if __name__ == '__main__':
    app = QApplication(sys.argv)
    browser = QWebEngineView()
    browser.setWindowTitle('使用PyQt5打印热敏小票')
    browser.resize(900, 600)
    channel = QWebChannel()
    printer = Print()
    channel.registerObject('printer', printer)
    browser.page().setWebChannel(channel)
    url_string = "file:///python/print/webprint.html"  # 内置的网页地址
    browser.load(QUrl(url_string))
    browser.show()
    sys.exit(app.exec_())

```

### 网页端代码 ###
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>使用PyQt5打印热敏小票</title>
</head>
<style type="text/css">
    * {padding:0;margin: 0;}
    h1 {font-size: 20px;}
    h3 {font-size: 16px;}
    .left {float: left;}
    .right {float:right;}
    .clearfix {clear: both;}
    ul {list-style: none;}
    .print_container {width: 250px;}
    .section2 label {display: block;}
    .section3 label {display: block;}
    .section4 .total label {display: block;}
    .section4 {border-bottom: 1px solid #DADADA;}
    .section5 label {display: block;}
</style>
<body>
<div id="capture">
    <div class="print_container">
        <h3>便利店</h3>
        <span>***************************************</span>
        <div class="section3">
            <label>订单号：700001001201811161631123558</label>
            <label>下单时间：2018-10-16 16:31:14</label>
            <label>收银员：王小明</label>
        </div>
        <span>***************************************</span>
        <div class="section4">
            <div style="border-bottom: 1px solid #DADADA;">
                <table style="width: 100%;">
                    <thead>
                    <tr>
                        <td width="60%">品名</td>
                        <td width="20%">数量</td>
                        <td width="20%">金额</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>今麦郎</td>
                        <td>1</td>
                        <td>100.00</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="total">
                <label class="left">合 计</label>
                <label class="right">100.00</label>
                <div class="clearfix"></div>
                <label class="left">收款金额</label>
                <label class="right">100</label>
                <div class="clearfix"></div>
                <label class="left">找零金额</label>
                <label class="right">0.00</label>
                <div class="clearfix"></div>
            </div>
            <div style="text-align: right;">
                <label>顾客已付款</label>
            </div>
            <span>***************************************</span>
        </div>
        <div class="section5">
            <label>电话：</label>
        </div>
        <span>***************************************</span>
        <div class="section5">
            <label>欢迎光临，谢谢惠顾！</label>
            <label>便利店</label>
        </div>
    </div>
</div>
<div>
    <button onclick="do_print()">进行html打印</button>
    <button onclick="do_print_()">进行图像打印</button>
</div>
<script src="qwebchannel.js" type="text/javascript"></script>
<script src="html2canvas.min.js" type="text/javascript"></script>
<script>
    window.onload = function() {
        new QWebChannel(qt.webChannelTransport, function (channel) {
            window.printer = channel.objects.printer;
        });
    }

    function do_print() {
        if (printer !== null) {
            var html = document.querySelector('#capture').innerHTML;
            printer.print(html);
        }
    }

    function do_print_() {
        if (printer !== null) {
            html2canvas(document.querySelector("#capture")).then(canvas => {
                var data_url = canvas.toDataURL();
                printer.print_(data_url);
            });
        }
    }
</script>
</body>
</html>
```





