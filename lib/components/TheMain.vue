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
import Vue from 'vue'

export default {
  name: 'TheMain',

  components: {
    TransitionFadeSlide
  },

  computed: {
    layout () {
      const layout = this.$page.frontmatter.layout

      if (layout && (this.$vuepress.getLayoutAsyncComponent(layout) || this.$vuepress.getVueComponent(layout))) {
        return Vue.component(layout)
      }

      return 'NotFound'
    }
  }
}
</script>
