module.exports = {
  lang: 'en-US',
  home: 'home',
  navigation: 'navigation',
  categories: 'categories',
  tags: 'tags',
  archive: 'archive',
  prev: 'prev',
  next: 'next',
  more: 'more',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  categoryTip: siteTitle => {
    return `Browse categories on ${siteTitle}`
  },
  categorySubTitle: 'All featured categories',
  categoryItemTip: pageNum => {
    return `Here are ${pageNum} posts matching this category`
  },
  tagTip: siteTitle => {
    return `Browse tags on ${siteTitle}`
  },
  tagSubTitle: 'All featured tags',
  tagItemTip: pageNum => {
    return `Here are ${pageNum} posts matching this tag`
  },
  archiveTip: (pageNum, year) => {
    return `${pageNum} posts in ${year}`
  },
  archiveLastYear: 'the last year',
  postTip: 'Post activity',
  pinned: 'Pinned'
}
