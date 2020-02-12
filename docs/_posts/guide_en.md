---
title: Usage guide for theme
date: 2020-01-01 12:00
category: docs
tags:
  - en
  - WIP
pinned: 2
---
A usage guide for **vuepress-theme-yuchanns**

[![Netlify Status](https://api.netlify.com/api/v1/badges/adac5706-bf93-419a-a239-782fa94d4358/deploy-status)](https://app.netlify.com/sites/vuepress-theme-yuchanns/deploys)
[![CircleCI](https://circleci.com/gh/yuchanns/vuepress-theme-yuchanns/tree/master.svg?style=svg&circle-token=7d312c35e3cb469cdfef653f334741bb26052888)](https://circleci.com/gh/yuchanns/vuepress-theme-yuchanns/tree/master)
[![Actions Status](https://github.com/yuchanns/vuepress-theme-yuchanns/workflows/Node%20CI/badge.svg)](https://github.com/yuchanns/vuepress-theme-yuchanns/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/yuchanns/vuepress-theme-yuchanns/blob/master/LICENSE)

:::tip
vuepress-theme-yuchanns is a github style theme with little age, which is licensed under the [MIT Licence](https://github.com/yuchanns/vuepress-theme-yuchanns/blob/master/LICENSE).

Feel free to open an request [issue](https://github.com/yuchanns/vuepress-theme-yuchanns/issues/new) or create a [pr](https://github.com/yuchanns/vuepress-theme-yuchanns/compare) to contribute to this theme.
:::
<!-- more -->

[[toc]]

## Blog Using This Theme
* [yuchanns'Atelier](https://yuchanns.org)

## Quick Start
### Newbee
First time with `Vuepress`? Learn how to use it referring by [Official Docs](https://vuepress.vuejs.org)

Assume with a project structure below:
```sh
.
├─ docs            # blogs dir
│  ├─ _posts       # pages dir
│  └─ .vuepress    # theme config dir
│     └─ config.js # theme config file
└─ package.json
```
### Fetch Theme
Installing this theme with one `Vuepress` project:
```sh
yarn add vuepress-theme-yuchanns # or npm install vuepress-theme-yuchanns
```
Then change **theme** value as `yuchanns` in `.vuepress/config.js`.
```js
// .vuepress/config.js

module.exports = {
  theme: 'yuchanns'
}
```
Next add scripts into `package.json`:
```js
{
  "scripts": {
    "dev": "vuepress dev docs --no-cache --temp .temp",
    "build": "vuepress build docs --dest docs-dist"
  }
}
```
So you can run `yarn dev`(or `npm run dev`) and visit localhost:8080 to view theme.

Otherwise deploy by running `yarn build`(or `npm run build`) to produce static files.

## Configuration Overview
### Basic Features
This theme implemented only basic features for now. Still you can find something special.

#### Basics
* Home
* Post
* Categories
* Tags
* Archive
* Internationalization
* Comments

#### Special
* Archive Heatmap (contribution of github style)
* Custom icons color in home page
* Logo and description in categories page
* Sns
* Pinned Posts

### General Configration
<details>
<summary>Click to expand</summary>

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

## Explicition
### Languages Support
Supporting for English and Chinese from now on, with simply changes of the `lang` between `zh-CN` and `en-US`.

Require other languages in an issue, so theme will add to support it.

### Parts of Language Customizing

If you need to customize parts of language, just do it:

Import theme's language package in `themeConfig.lang` and then cover values to corresponding properties.

```js
themeConfig: {
  lang: Object.assign(require('vuepress-theme-yuchanns/lib/langs/en-US'), {
      navigation: '首页',
      categories: '分类',
      tags: '标签'
    })
}
```

### Lengthe Per Page
Configuring by `themeConfig.pagination.lengthPerPage`.

### Social Network Services
Placing sns with `themeConfig.sns`. Now supporting github, twitter, facebook, youtube, linedin. Expanding issues are welcome.

### Custom Categories
The categories is more than just one short name, can be further colorful and displaying individual logo with briefly description, all be in `themeConfig.categories`.

It is an object with properties named by categories, which values containing configration.

Coloring in `color`, describing in `desc` and providing logo in `logo`. Now sharing your better ideas!

### Pinned Posts
You can pinned posts by adding <mark>pinned: number</mark> in the `frontmatter` of posts. Numbers are used for sorting pinned posts ascending order.

### Comments
Configuring with `themeConfig.vssue`. More info visit [Vssue](https://vssue.js.org/guide/).

## Thanks
* [Vuepress](https://github.com/vuejs/vuepress)
* [vuepress-theme-meteorlxy](https://github.com/meteorlxy/vuepress-theme-meteorlxy)

