module.exports = {
  lang: 'zh-CN',
  home: '首页',
  navigation: '导航',
  categories: '分类',
  tags: '标签',
  archive: '归档',
  prev: '上一篇',
  next: '下一篇',
  more: '更多',
  createdAt: '创建于',
  updatedAt: '更新于',
  categoryTip: siteTitle => {
    return `浏览${siteTitle}的分类`
  },
  categorySubTitle: '所有分类',
  categoryItemTip: pageNum => {
    return `该分类下共有${pageNum}篇文章`
  },
  tagTip: siteTitle => {
    return `浏览${siteTitle}的标签`
  },
  tagSubTitle: '所有标签',
  tagItemTip: pageNum => {
    return `该标签下共有${pageNum}篇文章`
  },
  archiveTip: (pageNum, year) => {
    return `在${year}共有${pageNum}篇文章`
  },
  archiveLastYear: '去年',
  postTip: '文章动态',
  pinned: '置顶'
}
