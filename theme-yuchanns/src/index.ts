import type { Theme } from '@vuepress/core'
import { path } from '@vuepress/utils'
import type { ThemeOptions } from './types'
import { resolvePages } from './node/resolvePages'

export * from './types'
export * from './node'

export const theme: Theme<ThemeOptions> = (options, app) => {
  return {
    name: 'vuepress-theme-yuchanns',

    layouts: path.resolve(__dirname, './layouts'),

    async onInitialized() {
      await resolvePages(app)
    },
  }
}

export default theme
