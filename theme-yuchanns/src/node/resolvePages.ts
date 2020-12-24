import type { App } from '@vuepress/core'
import { createPage } from '@vuepress/core'

export const resolvePages = async (app: App): Promise<void> => {
  app.pages.push(
    await createPage(app, {
      permalink: '/',
      frontmatter: {
        layout: 'Home',
      },
    })
  )
}
