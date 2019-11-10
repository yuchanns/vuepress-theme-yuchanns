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
      }
    },
    categories: {
      golang: '#00add8',
      vuejs: '#3eaf7c',
      html: '#e34c26'
    },
    footer: {
      left: [
        { title: 'Twitter', link: 'https://www.twitter.com/airamusume' }
      ],
      right: [
        { title: 'Blog', link: 'https://www.yuchanns.xyz' }
      ]
    }
  }
}
