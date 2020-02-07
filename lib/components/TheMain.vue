<template>
  <div>
    <TransitionFadeSlide :direction="direction">
      <DefaultGlobalLayout :key="$page.path" />
    </TransitionFadeSlide>
  </div>
</template>

<script>
import TransitionFadeSlide from '@theme/components/TransitionFadeSlide.vue'
import GlobalLayout from '@app/components/GlobalLayout.vue'

export default {
  name: 'TheMain',

  components: {
    DefaultGlobalLayout: GlobalLayout,
    TransitionFadeSlide
  },

  computed: {
    direction () {
      if (this.$page.frontmatter.layout === 'Post') {
        return 'x'
      }
      return 'y'
    }
  }
}
</script>
