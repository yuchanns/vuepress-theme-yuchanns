const markdownItAnchor = require('./plugins/markdown/anchor')
const markdownItCheckBox = require('markdown-it-checkbox')

module.exports = (opts, ctx) => {
  Object.assign(opts, Object.assign({
    lang: 'en-US',
    pagination: {
      lengthPerPage: 10
    }
  }, opts))

  if (typeof opts.lang === 'string') {
    try {
      require.resolve(`./langs/${opts.lang}`)
    } catch (e) {
      opts.lang = 'en-US'
    }
    opts.lang = require(`./langs/${opts.lang}`)
  }

  const { lang, pagination } = opts

  pagination.layout = 'Home'
  pagination.getPaginationPageTitle = pageNumber => {
    return `${lang.home}`
  }

  pagination.sorter = (prev, next) => {
    const { compareAsc, parseISO } = require('date-fns')
    return compareAsc(parseISO(next.frontmatter.date), parseISO(prev.frontmatter.date))
  }

  if (!('searchPlaceholder' in opts)) {
    opts.searchPlaceholder = 'Search or jump to...'
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
      ],
      ['@vuepress/search', {
        searchMaxSuggestions: 10
      }]
    ],

    extendMarkdown: md => {
      md.use(markdownItAnchor)
      md.use(markdownItCheckBox)
    },

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
