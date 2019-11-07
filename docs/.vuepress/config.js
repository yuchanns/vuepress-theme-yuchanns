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
      lengthPerPage: 2
    }
  }
}
