<template>
  <div>
    <component
      :is="layout"
      :key="$page.path"></component>
  </div>
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
