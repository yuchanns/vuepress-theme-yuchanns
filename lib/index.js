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
                perPagePosts: 10
              }
            }
          ]
        }
      ]
    ]
  }
}
