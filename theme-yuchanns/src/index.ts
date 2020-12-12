import type { Theme } from '@vuepress/core'
import { path } from '@vuepress/utils'
import type { ThemeOptions } from './types'

export * from './types'

export const theme: Theme<ThemeOptions> = (options, app) => {
  return {
    name: 'vuepress-theme-yuchanns',

    layouts: path.resolve(__dirname, './layouts'),
  }
}

export default theme
