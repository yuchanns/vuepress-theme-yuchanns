<template>
  <div>
    <FixedHead selector='#tags-head' title="Tags" />
    <div class="bg-gray-light border-bottom" id="tags-head">
        <div class="container-lg p-responsive text-center py-6">
          <h1 class="h0-mktg">Tags</h1>
          <p class="f4 text-gray col-md-6 mx-auto">{{ tagTip }}.</p>
        </div>
      </div>
      <div class="d-lg-flex container-lg p-responsive">
        <div class="position-relative mb-6" style="width: 100%">
          <h2 class="h2-mktg">{{ $themeConfig.lang.tagSubTitle }}</h2>
          <ul class="list-style-none">
            <li class="py-4 border-bottom"
              :key="key"
              v-for="(tag, key) in $tags._metaMap">
              <router-link
                :to="'/tags/' + key"
                class="d-flex no-underline">
                <div class="bg-blue-light f4 text-gray-light text-bold rounded-1 mr-3 flex-shrink-0 text-center" style="width: 64px; height: 64px; line-height: 64px">#</div>
                <div class="d-sm-flex flex-auto">
                  <div class="flex-auto">
                    <p class="f3 lh-condensed mb-1 mt-1 link-gray-dark">{{ key }}</p>
                  </div>
                  <div class="d-inline-block">
                    <button class="d-flex flex-items-center btn btn-sm">
                      <tags-icon
                        type="eye"
                        class="mr-1"/>
                      <span class="text-capitalize">watch</span>
                    </button>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script>
import TagsIcon from '@theme/components/icons/Tags'
import FixedHead from '@theme/components/FixedHead'

export default {
  name: 'Tags',

  components: {
    TagsIcon,
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
