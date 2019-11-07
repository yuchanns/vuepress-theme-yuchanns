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

a
  text-decoration none
  color #0366d6

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
</style>