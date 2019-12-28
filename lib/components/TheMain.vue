<template>
  <div>
    <TransitionFadeSlide>
      <component
        :is="layout"
        :key="$page.path"></component>
    </TransitionFadeSlide>
  </div>
</template>

<script>
import TransitionFadeSlide from '@theme/components/TransitionFadeSlide.vue'

export default {
  name: 'TheMain',

  components: {
    TransitionFadeSlide
  },

  computed: {
    layout () {
      return this.$page.frontmatter.layout || 'NotFound'
    }
  }
}
</script>
