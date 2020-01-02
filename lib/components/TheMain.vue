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
import Tags from '@theme/layouts/Tags.vue'
import Category from '@theme/layouts/Category.vue'
import Posts from '@theme/layouts/Posts.vue'
import Vue from 'vue'

export default {
  name: 'TheMain',

  components: {
    TransitionFadeSlide,
    Tags,
    Category,
    Posts
  },

  computed: {
    layout () {
      if (this.$page.regularPath) {
        if (this.$page.regularPath.startsWith('/tags')) {
          return 'Tags'
        } else if (this.$page.regularPath.startsWith('/categories')) {
          return 'Category'
        } else if (this.$page.regularPath === '/posts/') {
          return 'Posts'
        }
      }

      const layout = this.$page.frontmatter.layout

      if (layout && (this.$vuepress.getLayoutAsyncComponent(layout) || this.$vuepress.getVueComponent(layout))) {
        return Vue.component(layout)
      }

      return 'NotFound'
    }
  }
}
</script>
