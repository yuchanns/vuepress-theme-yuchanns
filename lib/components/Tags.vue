<template>
  <div>
    <FixedHead selector='#tags-head' :title="$themeConfig.lang.tags" />
    <div class="bg-gray-light border-bottom" id="tags-head">
        <div class="container-lg p-responsive text-center py-6">
          <h1 class="h0-mktg">{{ $themeConfig.lang.tags }}</h1>
          <p class="f4 text-gray col-md-6 mx-auto">{{ tagTip }}.</p>
        </div>
      </div>
      <div class="d-lg-flex container-lg p-responsive">
        <div class="position-relative mb-6" style="width: 100%">
          <h2 class="h2-mktg">{{ $themeConfig.lang.tagSubTitle }}</h2>
          <ul class="col-sm-6 col-md-4 col-lg-12 list-style-none flex-wrap">
            <li class="d-inline-block"
              :key="key"
              v-for="(tag, key) in $tags._metaMap">
              <div class="tags-container f6 mb-2">
                <router-link
                  :to="'/tags/' + key"
                  class="tags tags-link f6 my-1">
                  {{ key }}
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script>
import FixedHead from '@theme/components/FixedHead'

export default {
  name: 'Tags',

  components: {
    FixedHead
  },

  computed: {
    tagTip () {
      const lang = require(`@theme/langs/${this.$themeConfig.lang.lang}`)
      return lang.tagTip(this.$site.title)
    }
  },

  methods: {
    getDesc (label) {
      if (label in this.$themeConfig.categories && 'desc' in this.$themeConfig.categories[label]) {
        return this.$themeConfig.categories[label].desc
      }

      return ''
    },

    getLogo (label) {
      if (label in this.$themeConfig.categories && 'logo' in this.$themeConfig.categories[label]) {
        return this.$themeConfig.categories[label].logo
      }

      return false
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
</style>
