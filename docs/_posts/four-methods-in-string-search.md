---
title: 茴字的四种写法——字符串搜索（一）
date: 2019-09-15 20:37:00
tags:
  - 算法
category: 学习笔记
---
最近在看golang基础，在字符串操作的部分，包含了关于判断一个字符串是否包含在另一个字符串中的标准方法，好奇之下研究了源码是怎么实现的，于是有了这篇文章。
<!-- more -->
-><lazy-image src="/images/huixiangdou.jpg" /><-
当然，本文的代码是以php写成的。

字符串搜索的常见四种算法有：
* Brute-Force算法
* Rabin-Karp算法
* Finite Automata算法
* Knuth-Morris-Pratt算法

## 暴力匹配算法
这是最简单容易想到的一种算法。原理很简单，通过外一层源字符串和内一层目标字符串嵌套循环逐字匹配判断是否相等。

通常来说，我们要实现的目标是，判断一个字符串是否在另一个字符串当中，如果是，则返回从包含字符串在内的剩余全部内容，否则返回false。

此处我们稍作修改，实现判断是否存在，存在返回匹配字符的角标，否则返回false。
```php
class StringsHelper
{
    /**
     * 暴力匹配
     * @var string $str1 源字符串
     * @var string $str2 目标字符串
     */
    public static function bfStrSearch($str1, $str2)
    {
        if (!$str2) return $str1;  // 如果目标字符串为空，则返回整个字符串
        $i = 0;  // 匹配源字符串的角标初始化
        $count1 = strlen($str1);
        while ($i < $count1) {  // 角标在源字符串长度范围内循环
            if ($str1[$i] === $str2[0]) {  // 如果当前角标对应的字符与目标字符串开头匹配
                $count2 = strlen($str2);
                for ($j=1; $j<$count2; $j++) {  // 进行目标字符串循环匹配
                    if ($str1[$i+$j] === $str2[$j]) {
                        if ($j === ($count2- 1)) {  // 如果与目标字符串完全匹配
                            return $i;  // 则返回匹配时的源字符串角标起始
                        }
                    } else {  // 遇到一次不匹配直接打断当前循环
                        break;
                    }
                }
                return false;
            }
            $i ++;
        }
        return false;
    }
}

function getMicrotime($time)
{
    return $time * 1000000;
}

$source = "yuchanns'Atelier";
$target = "s'At";
$t1 = microtime(true);
$result = StringsHelper::bfStrSearch($source, $target);
$t2 = microtime(true);


var_dump($result);  // int(7)
echo "bf cost: " . getMicrotime($t2 - $t1) . 'μs' . PHP_EOL;  // bf cost: 41.961669921875μs
```
此算法简单易懂，比较大一个的缺陷就是嵌套循环次数过多，最坏的情况有m*n次，耗时较长。

