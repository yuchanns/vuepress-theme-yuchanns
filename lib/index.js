const markdownItAnchor = require('./plugins/markdown/anchor')

module.exports = (opts, ctx) => {
  Object.assign(opts, Object.assign({
    lang: {
      home: 'home',
      navigation: 'navigation',
      categories: 'categories',
      tags: 'tags',
      archive: 'archive',
      prev: 'prev',
      next: 'next',
      more: 'more',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    pagination: {
      lengthPerPage: 10
    }
  }, opts))

  const { lang, pagination } = opts

  pagination.layout = 'Home'
  pagination.getPaginationPageTitle = pageNumber => {
    return `${lang.home}`
  }

  pagination.sorter = (prev, next) => {
    const { compareAsc, parseISO } = require('date-fns')
    return compareAsc(parseISO(next.frontmatter.date), parseISO(prev.frontmatter.date))
  }

  return {
    name: 'vuepress-theme-yuchanns',

    plugins: [
      'vuepress-plugin-nprogress',
      '@vuepress/back-to-top',
      ['@vuepress/last-updated', {
        transformer: (timestamp, lang) => {
          return timestamp
        }
      }],
      'vuepress-plugin-reading-time',
      ['vuepress-plugin-container', { type: 'tip' }],
      ['vuepress-plugin-container', { type: 'warning' }],
      ['vuepress-plugin-container', { type: 'danger' }],
      ['vuepress-plugin-smooth-scroll'],
      ['vuepress-plugin-table-of-contents'],
      [
        '@vuepress/blog',
        {
          directories: [
            {
              id: 'home',
              dirname: '_posts',
              path: '/',
              itemPermalink: '/posts/:year/:month/:day/:slug',
              pagination: pagination,
              layout: 'Home',
              itemLayout: 'Post',
              title: lang.home
            }
          ],
          frontmatters: [
            {
              id: 'tags',
              keys: ['tags'],
              path: '/tags/',
              layout: 'Tag',
              scopeLayout: 'Tag',
              title: lang.tags
            },
            {
              id: 'categories',
              keys: ['category'],
              path: '/categories/',
              layout: 'Category',
              scopeLayout: 'Category',
              title: lang.categories
            }
          ]
        }
      ]
    ],

    extendMarkdown: md => md.use(markdownItAnchor),

    async ready () {
      ctx.addPage({
        permalink: '/archive/',
        frontmatter: {
          title: lang.archive,
          layout: 'Archive'
        }
      })
    }
  }
}
