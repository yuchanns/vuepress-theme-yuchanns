<template>
  <main class="container main">
    <component :is="layout"></component>
  </main>
</template>

<script>
export default {
  name: 'TheMain',

  computed: {
    layout () {
      return this.$page.frontmatter.layout || 'NotFound'
    }
  }
}
</script>

<style lang="stylus" scoped>
.main
  width 100%
  max-width 1360px
  padding-left 24px
  padding-right 24px

  @media (min-width 1500px)
    max-width 1500px
</style>