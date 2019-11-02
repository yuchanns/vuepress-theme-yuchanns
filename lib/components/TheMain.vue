<template>
  <main class="container main">
    <transition :name="transitionName">
      <component :is="layout"></component>
    </transition>
  </main>
</template>

<script>
export default {
  name: 'TheMain',

  data () {
    return {
      transitionName: 'slideleft'
    }
  },

  computed: {
    layout () {
      return this.$page.frontmatter.layout || 'NotFound'
    }
  },

  watch: {
    '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'slideright' : 'slideleft'
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

@media (max-width: $mobile)
  [class^="slideright"], [class^="slideleft"]
    will-change: transform, opacity

  .slideright-enter-active, .slideright-leave-active {
    transition: transform .250s, opacity .1s;
  }
  .slideright-enter {
    opacity: 0;
    position: absolute !important;
    transform: translate(-100%) !important;
  }
  .slideright-leave-to {
    opacity: 0;
    transform: translate(100%) !important;
    position: absolute !important;
  }

  .slideleft-enter-active, .slideleft-leave-active {
    transition: transform .250s, opacity .1s;
  }
  .slideleft-enter {
    opacity: 0;
    position: absolute !important;
    transform: translate(100%) !important;
  }
  .slideleft-leave-to {
    opacity: 0;
    transform: translate(-100%) !important;
    position: absolute !important;
  }
</style>