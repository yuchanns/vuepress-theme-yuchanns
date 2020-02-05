---
title: 主题使用指南
date: 2019-12-31 12:00
category: docs
tags:
  - 中文
  - WIP
pinned: 1
---
**vuepress-theme-yuchanns**主题使用指南

[![Netlify Status](https://api.netlify.com/api/v1/badges/adac5706-bf93-419a-a239-782fa94d4358/deploy-status)](https://app.netlify.com/sites/vuepress-theme-yuchanns/deploys)
[![CircleCI](https://circleci.com/gh/yuchanns/vuepress-theme-yuchanns/tree/master.svg?style=svg&circle-token=7d312c35e3cb469cdfef653f334741bb26052888)](https://circleci.com/gh/yuchanns/vuepress-theme-yuchanns/tree/master)
[![Actions Status](https://github.com/yuchanns/vuepress-theme-yuchanns/workflows/Node%20CI/badge.svg)](https://github.com/yuchanns/vuepress-theme-yuchanns/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/yuchanns/vuepress-theme-yuchanns/blob/master/LICENSE)

:::tip
vuepress-theme-yuchanns是一个模仿github风格的主题皮肤，刚刚诞生不久，采用[MIT](https://github.com/yuchanns/vuepress-theme-yuchanns/blob/master/LICENSE)许可证模式发布。

欢迎发表[issue](https://github.com/yuchanns/vuepress-theme-yuchanns/issues/new)提出feature需求，或者创建[pr](https://github.com/yuchanns/vuepress-theme-yuchanns/compare)推送自己的想法参与到代码贡献中！
:::
<!-- more -->

[[toc]]

## 使用本主题的博客
* [yuchanns'Atelier](https://yuchanns.org)

## 快速使用
:::danger 警示
本主题当前版本为<mark>v0.0.20</mark>，尚在快速开发中，可能会有颠覆性更改。请勿冒险用于正式产品中！
:::
### 全新使用
第一次使用`Vuepress`？关于`Vuepress`的使用方法，请参考[官方文档](https://vuepress.vuejs.org/zh/)

假设你的项目结构如下：
```sh
.
├─ docs            # 博客目录
│  ├─ _posts       # 博文目录
│  └─ .vuepress    # 主题配置目录
│     └─ config.js # 主题配置文件
└─ package.json
```
### 获取主题
在一个`Vuepress`项目中执行安装本主题：
```sh
yarn add vuepress-theme-yuchanns # 或者 npm install vuepress-theme-yuchanns
```
然后到`.vuepress/config.js`中将**theme**一项配置改成本主题名称缩写`yuchanns`
```js
// .vuepress/config.js

module.exports = {
  theme: 'yuchanns'
}
```
接着在`package.json`中加入以下脚本：
```js
{
  "scripts": {
    "dev": "vuepress dev docs --no-cache --temp .temp",
    "build": "vuepress build docs --dest docs-dist"
  }
}
```
然后在项目根目录下执行`yarn dev`(或者`npm run dev`)，访问localhost:8080即可查看本主题效果。

执行`yarn build`(或者`npm run build`)，即可产出静态页面用于部署。

## 配置概览
### 基本特性
本主题目前只具备博客的最基本功能，除此之外，也具有一些特色特性——


#### 基本功能：
* 首页
* 文章
* 分类
* 标签
* 归档
* 国际化
* 评论

#### 主题特性：
* 归档热图(github贡献度风格)
* 首页分类标志颜色定制
* 分类图标和分类说明定制
* 社交服务导航
* 文章置顶

### 主题通用配置
<details>
<summary>点此展开</summary>

```js
module.exports = {
  title: 'vuepress-theme-yuchanns',

  description: 'a Vuepress theme presented by yuchanns',

  theme: 'yuchanns',

  locales: {
    '/': {
      lang: 'en-US'
    }
  },

  themeConfig: {
    lang: 'en-US',

    author: {
      name: 'yuchanns',
      avatar: '/yuchanns.jpg',
      desc: '面向Github编程',
      job: '后端工程师',
      location: '深圳',
      email: 'airamusume@gmail.com',
      link: 'yuchanns.org'
    },

    vssue: {
      platform: 'github',
      owner: 'your github username',
      repo: 'your github repository',
      clientId: 'your oAuth App clientId',
      clientSecret: 'your oAuth App clientSecret'
    },

    pagination: {
      lengthPerPage: 5
    },

    sns: {
      github: {
        account: 'yuchanns',
        link: 'https://github.com/yuchanns'
      },
      twitter: {
        account: 'airamusume',
        link: 'https://twitter.com/airamusume'
      },
      facebook: {
        account: 'airamusume',
        link: 'https://www.facebook.com/airamusume'
      },
      youtube: {
        account: 'Github',
        link: 'https://www.youtube.com/github'
      },
      linkedin: {
        account: 'Github',
        link: 'https://www.linkedin.com/company/github'
      }
    },

    categories: {
      docs: { color: '#e34c26', desc: 'Showing the usage of vuepress-theme-yuchanns.展示本主题的使用方法' }
    }
  }
}
```
</details>

## 配置详解
### 语言支持
本主题目前支持中文和英文，只需在`locales`中配置`lang`为`zh-CN`或`en-US`即可切换到对应语言。

如果你有其他的语言需求，欢迎到issue中提出，我会将其加入支持。

### 语言局部定制
如果你对局部语言有特殊需要(例如本主题，整体语言为`en-US`，但是局部进行了中文化处理)，可以分别对一些部分的名词进行自定义：

只需在`themeConfig.lang`中引入主题的语言包，并覆盖相应字段即可。

```js
themeConfig: {
  lang: Object.assign(require('vuepress-theme-yuchanns/lib/langs/en-US'), {
      navigation: '首页',
      categories: '分类',
      tags: '标签'
    })
}
```

### 分页数设置
使用`themeConfig.pagination.lengthPerPage`进行设置。

### 社交服务导航
在`themeConfig.sns`中设置社交服务。目前支持：github、twitter、facebook、youtube、linkedin。欢迎在issue中提出扩展需求。

### 分类个性定制
分类不再仅仅是一段简单的名称，你可以让首页的分类变得五颜六色，可以在分类列表页展示极具分类特征的个性化logo，也可以用简练的文字说明介绍分类的内容，一切尽在`themeConfig.categories`配置项中。

本配置项为一个对象，其中属性名为分类名，属性值为分类配置。

在分类配置中，使用`color`设定首页分类颜色，使用`desc`对分类做出说明，通过`logo`给出个性化logo的图片地址——还有什么更好的想法？提出来一起分享吧！

### 文章置顶
在文章的`frontmatter`中添加<mark>pinned: 数字</mark>可以置顶文章。其中数字以升序方式排列置顶顺序。

### 评论
在`themeConfig.vssue`中进行配置，详细参考[Vssue文档](https://vssue.js.org/zh/guide/)。

## 鸣谢
* [Vuepress](https://github.com/vuejs/vuepress) 提供了如此方便的静态网页生成器
* [vuepress-theme-meteorlxy](https://github.com/meteorlxy/vuepress-theme-meteorlxy) 提供了源码参考
