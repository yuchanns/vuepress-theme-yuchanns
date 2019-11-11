<template>
  <main>
    <div class="container-xl clearfix px-3 mt-4">
      <div class="col-12 float-md-left pl-md-2">
        <div class="position-relative">
          <div class="d-lg-flex gutter-lg mt-4">
            <div class="col-lg-12">
              <div class="position-relative d-md-flex flex-wrap flex-justify-between flex-items-center border-bottom border-gray-dark pb-3">
                <h2 class="h6 text-uppercase">home</h2>
              </div>
              <div
                v-for="page in $pagination.pages"
                :key="page.key"
                class="col-12 d-block width-full py-4 border-bottom">
                <div class="d-inline-block mb-1">
                  <h3>
                    <router-link :to="page.path">
                      {{ page.title }}
                    </router-link>
                  </h3>
                </div>
                <div class="float-right">
                  <div class="d-linline-block">
                    <router-link :to="page.path">
                      <button class="btn btn-sm">
                        <tags
                          type="eye"
                          class="mr-1"/>
                        <span class="text-capitalize">watch</span>
                      </button>
                    </router-link>
                  </div>
                </div>
                <div class="py-1">
                  <p class="d-inline-block col-9 text-gray pr-4" itemprop="description">
                    {{ page.excerpt | stripTags }}
                  </p>
                </div>
                <div class="f6 text-gray mt-2">
                  <router-link :to="$categories._metaMap[page.frontmatter.category].path" class="ml-0 mr-3 muted-link">
                    <span class="category-color" :style="[getCategoryColor(page.frontmatter.category)]"></span>
                    <span class="category">{{ page.frontmatter.category }}</span>
                  </router-link>
                  <router-link
                    :to="$tags._metaMap[tag].path"
                    class="muted-link"
                    v-for="(tag, key) in page.frontmatter.tags" :key="key">
                    <tags type="tags" />
                    <span class="tags">{{ tag }}</span>
                  </router-link>
                  Created {{ page.frontmatter.date | getDistanceToNow }}
                </div>
              </div>
              <Pagination />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { getDistanceToNow } from '@theme/utils/compare-time'
import Tags from '@theme/components/icons/Tags'
import Pagination from '@theme/components/Pagination'
import _ from 'lodash'

export default {
  name: 'Home',

  components: {
    Tags,
    Pagination
  },

  filters: {
    stripTags (value) {
      const regex = /(<([^>]+)>)/ig
      if (value) {
        return value.replace(regex, '')
      }
      return ''
    },
    getDistanceToNow
  },

  methods: {
    getCategoryColor (label) {
      if (_.has(this.$themeConfig.categories, [label])) {
        return { backgroundColor: _.get(this.$themeConfig.categories, [label]) }
      }
      return {}
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@theme/styles/flexbox.styl'
@import '~@theme/styles/padding.styl'
@import '~@theme/styles/margin.styl'
@import '~@theme/styles/border.styl'
@import '~@theme/styles/display.styl'
@import '~@theme/styles/button.styl'
@import '~@theme/styles/container.styl'
@import '~@theme/styles/position.styl'
@import '~@theme/styles/text.styl'

.muted-link
  color #586069
  &:hover
    color $accentColor
    text-decoration none

.category-color
  position relative
  top 1px
  display inline-block
  width 12px
  height 12px
  border-radius 50%
  background-color $accentColor

.tags
  margin-right 5px

.float
  &-md-left
    @media (min-width 768px)
      float left
  &-right
    float right

.gutter-lg
  @media (min-width 1012px)
    margin-left -16px
    margin-right -16px
    &>[class*=col-]
      padding-left 16px
      padding-right 16px

.h6
  font-weight 600
  font-size 12px

.btn
  color #242910
  background-color #eff3f6
  background-image linear-gradient(-180deg,#fafbfc,#eff3f6 90%)
  background-position -1px -1px
  border-radius .25rem
  cursor pointer
</style>
