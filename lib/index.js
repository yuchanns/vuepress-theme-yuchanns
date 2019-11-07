module.exports = (opts, ctx) => {
  Object.assign(opts, Object.assign({
    lang: {},
    pagination: {
      lengthPerPage: 10
    }
  }, opts))

  const { lang, pagination } = opts
  return {
    name: 'vuepress-theme-yuchanns',

    plugins: [
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
