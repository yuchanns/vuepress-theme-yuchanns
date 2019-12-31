---
title: 记录关于图片的合成
date: 2019-07-07 19:42:00
tags:
  - php
category: php
---
最近工作中需要服务端合成名片，顺手记录一下过程。
<!-- more -->

-><lazy-image src="/images/poster.jpeg" /><-

获取源代码$\Rightarrow$[how-to-create-posters](https://github.com/yuchanns/how-to-create-posters)

[[toc]]
## 需求分析
首先，如上面的效果图所示，需求内容就是：
> 配合用户上传的海报背景图，读取用户的头像、昵称和邀请码、加上邀请链接的二维码和网站水印，合成一张名片，用于朋友圈分享。

更细致的要求有：
* 合成的名片宽度统一为375，而高度则等比例缩放
* 留白名片高度为120
* 原始的矩形用户头像需要进行圆形切割
* 对各元素位置的一些要求

其实这种名片还挺常见的，比如说手机淘宝的宝贝分享，就会生成类似的商品名片。
## 工具选择
:::tip 本次使用的工具
* 二维码生成类库：[endroid/qr-code](https://github.com/endroid/qr-code)
* 图像处理类库：[intervention/image](https://github.com/Intervention/image)
:::
虽然刚接触`php`的时候我曾有过用GD扩展库直接进行图像处理的经历，但是作为一个成熟（懒惰）的**面向Github编程**的码农，在理清需求之后要考虑的自然就是开源工具的选择了。

二维码生成工具，选的是我最熟悉的**qr-code**，而图像处理工具则使用github上star数高达9.5k的**image**。

## 制作二维码
qr-code的使用方法，其实代码库的README已经写得很清楚，且国内的搜索引擎可以搜到铺天盖地的结果。这里就不进行详细的说明了。
```php
<?php
require_once 'vendor/autoload.php';

use Endroid\QrCode\QrCode;

function createQrcode($path)
{
    // Create a basic QR code
    $qrCode = new QrCode('https://www.yuchanns.xyz');
    $qrCode->setSize(300);
    // Set advanced options
    $qrCode->setWriterByName('png');
    $qrCode->setMargin(10);
    $qrCode->setEncoding('UTF-8');
    $qrCode->writeFile($path);
}
```
## 图像处理
:::tip 文档
[Intervention Image 2.x](http://image.intervention.io/)
:::
这部分才是本文的重点。

关于制作名片的思路，有大同小异的两种：
* 创建一个空白画布，高度是海报缩放后的高度+120。将海报插入，然后对留白部分进行头像、二维码插入、文字绘制等等操作。
* 创建一个高度为120的空白名片画布，插入头像和二维码，绘制文字，然后和缩放后的海报合成一张图片。

我采用的是第一种。
### 缩放海报
阅读文档的API列表，可以知道本工具读取图片的API为[make](http://image.intervention.io/api/make)方法：
```php
public static Intervention\Image\ImageManager make(mixed $source)
```
此方法接受资源（路径、图片实例等）作为参数，并返回一个**Intervention\Image\Image**的实例。

而这个实例可以使用[resize](http://image.intervention.io/api/resize)方法对图片进行缩放：
```php
public Intervention\Image\Image resize (integer $width, integer $height, [Closure $callback])
```
此方法接受长度和宽度，以及一个匿名函数作为参数。

该匿名函数会使用一个**Intervention\Image\Constraint**实例作为参数。**等比缩放操作**就是在匿名函数中指定的。
```php
<?php
require_once 'vendor/autoload.php';

use Intervention\Image\ImageManager;

function scalePosters($path)
{
    // 首先需要实例化一个ImageManage对象
    // 引擎就是使用默认的gd扩展
    $manager = new ImageManager(['driver' => 'gd']);
    $poster = $manager->make($path);
    $poster->resize(375, null, function ($constraint) {
        /**
         * @var \Intervention\Image\Constraint $constraint
         */
        $constraint->aspectRatio();
    });
    return $poster;
}
```
### 创建画布并插入合成
创建画布的API位[canvas](http://image.intervention.io/api/canvas)：
```php
public Intervention\Image\ImageManager canvas(integer $width, integer $height, [mixed $bgcolor])
```
此方法接受宽度和高度，以及颜色作为参数，返回一个**Intervention\Image\Image**实例。

往画布中插入图片的方法是[insert](http://image.intervention.io/api/insert)：
```php
public Intervention\Image\Image insert(mixed $source, [string $position, [integer $x, integer $y]])
```
接受图片实例、位置、xy坐标。
```php
function createCanvas($poster)
{
    $manager = new ImageManager(['driver' => 'gd']);
    $poster_height = $poster->height();
    $canvas = $manager->canvas(375, 120 + $poster_height, '#fff');
    $canvas->insert($poster, 'top-left');
    return $canvas;
}
```
头像、二维码和水印插入方式一样。

**需要注意的是**，经过缩放的二维码可能会变得模糊，可以使用实例的[sharpen](http://image.intervention.io/api/sharpen)方法进行锐化操作：
```php
public Intervention\Image\Image sharpen([integer $amount])
```
### 中文插入
图像实例的[text](http://image.intervention.io/api/text)方法可以进行文字插入：
```php
public Intervention\Image\Image text(string $text, [integer $x, [integer $y, [Closure $callback]]])
```
接受字符串、xy坐标以及回调函数作为参数。回调方法中以**Intervention\Image\AbstractFont**的实例作为参数，可进行字体和大小的设置。

**注意**，由于该类库自身的默认字体并不支持中文，会显示乱码，所以需要自行设置支持中文的字体：
```php
$canvas->text('扫码加入', 275, 635, function ($font) {
    /**
     * @var \Intervention\Image\AbstractFont $font
     */
    $font->file('public/image/font/pingfang.ttf');
    $font->size(14);
});
```
### 遮罩操作
我们在需求中提到，需要对用户的原始矩形头像进行圆形切割操作。但是在该类库中，并无对图像实例直接进行变形的方法。不过在查阅了文档之后，我找到一个遮罩[mask](http://image.intervention.io/api/mask)方法，可以通过遮罩的方式对图片进行切割。
```php
public Intervention\Image\Image mask(mixed $source, [bool $mask_with_alpha])
```
该方法接收一个图片资源，以及一个布尔值作为参数。

布尔值为`true`表示将原始图片替换成给定的图片资源。而我们只是要对原始图片进行切割，所以需要设置为`false`。

而图片资源，既可以是通过make读取的已有的圆形纯色图，也可以用canvas创建。

canvas需要用到[circle](http://image.intervention.io/api/circle)方法：
```php
public Intervention\Image\Image circle( integer $diameter, integer $x, integer $y, [Closure $callback] )
```
该方法接受一个直径、圆心xy坐标和一个回调函数作参数。回调函数提供一个**Intervention\Image\AbstractShape**实例，可进行背景颜色设置等操作。

我的做法是使用canvas创建一个透明遮罩实例，并绘制圆形白色背景图，然后对头像进行遮罩切割操作。
```php
// 创建一个遮罩，用于对头像进行处理
$mask = $manager->canvas(42, 42);
$mask->circle(42, 21, 21, function ($draw) {
    /**
     * @var \Intervention\Image\AbstractShape $draw
     */
    $draw->background('#fff');
});
// 对头像进行遮罩操作
$avatar->mask($mask, false);
```
### 保存成渐进式jpeg
在完成对`$canvas`实例的所有绘制操作之后，就可以保存到服务器上或者直接返回给客户端了。

不过图片实例还提供了一个[interlace](http://image.intervention.io/api/interlace)方法，用于将图片设置为隔行扫描的模式，这样可以将图片保存为[渐进式格式](https://en.wikipedia.org/wiki/JPEG#JPEG_compression)：
```php
public Intervention\Image\Image interlace([boolean $interlace])
```
然后我们调用[save](http://image.intervention.io/api/save)方法进行保存：
```php
public Intervention\Image\Image save([string $path, [int $quality], [string $format]])
```
该方法接受文件保存路径、质量和格式作为参数。
```php
// 保存为渐进式jpeg
$canvas->interlace(true);
$canvas->save($path, 80);
```
## 总结
本篇文章记录了如何利用背景图合成名片的过程。整个流程没有什么难点，只要花点时间耐心阅读文档就可以完成。

找个时间，可以看看类库的源码，了解一下实现原理。
