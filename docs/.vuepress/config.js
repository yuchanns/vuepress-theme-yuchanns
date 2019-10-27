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
    favicon: '/favicon.png'
  }
}
