import type { UserConfig } from '@vuepress/cli'
import type { ThemeOptions } from 'vuepress-theme-yuchanns'
const path = require('path')

const config: UserConfig<ThemeOptions> = {
  base: '/',

  evergreen: process.env.NODE_ENV !== 'production',

  theme: path.resolve(__dirname, '../../theme-yuchanns/lib'),

  // site-level locales config
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Theme-yuchanns',
      description: 'Vue-powered Static Site Generator',
    },
  },

  themeConfig: {},
}

export = config
