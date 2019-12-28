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
  background-color #fff
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

h3
h4
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

button
  font-family inherit
  text-transform none
  overflow visible
  font inherit
  margin 0

ol
ul
  padding-left 0
  margin-top 0
  margin-bottom 0

.width
  &-full
    width 100%

.clearfix
  &:after
  &:before
    display table
    content ""
    clear both

.f5
  font-size 14px

.f6
  font-size 12px

.col
  &-sm
    &-3
      @media (min-width 544px)
        width 25%!important
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
    &-12
      width 100%
  &-6
    width 50%
  &-9
    width 75%
  &-12
    width 100%

.link-gray
  color #586069
  &:hover
    color $accentColor

.lh-condensed
  line-height 1.25
  &-ultra
    line-height 1

.list-style-none
  list-style none
</style>
