const path = require('path')

module.exports = {
  title: 'vuepress-theme-yuchanns',

  description: 'Vuepress theme of yuchanns\'s blog',

  theme: path.resolve(__dirname, '../../lib'),

  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    lang: {
      home: 'Home'
    },
    pagination: {
      lengthPerPage: 10
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
      golang: '#00add8',
      vuejs: '#3eaf7c',
      html: '#e34c26'
    }
  }
}
