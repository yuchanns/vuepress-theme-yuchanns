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
    lang: 'zh-CN',

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
      owner: 'yuchanns',
      repo: 'vuepress-theme-yuchanns',
      clientId: '4353f46e18ac2be258ba',
      clientSecret: 'f00fc887083baac054d4483d348cf0215b206e27'
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
      docs: { color: '#e34c26', desc: 'Showing the usage of vuepress-theme-yuchanns.展示本主题的使用方法', logo: '/images/categories/document.jpg' },
      dev: { logo: '/images/categories/development.png', desc: 'Display of development plan.记录和展示开发计划' }
    }
  }
}
