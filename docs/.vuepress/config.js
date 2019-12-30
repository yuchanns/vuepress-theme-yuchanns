const path = require('path')

module.exports = {
  title: 'vuepress-theme-yuchanns',

  description: 'Vuepress theme of yuchanns\'s blog',

  theme: path.resolve(__dirname, '../../lib'),

  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }]
  ],

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
      home: 'Home'
    },

    // logo: '/favicon-invert.png',

    nickname: 'yuchanns',

    pagination: {
      lengthPerPage: 5
    },

    sns: {
      github: {
        account: 'yuchanns',
        link: 'https://github.com/yuchanns'
      },
      twitter: {
        account: 'Github',
        link: 'https://twitter.com/github'
      },
      facebook: {
        account: 'GitHub',
        link: 'https://www.facebook.com/GitHub'
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
      golang: '#00ADD8',
      python: '#3572A5',
      php: '#4F5D95',
      lisp: '#c065db',
      学习笔记: '#e34c26'
    }
  }
}
