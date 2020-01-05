<template>
  <main>
    <tags v-if="!isItem" />
    <tag-item v-else />
  </main>
</template>

<script>
import Tags from '@theme/components/Tags'
import TagItem from '@theme/components/TagItem'

export default {
  name: 'Tag',

  components: {
    Tags,
    TagItem
  },

  computed: {
    isItem () {
      if (this.$page.regularPath === '/tags/') {
        return false
      }

      return true
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
