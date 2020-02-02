function sortPosts (posts, index, length, withPinned) {
  withPinned = withPinned || false
  const { compareDesc } = require('date-fns')
  let finalPages = posts.filter(page => {
    return page.id === 'home'
  }).sort((a, b) => {
    return compareDesc(a.frontmatter.date, b.frontmatter.date)
  })

  const current = index * length

  if (withPinned) {
    const pagesPinned = finalPages.filter(page => {
      return 'pinned' in page.frontmatter
    }).sort((a, b) => {
      if (a.frontmatter.pinned < b.frontmatter.pinned) {
        return -1
      }
      return 1
    })

    const pagesUnpinned = finalPages.filter(page => {
      return !('pinned' in page.frontmatter)
    })

    finalPages = pagesPinned.concat(pagesUnpinned)
  }

  return finalPages.slice(
    current,
    current + length
  )
}

export { sortPosts }
