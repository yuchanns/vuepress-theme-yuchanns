<template>
  <div>
    <FixedHead selector='#categories-head' :title="$themeConfig.lang.categories" />
    <div class="bg-gray-light border-bottom" id="categories-head">
        <div class="container-lg p-responsive text-center py-6">
          <h1 class="h0-mktg text-capitalize">{{ $themeConfig.lang.categories }}</h1>
          <p class="f4 text-gray col-md-6 mx-auto">Browse categories on {{ $site.title }}.</p>
        </div>
      </div>
      <div class="d-lg-flex container-lg p-responsive">
        <div class="position-relative mb-6" style="width: 100%">
          <h2 class="h2-mktg">All featured categories</h2>
          <ul class="list-style-none">
            <li class="py-4 border-bottom"
              :key="key"
              v-for="(category, key) in $categories._metaMap">
              <router-link
                :to="'/categories/' + key"
                class="d-flex no-underline">
                <img :src="getLogo(key)" alt="vue" class="rounded-1 mr-3" width="64" height="64" v-if="getLogo(key)">
                <div class="bg-blue-light f4 text-gray-light text-bold rounded-1 mr-3 flex-shrink-0 text-center" style="width: 64px; height: 64px; line-height: 64px" v-else>#</div>
                <div class="d-sm-flex flex-auto">
                  <div class="flex-auto">
                    <p class="f3 lh-condensed mb-0 mt-1 link-gray-dark">{{ key }}</p>
                    <p class="f5 text-gray mb-0 mt-1">{{ getDesc(key) }}</p>
                  </div>
                  <div class="d-inline-block">
                    <button class="d-flex flex-items-center btn btn-sm">
                      <tags
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
import Tags from '@theme/components/icons/Tags'
import FixedHead from '@theme/components/FixedHead'

export default {
  name: 'Categories',

  components: {
    Tags,
    FixedHead
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
