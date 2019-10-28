const path = require('path')

module.exports = {
  title: 'vuepress-theme-yuchanns',

  description: 'Vuepress theme of yuchanns\'s blog',

  locales: {
    '/': {
      lang: 'en-US'
    }
  },

  theme: path.resolve(__dirname, '../../lib'),

  themeConfig: {
    lang: 'en-US',
    favicon: '/favicon.png',
    personalInfo: {
      name: 'yuchanns',
      class: 'Web Developer',
      avatar: 'https://avatars3.githubusercontent.com/u/25029451'
    }
  }
}
