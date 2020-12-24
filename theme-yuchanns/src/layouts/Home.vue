<template>
  <div>hello world from {{ $frontmatter.layout }}</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'

export default defineComponent({
  name: 'Home',

  setup() {
    onMounted(() => {
      const frontmatter = usePageFrontmatter()
      console.log(frontmatter.value.layout)
    })
  },
})
</script>
