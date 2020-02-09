const markdownItAnchor = require('./plugins/markdown/anchor')
const markdownItCheckBox = require('markdown-it-checkbox')
const readingTime = require('./utils/reading-time')

module.exports = (opts, ctx) => {
  Object.assign(opts, Object.assign({
    lang: 'en-US',
    pagination: {
      lengthPerPage: 10
    },
    sitemap: {},
    searchPlaceholder: 'Search or jump to...'
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

  Object.assign(pagination, {
    layout: 'Home',
    getPaginationPageTitle: pageNumber => {
      return `${lang.home}`
    },
    sorter: (prev, next) => {
      const { compareAsc } = require('date-fns')
      return compareAsc(next.frontmatter.date, prev.frontmatter.date)
    }
  })

  const categoryPagination = Object.assign(Object.assign({}, pagination), {
    layout: 'Category',
    getPaginationPageTitle: (pageNumber, name) => {
      return `${name} ${lang.categories}`
    }
  })

  const tagPagination = Object.assign(Object.assign({}, pagination), {
    layout: 'Tag',
    getPaginationPageTitle: (pageNumber, name) => {
      return `${name} ${lang.tags}`
    }
  })

  const plugins = [
    'vuepress-plugin-nprogress',
    '@vuepress/back-to-top',
    ['@vuepress/last-updated'],
    ['vuepress-plugin-container', { type: 'tip' }],
    ['vuepress-plugin-container', { type: 'warning' }],
    ['vuepress-plugin-container', { type: 'danger' }],
    ['vuepress-plugin-smooth-scroll'],
    ['vuepress-plugin-table-of-contents'],
    [
      '@vuepress/blog',
      {
        sitemap: opts.sitemap,
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
            pagination: tagPagination,
            title: lang.tags
          },
          {
            id: 'categories',
            keys: ['category'],
            path: '/categories/',
            layout: 'Category',
            scopeLayout: 'Category',
            pagination: categoryPagination,
            title: lang.categories
          }
        ]
      }
    ],
    ['@vuepress/search', {
      searchMaxSuggestions: 10
    }]
  ]

  if (opts.vssue) {
    plugins.push(['@vssue/vuepress-plugin-vssue', opts.vssue])
  }

  return {
    name: 'vuepress-theme-yuchanns',

    plugins: plugins,

    extendMarkdown: md => {
      md.use(markdownItAnchor)
      md.use(markdownItCheckBox)
    },

    extendPageData: $page => {
      const {
        regularPath,
        path,
        frontmatter,
        _strippedContent
      } = $page

      if (!_strippedContent) {
        return $page
      }

      if (frontmatter && frontmatter.readingTime) {
        $page.readingTime = frontmatter.readingTime
        return $page
      }

      const excludePage = opts.excludes && opts.excludes.some(p => {
        const testRegex = new RegExp(p)
        return testRegex.test(path) || testRegex.test(regularPath)
      })

      if (excludePage) {
        return $page
      }

      // filter out html annotations, spaces, newlines first
      // and then calculate readingtime
      $page.readingTime = readingTime(_strippedContent.replace(/(<!--.*?-->)|[\r\n]| +/g, ''))

      return $page
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
