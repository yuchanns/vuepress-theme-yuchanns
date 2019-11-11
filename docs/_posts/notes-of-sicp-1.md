---
title: 学习记录-计算机程序的构造和解释-第一章
date: 2019-05-05 14:14:00
tags:
  - scheme
  - sicp
  - 魔法书
category: 学习笔记
---
随兴做的一些有关第一章的学习记录。
<!-- more -->
## 程序设计的基本元素

## 过程和它们所产生的计算
### 练习 1.19
:::tip 题目
使用尾递归计算斐波那契数列的过程中，状态变量a和b有以下变换规则，a←a+b和b←a，现在将这种变换称为T变换。从1和0开始将T反复应用n次，将产出一对数Fib(n+1)和Fib(n)。

换句话说，斐波那契数可以通过将$T^n$应用于对偶(1, 0)而产生出来。

现在将T看做是变换族$T_{pq}$中p=0且q=1的特殊情况，其中$T_{pq}$是对偶(a, b)按照a←bq+aq+ap和b←bp+aq规则的变换。请证明，如果我们应用变换$T_{pq}$两次，其效果等同于应用同样形式的一次变换$T_{p'q'}$，其中p'和q'可以由p和q计算出来。这就指明了一条求出这种变换的平方的路径。将所有的这些集中到一起，形成下面的过程，其运行只需要对数的步数：
```scheme
(define (fib n)
  (fib-iter 1 0 0 1 n))
(define (fib-iter a b p q count)
  (cond ((= count 0) b)
        ((even? count)
          (fib-iter a
                    b
                    <??>      ; compute p'
                    <??>      ; compute q'
                    (/ count 2)))
        (else (fib-iter (+ (* b q) (* a q) (* a p))
                        (+ (* b q) (* a q))
                        p
                        q
                        (- count 1)))))
```
:::
解：

已知$a_{2}←b_{1}q+a_{1}q+a_{1}p和b_{2}←b_{1}p+a_{1}q$，这是$a_{2}, b_{2}$和$a_{1}$, $b_{1}$的关系。所以要求出这种变换的平方的路径就是求出$a_{3}$, $b_{3}$和$a_{1}$, $b_{1}$的关系。

:::tip 应用关系可得：
$$a_{3}=b_{2}q+a_{2}q+a_{2}p$$
$$b_{3}=b_{2}p+a_{2}q$$
将$a_{1}$和$b_{1}$代入计算可得：
$$a_{3}=(b_{1}p+a_{1}q)q+(b_{1}q+a_{1}q+a_{1}p)q+(b_{1}q+a_{1}q+a_{1}p)p$$
$$a_{3}=b_{1}qp+a_{1}q^2+b_{1}q^2+a_{1}q^2+a_{1}qp+b_{1}qp+a_{1}qp+a_{1}p^2$$
$$a_{3}=b_{1}(q^2+2pq)+a_{1}(2qp+2q^2+p^2)$$
由于$a_{3}=b_{1}q'+a_{1}q'+a_{1}p'$，所以：
$$q' = q^2+2pq$$
$$p' = 2qp+2q^2+p^2-q'=q^2+p^2$$
:::
所以答案为：
 ```scheme
 (define (fib n)
   (fib-iter 1 0 0 1 n))
 (define (fib-iter a b p q count)
   (cond ((= count 0) b)
         ((even? count)
           (fib-iter a
                     b
                     (+ (* q q) (* p p))      ; compute p'
                     (+ (* q q) (* 2 q p))    ; compute q'
                     (/ count 2)))
         (else (fib-iter (+ (* b q) (* a q) (* a p))
                         (+ (* b q) (* a q))
                         p
                         q
                         (- count 1)))))
 ```
 ## 用高阶函数做抽象
 人们对功能强大的程序设计语言有一个必然要求，就是能为公共的模式命名，建立抽象，而后直接在抽象的层次上工作。

