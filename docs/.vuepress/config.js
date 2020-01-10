const path = require('path')

module.exports = {
  title: 'vuepress-theme-yuchanns',

  description: 'a Vuepress theme presented by yuchanns',

  theme: path.resolve(__dirname, '../../lib'),

  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['meta', { name: 'google-site-verification', content: 'h0GK-apopUhINJJe5Jp3XopZswk6EK_JQT_fVMrs6A0' }]
  ],

  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },

  markdown: {
    lineNumbers: false
  },

  chainWebpack: (config, isServer) => {
    if (isServer === false) {
      config.optimization.splitChunks({
        maxInitialRequests: 5,
        cacheGroups: {
          vue: {
            test: /[\\/]node_modules[\\/](vue|vue-router|vssue)[\\/]/,
            name: 'vendor.vue',
            chunks: 'all'
          },
          commons: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: 'vendor.commons',
            chunks: 'all'
          }
        }
      })
    }
  },

  themeConfig: {
    lang: {
      home: '首页',
      navigation: '导航',
      categories: '分类',
      tags: '标签',
      archive: '归档',
      prev: '上一篇',
      next: '下一篇',
      more: '更多',
      createdAt: '创建于'
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
      Vue: { color: '#2c3e50', logo: '/images/vue.png', desc: 'Vue.js is a JavaScript framework for building interactive web applications.' },
      Document: { color: '#e34c26', desc: 'Document is a guidebook for users.' }
    }
  }
}
