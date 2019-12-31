---
title: psr标准-1和2
date: 2019-06-13 16:30:00
tags:
  - psr
category: php
---
阅读并记录 **[PHP Standards Recommendations](https://www.php-fig.org/psr/)**
<!-- more -->
## psr-1 基本编码标准
### 1.文件
#### 1.1.php标签
* php代码必须使用`<?php ?>`或`<?= ?>`
#### 1.2.字符编码
* php代码必须只能使用无bom的utf-8
#### 1.3.副作用
* 同一个文件中要么使用声明符号要么使用副作用执行逻辑，不可共存
* 声明符号指class function const等
* 副作用包括但不仅限于：产生输出，特指`require`和`include`的使用，连接额外服务，修改ini的设置，发起错误和异常，修改全局和静态变量，读写文件等等

以下是应当避免的错误写法：
```php
<?php
// 副作用：更改ini的设置
ini_set('error_reporting', E_ALL);

// 副作用：载入文件
include "file.php";

// 副作用：产生输出
echo "<html>\n";

// 声明
function foo()
{
    // function body
}
```
以下是包含声明但无副作用的正确写法，应当模仿：
```php
<?php
// 声明
function foo()
{
    // function body
}

// 条件声明*不*是副作用
if (! function_exists('bar')) {
    function bar()
    {
        // function body
    }
}
```
### 2.命名空间和类名
* 命名空间和类必须遵守自动载入的psr规范：[PSR-0,PSR-4]
* 这意味着一个类对应一个文件，并且必须处于至少一个顶级命名空间
* 类名必须以变种驼峰式即全部首字母大写命名（StudlyCaps）
* php5.3+代码必须使用正式的命名空间
```php
<?php
// PHP 5.3 and later:
namespace Vendor\Model;

class Foo
{
}
```
### 3.类的常量、属性和方法
#### 3.1.常量
* 常量名必须全部大写且以下划线分割
```php
<?php
namespace Vendor\Model;

class Foo
{
    const VERSION = '1.0';
    const DATE_APPROVED = '2012-06-01';
}
```
#### 3.2.属性
* 属性命名没有特别推荐，无论使用什么命名约定，都应该在合理的范围内一致地应用。该范围可以是vendor-level, package-level, class-level, 和 method-level
#### 3.3.方法
* 方法必须以驼峰式命名`camelCase()`
## psr-2 编码风格指引
### 1.总体
#### 1.1.基本编码标准
* 编码必须遵循psr-1
#### 1.2.文件
* 所有php文件必须在行尾使用Unix LF(换行)
* 所有php文件结尾必须有一行空白
* 纯php代码结尾必须没有`?>`
#### 1.3.行
* 对行长度不应该有硬限制
* 软限制必须是行长度120字符内
* 行不应超过80个字符；超过此长度的行应拆分为多个后续行，每行不超过80个字符
* 在非空行的末尾不能有空格
* 可以添加空行以提高可读性并指示相关的代码块
* 每行不能有超过一条语句
#### 1.4.缩进
* 代码必须使用4个空格作为缩进，不能使用制表符
#### 1.5.关键字和True/False/Null
* php关键字必须小写
* `true`, `false`, 和 `null`必须小写
### 2.命名空间和使用声明
* 如果使用命名空间，必须在其后有一个空白行
* 如果使用声明，必须写在命名空间之后
* 一个`use`必须对应一个声明
* 在`use`代码块后必须有一个空白
```php
<?php
namespace Vendor\Package;

use FooClass;
use BarClass as Bar;
use OtherVendor\OtherPackage\BazClass;

// ... additional PHP code ...
```
### 3.类、属性和方法
* 类指代所有的class、interface和trait
#### 3.1.继承与实现
* `extends`和`implements`关键字必须声明在与类名同一行
* 开花括号必须在类名的下一行独立成行，闭花括号必须独立成行
* 实现多个接口时，第一个接口必须放在下一行，并且每一行只能有一个接口
```php
<?php
namespace Vendor\Package;

use FooClass;
use BarClass as Bar;
use OtherVendor\OtherPackage\BazClass;

class ClassName extends ParentClass implements
    \ArrayAccess,
    \Countable,
    \Serializable
{
    // constants, properties, methods
}
```
#### 3.2.属性
* 所有属性都必须声明可见性
* 不能使用`var`来声明属性
* 每一条语句只能有一个属性被声明
* 属性名称不能用单个下划线为前缀表示保护或私有性
#### 3.3.方法
* 所有方法都必须声明可见性
* 方法名称不能用单个下划线为前缀表示保护或私有性
* 开花括号必须在函数名的下一行独立成行，闭花括号必须独立成行
#### 3.4.方法参数
* 在参数列表中，每个逗号不能有空格，每个逗号后必须有一个空格
* 具有默认值的参数必须放在参数列表的最后
```php
<?php
namespace Vendor\Package;

class ClassName
{
    public function foo($arg1, &$arg2, $arg3 = [])
    {
        // method body
    }
}
```
* 如果参数列表被分割成多行，换行后应该缩进一次。第一个参数必须放在下一行，并且每一行只能有一个参数。当这样做时，闭括号和开花括号应该在同一行并以一个空格隔开
```php
<?php
namespace Vendor\Package;

class ClassName
{
    public function aVeryLongMethodName(
        ClassTypeHint $arg1,
        &$arg2,
        array $arg3 = []
    ) {
        // method body
    }
}
```
#### 3.5.abstract、final和 static
* 使用`abstract`和`final`必须写在可见性之前
* 使用`static`必须放在可见性之后
```php
<?php
namespace Vendor\Package;

abstract class ClassName
{
    protected static $foo;

    abstract protected function zim();

    final public static function bar()
    {
        // method body
    }
}
```
#### 3.6.调用方法和函数
* 当调用方法或函数时，方法名和开括号之间不能有空格，闭括号之前不能有空格。
* 参数列表逗号前不能有空格，逗号后必须有空格
```php
<?php
bar();
$foo->bar($arg1);
Foo::bar($arg2, $arg3);
```
* 如果参数列表被分割为多行，换行后应该缩进一次。第一个参数必须放在下一行，并且每一行只能有一个参数
```php
<?php
$foo->bar(
    $longArgument,
    $longerArgument,
    $muchLongerArgument
);
```
### 4.控制结构体
* 在控制结构体的关键字后必须有一个空格
* 在开括号前不能有空格
* 在闭括号后不能有空格
* 在闭括号和花括号之间必须有一个空格
* 控制结构体内部本体必须要有一次缩进
* 闭花括号必须在控制结构体内部本体后独立一行
* 控制结构体的内部本体必须用花括号划分出来
#### 4.1.if、elseif和else
```php
<?php
if ($expr1) {
    // if body
} elseif ($expr2) {
    // elseif body
} else {
    // else body;
}
```
* 如果有`elseif`和`else`，必须和闭花括号同一行
* 必须使用`elseif`代替`else if`
#### 4.2.switch和case
* `case`语句相对`switch`必须有一个缩进
* `break`关键字相对`case`必须有一个缩进
* 在一个非空case中没有使用break时必须添加`// no break`注释
```php
<?php
switch ($expr) {
    case 0:
        echo 'First case, with a break';
        break;
    case 1:
        echo 'Second case, which falls through';
        // no break
    case 2:
    case 3:
    case 4:
        echo 'Third case, return instead of break';
        return;
    default:
        echo 'Default case';
        break;
}
```
#### 4.3.while和do while
```php
<?php
while ($expr) {
    // structure body
}

do {
    // structure body;
} while ($expr);
```
#### 4.4.for
```php
<?php
for ($i = 0; $i < 10; $i++) {
    // for body
}
```
#### 4.5.foreach
```php
<?php
foreach ($iterable as $key => $value) {
    // foreach body
}
```
#### 4.6.try和catch
```php
<?php
try {
    // try body
} catch (FirstExceptionType $e) {
    // catch body
} catch (OtherExceptionType $e) {
    // catch body
}
```
### 5.闭包
* 一个闭包函数必须声明在`function`关键字一个空格之后，并在`use`前后也有一个空格
* 开花括号必须和闭包函数一行，闭花括号必须在函数体之后独立一样
* 开括号之后和闭括号之前不能有空格
* 参数列表中每个逗号前不能有空格，每个逗号后必须有一个空格
* 带有默认值的闭包函数参数必须放在最后
* 参数若有分行同上
```php
<?php
$closureWithArgs = function ($arg1, $arg2) {
    // body
};

$closureWithArgsAndVars = function ($arg1, $arg2) use ($var1, $var2) {
    // body
};

$longArgs_longVars = function (
    $longArgument,
    $longerArgument,
    $muchLongerArgument
) use (
    $longVar1,
    $longerVar2,
    $muchLongerVar3
) {
    // body
};
```
