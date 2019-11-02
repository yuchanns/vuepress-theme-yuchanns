const path = require('path')

module.exports = {
  title: 'vuepress-theme-yuchanns',

  description: 'Vuepress theme of yuchanns\'s blog',

  locales: {
    '/': {
      lang: 'en-US'
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  theme: path.resolve(__dirname, '../../lib'),

  themeConfig: {
    lang: 'en-US',
    logo: '/logo.png',
    personalInfo: {
      nickname: 'yuchanns',
      jobTitle: 'Web Developer',
      avatar: 'https://avatars3.githubusercontent.com/u/25029451',
      joined: '2017-10-01',
      sns: {
        github: {
          link: 'https://www.github.com/yuchanns'
        },
        twitter: {
          link: 'https://www.twitter.com/airamusume'
        },
        site: {
          link: 'https://www.yuchanns.xyz'
        }
      }
    }
  }
}
