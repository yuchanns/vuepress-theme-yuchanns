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

    nickname: 'yuchanns',

    pagination: {
      lengthPerPage: 1
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
      Vue: '#2c3e50',
      Document: '#e34c26'
    }
  }
}
