// const { logger } = require('@vuepress/shared-utils')

module.exports = (opts, ctx) => {
  Object.assign(opts, Object.assign({
    lang: {},
    pagination: {
      lengthPerPage: 10,
    }
  }, opts))

  // logger.info(opts)

  const { lang, pagination } = opts

  // set about pagination
  pagination.layout = 'Home'
  pagination.getPaginationPageTitle = (index, id) => {
    return `Page ${index + 2} | ${id}`
  }

  return {
    name: 'vuepress-theme-yuchanns',

    plugins: [
      'vuepress-plugin-nprogress',
      '@vuepress/back-to-top',
      [
        'reading-progress',
        {
          readingDir: {
            _posts: 'bottom'
          }
        }
      ],
      [
        '@vuepress/blog',
        {
          directories: [
            {
              id: lang.home,
              dirname: '_posts',
              path: '/',
              itemPermalink: '/posts/:year/:month/:day/:slug',
              pagination: pagination,
              layout: 'Home',
              itemLayout: 'Post'
            }
          ],
          frontmatters: [
            {
              id: 'tags',
              keys: ['tags'],
              path: '/tags/',
              layout: 'Tags'
            },
            {
              id: 'categories',
              keys: ['category'],
              path: '/categories/',
              layout: 'Categories'
            }
          ]
        }
      ]
    ]
  }
}
