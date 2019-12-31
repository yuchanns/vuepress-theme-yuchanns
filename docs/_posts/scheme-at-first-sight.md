---
title: 初识Scheme
date: 2019-01-14 20:27:09
tags:
- scheme
category: lisp
---
<!-- more -->
尽管两年前刚投身代码这个行业之初，我就听过`Lisp`的鼎鼎大名，不过一直没有想去了解过。后来在王垠的博客里见到他大谈特谈`Scheme`，不明觉厉的我也只当是`MySQL`中的`数据库`的意思。

最近，我对各种语言都充满了好奇心，想要了解更多的语言，遵循着*Alan J. Perlis*的名言：
> A language that doesn't affect the way you think about programming, is not worth knowing.

而寻找着。

这半年来，我学习了`python`、`c`和`c++`，尽管还未全部掌握，但对代码的理解已经发生了很大的改变。

2019年，我对自己的要求是，掌握一门静态语言、一门生态丰富的动态语言、一门前端框架。加深对`mysql`和`redis`的了解。

今天，在完成手头的工作后，我想起了慕名已久的`lisp`。迅速在*Google*上做了简短的了解，得知目前`lisp`主要分为`Common Lisp`和`Scheme`两大家族。而受王垠的影响，我打算从`Scheme`入手学习`Lisp`。

学习的资料来源于*Takafumi Shido*编写的[Yet Another Scheme Tutorial](http://deathking.github.io/yast-cn/)中文版。

首先，我采用的编译器是[ChezScheme](https://github.com/cisco/ChezScheme)，安装方式很简单，在`github`上`clone`代码以后，进入到根目录，执行：

```bash
./configure --installprefix=/usr/local
make && make install
make clean
```
即可。

IDE方面，虽然网络上大家都建议使用Emacs，不过对我来说不太顺手（我主要使用`Jetbrains`全家桶，以及`VIM`）。鉴于`VIM`在这方面并没有什么特效，我便选择了微软的`Visual Studio Code`。

只需要在VSC插件商店中下载`vscode-scheme`和`Code Runner`就可以。
在安装完这两个插件后，打开设置，并搜索`code-runner:executor map by file extension`，然后选择`在settings.json中编辑`，并在右侧的用户设置中添加：
```json
{
    "code-runner.executorMapByFileExtension": {
        ".vb": "cd $dir && vbc /nologo $fileName && $dir$fileNameWithoutExt",
        ".vbs": "cscript //Nologo",
        ".scala": "scala",
        ".jl": "julia",
        ".cr": "crystal",
        ".ml": "ocaml",
        ".exs": "elixir",
        ".hx": "haxe --cwd $dirWithoutTrailingSlash --run $fileNameWithoutExt",
        ".rkt": "racket",
        ".ahk": "autohotkey",
        ".au3": "autoit3",
        ".kt": "cd $dir && kotlinc $fileName -include-runtime -d $fileNameWithoutExt.jar && java -jar $fileNameWithoutExt.jar",
        ".kts": "kotlinc -script",
        ".dart": "dart",
        ".pas": "cd $dir && fpc $fileName && $dir$fileNameWithoutExt",
        ".pp": "cd $dir && fpc $fileName && $dir$fileNameWithoutExt",
        ".d": "cd $dir && dmd $fileName && $dir$fileNameWithoutExt",
        ".hs": "runhaskell",
        ".nim": "nim compile --verbosity:0 --hints:off --run",
        ".csproj": "dotnet run --project",
        ".fsproj": "dotnet run --project",
        ".ss": "scheme" // 这是新增，设置scheme编译.ss后缀文件
    }
}
```
即可着手学习`Scheme`

目前看的进度还不是很多，不过递归给我的印象很深刻。`Scheme`语言的神奇使我感觉不写一篇日志恐怕难以平复我胸中的兴奋之情。以下稍作一些今天学习的记录：
```scheme
(define list_01 `(1 2 3 4 5))
;尾递归求表中元素和
(define (my-sum ls)
    (my-sum-rec ls 0))
(define (my-sum-rec ls n)
    (if (null? ls)
        n
        (my-sum-rec (cdr ls) (+ (car ls) n))))
;尾递归翻转表中元素
(define (my-reverse ls)
    (my-reverse-rec ls `()))
(define (my-reverse-rec ls0 ls1)
    (if (null? ls0)
        ls1
        (my-reverse-rec (cdr ls0) (cons (car ls0) ls1))))
        
;运行函数，输出结果
(display (my-sum list_01))  ;输出15
(display #\newline)  ;换行
(display (my-reverse list_01))  ;输出(5 4 3 2 1)
(exit)

```

> 求解一元二次方程ax² + bx + c = 0;
> 对`let`的应用

```scheme
;ax² + bx + c = 0                                                                                                                  
;x² + (b/a)x + c/a = 0                                                                                                             
;(x + b/2a)² - b²/4a² + c/a = 0                                                                                                
;(x + (b/2a))² = b²/4a² - c/a                                                                                                    
;(x + (b/2a))² = (b² - 4ac)/4a²                                                                                                  
;x + (b/2a) = (+-)sqrt(b² - 4ac)/2a                                                                                                
;x = (+-)sqrt(b² - 4ac)/2a - b/2a                                                                                                  
;x = (+-)(sqrt(b² - 4ac) - b)/2a 

(define (quadric-equation a b c)
  (if (zero? a)
      'error
      (let ((d (- (* b b) (* 4 a c))))
        (if (negative? b)
            `()
            (let ((e (/ b -2 a)))
              (if (zero? d)
                  (list e)
                  (let ((f (/ (sqrt d) 2 a)))
                    (list (+ e f) (- e f)))))))))
(display (quadric-equation 1 4 4))
(display #\newline)
```

> `named let`，可用于表达循环。

`let`同时具有定义函数的功能。以上文中的尾递归反转表中元素为例：

```scheme
(define (my-reverse ls)
  (let my-reverse-rec((ls0 ls) (ls1 `()))
    (if (null? ls0)
        ls1
        (my-reverse-rec (cdr ls0) (cons (car ls0) ls1)))))
(display "the reverse of (1 2 3 4 5) is ")
(display (my-reverse `(1 2 3 4 5)))
(display #\newline)
(exit)
```
通过`命名let`，`my-reverse-rec`得以嵌入`my-reverse`函数体当中

> letrec，允许局部变量在定义中调用自己

用法`(letrec (函数定义) (调用函数))`

```scheme
;letrec                                                                                                                             
(define (my-reverse ls)
  (letrec ((my-reverse-rec (lambda (ls0 ls1)
                             (if (null? ls0)
                                 ls1
                                 (my-reverse-rec (cdr ls0) (cons (car ls0) ls1))))))
    (my-reverse-rec ls `())))
(display "the reverse of (1 2 3 4 5) is ")
(display (my-reverse `(1 2 3 4 5)))
(display #\newline)
(exit)
```