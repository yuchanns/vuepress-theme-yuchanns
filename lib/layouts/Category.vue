<template>
  <main>
    <Categories v-if="!isItem" />
    <CategoryItem v-else />
  </main>
</template>

<script>
import Categories from '@theme/components/Categories'
import CategoryItem from '@theme/components/CategoryItem'

export default {
  name: 'Category',

  components: {
    Categories,
    CategoryItem
  },

  computed: {
    isItem () {
      if (this.$page.regularPath === '/categories/') {
        return false
      }

      return true
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
