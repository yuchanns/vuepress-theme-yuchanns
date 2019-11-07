module.exports = (opts, ctx) => {
  Object.assign(opts, Object.assign({
    pagination: {
      lengthPerPage: 10
    }
  }, opts))

  const { pagination } = opts
  return {
    name: 'vuepress-theme-yuchanns',

    plugins: [
      [
        '@vuepress/blog',
        {
          directories: [
            {
              id: 'post',
              dirname: '_posts',
              path: '/',
              itemPermalink: '/posts/:year/:month/:day/:slug',
              pagination: pagination
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
