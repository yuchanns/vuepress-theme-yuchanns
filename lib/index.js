const markdownItAnchor = require('./plugins/markdown/anchor')
const markdownItCheckBox = require('markdown-it-checkbox')
const readingTime = require('./utils/reading-time')

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
      }],
      ['@vssue/vuepress-plugin-vssue', {
        platform: 'github',

        owner: 'yuchanns',
        repo: 'vuepress-theme-yuchanns',
        clientId: '4353f46e18ac2be258ba',
        clientSecret: 'f00fc887083baac054d4483d348cf0215b206e27'
      }]
    ],

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
