// const path = require('path')

module.exports = (options, ctx) => {
  Object.assign({
    lang: 'en-US',
    favicon: '/favicon.png'
  }, options)

  options.lang = require('./langs/en-US')

  return {
    name: 'vuepress-theme-yuchanns',

    plugins: [
      ['@vuepress/plugin-back-to-top'],
      ['vuepress-plugin-container', { type: 'tip' }],
      ['vuepress-plugin-container', { type: 'warning' }],
      ['vuepress-plugin-container', { type: 'danger' }],
      ['vuepress-plugin-nprogress']
      // ['vuepress-plugin-redirect'],
      // ['vuepress-plugin-smooth-scroll', options.plugins['smooth-scroll'] || {}],
      // [
      //   'vuepress-plugin-zooming',
      //   Object.assign({
      //     selector: '.content img',
      //   }, options.plugins.zooming || {}),
      // ],
    ],

    // enhanceAppFiles: [
    //   path.resolve(__dirname, 'enhanceApp.js'),
    // ],

    ready () {
      // add home page
      ctx.addPage({
        permalink: '/',
        frontmatter: {
          title: options.lang.home,
          layout: 'Home'
        }
      })
    }
  }
}