### 过程作为参数
:::tip 3个例子
* 计算从a到b的各整数之和：
```scheme
(define (sum-integers a b)
  (if (> a b)
      0
      (+ a (sum-integers (+ a 1) b))))
```
* 计算给定范围内的整数的立方和：
```scheme
(define (cube x) (* x x x))
(define (sum-cubes a b)
  (if (> a b)
      0
      (+ (cube a) (sum-cubes (+ a 1) b))))
```
* 计算序列$\frac{1}{1\cdot3}+\frac{1}{5\cdot7}+\frac{1}{9\cdot11}+\cdots$之和：
```scheme
(define (pi-sum a b)
  (if (> a b)
      0
      (+ (/ 1.0 (* a (+ a 2))) (pi-sum (+ a 4) b))))
```
:::
可以看出，这三个过程共享着一种公共的基础模式，称为`求和记法`：
:::tip 求和记法
$\sum\limits_{n=a}^{b}f(n)=f(a)+\cdots+f(b)$
:::
翻译成程序语言即是：
```scheme
(define (sum term a next b)
  (if (> a b)
      0
      (+ (term a)
         (sum term (next a) next b))))
```
利用这个公共模式，上面三个例子可以改写为：
```scheme
(define (inc n) (+ n 1))
; 计算从a到b的各整数之和
(define (identity x) x)
(define (sum-integers a b)
  (sum identity a inc b))
; 计算给定范围内的整数的立方和
(define (sum-cubes a b)
  (sum cube a inc b))
; 计算序列之和
(define (pi-sum a b)
  (define (pi-term x)
    (/ 1.0 (* a (+ a 2))))
  (define (pi-next x)
    (+ x 4))
  (sum pi-term a pi-next b))
```
:::tip example
求函数$f$在范围a和b之间的定积分的近似值，可以用下面的公式完成
$$f_a^b=[f(a+\frac{dx}{2})+f(a+dx+\frac{dx}{2})+f(a+2dx+\frac{dx}{2})+\cdots]dx$$
:::
描述为一个过程：
```scheme
(define (integral f a b dx)
  (define (add-dx x) (+ x dx))
  (* (sum f (+ a (/ dx 2.0)) add-dx b)
     dx)
```
### 练习1.29
:::tip 辛普森积分法
辛普森规则求定积分，公式为：
$$\frac{h}{3}[y_0+4y_1+2y_2+4y_3+2y_4+\cdots+2y_{n-2}+4y_{n-1}+y_n]$$
其中h=(b-a)/n，n是某个偶数，而$y_k=f(a+kh)$。请定义出一个具有参数f、a、b和n，采用该规则计算并返回积分值的过程，求出cube在0和1之间的积分（用n=100和n=1000）
:::

解：

观察公式，我们知道了求和部分为$y_0+4y_1+2y_2+\cdots+y_n$，当k为0或n时$y_k$的常数为0，当k为奇数时，常数为4，k为偶数时常数则为2。

当我们尝试往过程```(sum term a next b)```中代入参数时，得到term=f、a=0、next=inc、b=n的结果。但实际上每一轮的(term a)返回值根据k而变化。

因此我们应当把$y_0、4y_1、2y_2、\cdots、4y_{n-1}、y_n$分别看成一个内含f的整体，即定义一个过程`simpson-term`：
```scheme
(define (simpson-term k f a h n)
  (define y (f (+ a (* k h))))
  (if (or (= k 0) (= k n))
      y
      (if (even? k)
          (* 2 y)
          (* 4 y))))
```

现在我们有term=simson-term、a=0、next=inc、b=n，可得：
```scheme
(define (simpson-integral f a b n)
  (define h (/ (- b a) n))
  (define (simpson-term k)
    (define y (f (+ a (* k h))))
    (if (or (= k 0) (= k n))
        y
        (if (even? k)
            (* 2 y)
            (* 4 y))))
  (* (/ h 3)
     (sum simpson-term 0 inc n)))
```
:::tip 在线演示
辛普森积分法
:::
<iframe src="https://paiza.io/projects/e/kyYbS0qOXSEMoEPmfkNpSg?theme=solarized_light" width="100%" height="500" scrolling="no" seamless="seamless"></iframe>

有趣的是，上文解题过程中，将过程f包裹起来加上一层simpson-term外壳，进行额外处理然后返回的行为，就是所谓的**装饰器模式**（*Decorator Pattern*）。

--- 
以下草稿，分析过程待补完...
### 1.30 将sum重写为线性迭代的过程
* 什么是线性递归和线性递归（概念）？
* 两者区别？

```scheme
(define (sum term a next b)
	(define (iter a result)
		(if (> a b)
		  result
			(iter (next a) (+ result (term a)))))
	(iter a 0))
```
### 1.31 抽象出product过程用来定义factorial（阶乘）
```scheme
; 线性迭代写法
(define (product term a next b)
  (define (iter a result)
    (if (> a b)
      result
      (iter (next a) (* result (term a)))))
  (iter a 1))
  
; 线性递归写法
(define (product term a next b)
  (if (> a b)
    1
    (* (term a)
       (product term (next a) next b))))
```
按照公式$\frac{π}{4}=\frac{2\cdot4\cdot4\cdot6\cdot6\cdot8\cdot\cdot\cdot}{3\cdot3\cdot5\cdot5\cdot7\cdot7\cdot\cdot\cdot}$计算π的近似值？
### 1.32 抽象出sum和product的公共模式accumulate
```scheme
; 线性迭代写法
(define (accumulate combiner null-value term a next b)
	(define (iter a result)
		(if (> a b)
			result
			(iter (next a) (combiner result (term a)))))
	(iter a null-value))

; 线性递归写法
(define (accumulate combiner null-value term a next b)
	(if (> a b)
		null-value
		(combiner (term a)
					 (accumulate combiner null-value term (next a) next b))))
```
### 练习1.33 引入过滤器概念，实现更一般版本的filter-accumulate抽象过程
提示：判断奇偶就是一种过滤过程

---
to be continued.
