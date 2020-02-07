<template>
  <div class="container-lg p-responsive">
    <div class="d-flex flex-wrap py-5 mb-5">
      <div class="col-12 col-lg-4 mb-5">
        <h1>{{ $siteTitle }}</h1>
      </div>
      <div class="col-6 col-sm-3 col-lg-2 mb-6 mb-md-2 pr-3 pr-lg-0 pl-lg-4">
        <h2 class="h5 mb-3 text-mono text-gray-light text-normal text-capitalize">{{ $themeConfig.lang.navigation }}</h2>
        <ul class="list-style-none text-gray f5">
          <li class="lh-condensed mb-3">
            <router-link to="/" class="link-gray text-capitalize">{{ $themeConfig.lang.home }}</router-link>
          </li>
          <li class="lh-condensed mb-3">
            <router-link to="/archive" class="link-gray text-capitalize">{{ $themeConfig.lang.archive }}</router-link>
          </li>
        </ul>
      </div>
      <div class="col-6 col-sm-3 col-lg-2 mb-6 mb-md-2 pr-3 pr-lg-0 pl-lg-4">
        <h2 class="h5 mb-3 text-mono text-gray-light text-normal text-capitalize">{{ $themeConfig.lang.categories }}</h2>
        <ul class="list-style-none text-gray f5">
          <li class="lh-condensed mb-3"
            v-for="(category, key) in categories"
            :key="key">
            <router-link :to="category.path" class="link-gray">{{ category.title }}</router-link>
          </li>
        </ul>
      </div>
      <div class="col-6 col-sm-3 col-lg-2 mb-6 mb-md-2 pr-3 pr-lg-0 pl-lg-4">
        <h2 class="h5 mb-3 text-mono text-gray-light text-normal text-capitalize">{{ $themeConfig.lang.tags }}</h2>
        <ul class="list-style-none text-gray f5">
          <ul class="list-style-none text-gray f5">
          <li class="lh-condensed mb-3"
            v-for="(tag, key) in tags"
            :key="key">
            <router-link :to="tag.path" class="link-gray">{{ tag.title }}</router-link>
          </li>
        </ul>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Navitation',

  computed: {
    categories () {
      const categories = []
      const limitation = _.size(this.$categories._metaMap) > 4 ? 3 : 4

      for (const attr in this.$categories._metaMap) {
        const category = _.get(this.$categories._metaMap, [attr])
        categories.push({
          title: category.key,
          path: category.path
        })
        if (categories.length === limitation) {
          break
        }
      }

      categories.push({
        title: this.$themeConfig.lang.more,
        path: '/categories/'
      })

      return categories
    },
    tags () {
      const tags = []
      const limitation = _.size(this.$tags._metaMap) > 4 ? 3 : 4

      for (const attr in this.$tags._metaMap) {
        const tag = _.get(this.$tags._metaMap, [attr])
        tags.push({
          title: tag.key,
          path: tag.path
        })
        if (tags.length === limitation) {
          break
        }
      }

      tags.push({
        title: this.$themeConfig.lang.more,
        path: '/tags/'
      })

      return tags
    }
  }
}
</script>

<style lang="stylus" scoped>
ol
ul
  padding-left 0
  margin-top 0
  margin-bottom 0

.h5
  font-size 14px
</style>