如果我们将目标字符串视为一个整体，取源字符串等长字符串来进行匹配，就可以省去内层循环的消耗。同时，对于外层循环，每次匹配失败，我们可以尝试左移除第一个字符，右添加一个字符，这样进行匹配，可以重复利用中间那部分字符串，最坏需要m-n次循环。
## Rabin-Karp算法
上面所说的改进方式，就是**Rabin-Karp算法**<sup>[[1]](https://en.wikipedia.org/wiki/Rabin%E2%80%93Karp_algorithm)</sup>，又称为滚动哈希算法。**这正是golang字符串匹配所使用的算法**。

下面为了简化，仅对ascii表范围内字符作讨论。

具体原理为：
* 逐字符转换源字符串和目标字符串ascii码
* 使用某种哈希函数，计算出哈希值
* 将目标字符的哈希值相加（只需一次）
* 将第一次进行匹配的源子字符串哈希值相加
* 匹配失败，减去源字符串第一个字符的哈希值，加上下一个字符的哈希值
* 循环上述一步直至匹配成功或长度结束
### 不使用哈希
下面来看代码实现：
```php
class StringsHelper
{
    /**
     * Rabin-Karp
     * @var string $str1 源字符串
     * @var string $str2 目标字符串
     */
    public static function rkStrSearch($str1, $str2)
    {
        if (!$str2) return $str1;
        $count1 = strlen($str1);
        $count2 = strlen($str2);
        if ($count1 < $count2) return false;
        $tmp = 0;
        $cmp = 0;
        for ($i=0; $i<$count2; $i++) {
            $tmp += ord($str1[$i]);
            $cmp += ord($str2[$i]);
        }
        while ($i < $count1) {
            $startKey = $i-$count2;
            if ($tmp === $cmp) {
                return $startKey;
            }
            $tmp -= ord($str1[$startKey]);
            $tmp += ord($str1[$i]);
            $i ++;
        }
        return false;
    }
}
```
上述代码中，我并没有使用哈希函数计算出相应的哈希值，而是直接将他们进行相加操作。如果匹配字符串短，且只包含A-Za-z，还看不出什么问题。

但如果你将源字符串改成`BCD`，将目标字符串改为`AD`，运行程序，就会发现竟然得出从第一个字符串开始匹配的结果！
### 使用哈希

所以，有必要使用一个哈希函数，将ascii值进行放大操作，避免出现不同字符哈希值相加会相等的情况。

通常我们使用ascii码*常数n的多次方来哈希。

比如说，一个目标字符串的长度为3，内容为`ABC`，那么他的哈希值分别是An<sup>2</sup>、Bn<sup>1</sup>、Cn<sup>0</sup>，将其相加得到cmp。

匹配源字符串内容为`CDBABCDEF`，第一次匹配子字符串的哈希值和为Cn<sup>2</sup>+Dn<sup>1</sup>+Bn<sup>0</sup>=tmp。很显然他们不会相等，匹配失败。

接着，将子字符串减去第一个字符串的哈希值，整体乘以一次常数，然后加上下一个字符串的哈希值，即tmp-Cn<sup>2</sup>+An<sup>2</sup>，再次匹配。

如此循环，哈希值沿着字符串就像平移一样，这就是它被成为滚动哈希的原因。

那么常数n应该是多少呢？

答案是越大越好。以golang来说，使用的是**16777619**。

下面我们对代码进行修改。**注意**，由于php一般不支持大整数运算，因此需要使用bc系列函数辅助。bc系列的函数通过将数字转为字符串来确保精度，避免计算结果以科学计数法表示。
```php
class StringsHelper
{
    const NUMBER = '16777619';  // 以字符串形式表示

    public static function rkStrSearch($str1, $str2)
    {
        if (!$str2) return $str1;
        $count1 = strlen($str1);
        $count2 = strlen($str2);
        if ($count1 < $count2) return false;
        $tmp = '0';
        $cmp = '0';
        for ($i=0; $i<$count2; $i++) {
            $pow = bcpow(self::NUMBER, $count2-1-$i);
            $tmp = bcadd($tmp, bcmul((string)ord($str1[$i]), $pow));
            $cmp = bcadd($cmp, bcmul((string)ord($str2[$i]), $pow));
        }
        $pow2 = bcpow(self::NUMBER, $count2-1);
        while ($i < $count1) {
            $startKey = $i-$count2;
            if ($tmp === $cmp) {
                return $startKey;
            }
            $tmp = bcsub($tmp, bcmul((string)ord($str1[$startKey]), $pow2));
            $tmp = bcmul($tmp, self::NUMBER);
            $tmp = bcadd($tmp, (string)ord($str1[$i]));
            $i ++;
        }
        return false;
    }
}

$source = "yuchanns'Atelier";
$target = "s'At";
$t1 = microtime(true);
$result = StringsHelper::rkStrSearch($source, $target);
$t2 = microtime(true);


var_dump($result);  // int(7)
echo "rk cost: " . getMicrotime($t2 - $t1) . 'μs' . PHP_EOL;  // rk cost: 57.93571472168μs
```

需要注意，虽然时间复杂度相同，理论上最佳状态rk算法会比bf算法快很多。而从PHP中我们没有得出这样的结果的原因是，使用bc系列函数进行大数值计算会有一定的损耗。