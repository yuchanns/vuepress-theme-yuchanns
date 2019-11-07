module.exports = (opts, ctx) => {
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
              pagination: {
                lengthPerPage: 10
              }
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
