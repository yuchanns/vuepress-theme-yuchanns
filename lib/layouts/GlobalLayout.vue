<template>
  <div id="vuepress-theme-yuchanns">
    <TheHeader />

    <TheMain />

    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '@theme/components/TheHeader'
import TheMain from '@theme/components/TheMain'
import TheFooter from '@theme/components/TheFooter'

export default {
  name: 'vuepress-theme-yuchanns',

  components: {
    TheHeader,
    TheFooter,
    TheMain
  }
}
</script>

<style lang="stylus">
*
  box-sizing border-box

body
  font-size 14px
  line-height 1.5
  background-color $white
  color #24292e
  margin 0
  word-wrap break-word

a
  text-decoration none
  color $accentColor
  &:hover
    text-decoration underline
  &:active
  &:hover
    outline-width 0

p
  margin-top 0
  margin-bottom 10px

.h0
  &-mktg
    font-size 32px
    @media (min-width 768px)
      font-size 40px
.h0
  &-mktg
    font-size 26px
    @media (min-width 768px)
      font-size 32px
.h2
  &-mktg
    font-size 22px
    font-weight 500
    font-family Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol
    @media (min-width 768px)
      font-size 24px

.h3
  &mktg
    font-size 18px
    @media (min-width 768px)
      font-size 20px
.h4
.h6
  font-weight 600

h3
  font-size 20px

h1
h2
h3
h4
h5
h6
  margin-top 0
  margin-bottom 0

img
  border-style none

button
  font-family inherit
  text-transform none
  overflow visible
  font inherit
  margin 0

strong
  font-weight 600

blockquote
  margin 0

code
tt
pre
  font-family SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace
  font-size 12px

table
  border-spacing 0
  border-collapse collapse

thead
  display table-header-group
  vertical-align middle
  border-color inherit

mark
  background-color #fcf8e3
  padding .2em

.width
  &-full
    width 100%

.height
  &-full
    height 100%

.clearfix
  &:after
  &:before
    display table
    content ""
    clear both

.f
  &3
    font-size 18px
    @media (min-width 768px)
      font-size 20px
  &4
    @media (min-width 768px)
      font-size 16px
  &5
    font-size 14px
  &6
    font-size 12px

.col
  &-sm
    &-3
      @media (min-width 544px)
        width 25%!important
    &-10
      @media (min-width 544px)
        width 83.33333%
  &-md
    &-8
      @media (min-width 768px)
        width 66.66667%
  &-lg
    &-2
      @media (min-width 1012px)
        width 16.66667%!important
    &-4
      @media (min-width 1012px)
        width 33.33333%!important
    &-5
      @media (min-width 1012px)
        width 41.66667%
    &-9
      @media (min-width 1012px)
        width 75%
    &-10
      @media (min-width 1012px)
        width 83.33333%!important
    &-12
      width 100%
  &-6
    width 50%
  &-8
    width 66.66667%
  &-9
    width 75%
  &-12
    width 100%

.link-gray
  color #586069
  &:hover
    color $accentColor
  &-dark
    color #24292e
    &:hover
      color $accentColor

.lh-condensed
  line-height 1.25
  &-ultra
    line-height 1

.list-style-none
  list-style none

.p-responsive
  padding-right: 16px
  padding-left: 16px
  @media (min-width 1012px)
    padding-right 16px!important
    padding-left 16px!important
  @media (min-width 544px)
    padding-right 40px
    padding-left 40px

.overflow-hidden
  overflow hidden

.bg
  &-white
    background-color $white
  &-gray-light
    background-color $headBgColor
  &-blue-light
    background-color #f1f8ff

.no-underline
  text-decoration none!important

.rounded
  &-1
    border-radius 3px

.tags
  display inline-block
  padding .3em .9em
  margin 0 .5em .5em 0
  white-space nowrap
  background-color #f1f8ff
  border-radius 3px
  &-link:hover
    text-decoration none
    background-color #def
  &-container
    height 30px
    overflow hidden

.muted-link
  color #586069
  &:hover
    color $accentColor
    text-decoration none
</style>
