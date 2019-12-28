<template>
  <main>
    <div class="container-xl clearfix px-3 mt-4">
      <div class="col-12 float-md-left pl-md-2">
        <div class="width-full top-0 UnderlineNav nav-background" v-show="fixed">
          <span class="UnderlineNav-item mr-0 mr-md-1 mr-lg-3 text-uppercase h6">home</span>
        </div>
        <div class="position-relative">
          <div class="d-lg-flex gutter-lg mt-4">
            <div class="col-lg-12">
              <div class="position-relative d-md-flex flex-wrap flex-justify-between flex-items-center border-bottom border-gray-dark pb-3" id="head-title">
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
                <div class="tags-container d-inline-flex flex-wrap flex-items-center f6 my-1" v-if="page.frontmatter.tags">
                  <router-link
                    :to="$tags._metaMap[tag].path"
                    class="tags tags-link f6 my-1"
                    v-for="(tag, key) in page.frontmatter.tags" :key="key">
                    {{ tag }}
                  </router-link>
                </div>
                <div class="f6 text-gray mt-2">
                  <router-link :to="$categories._metaMap[page.frontmatter.category].path"
                    class="ml-0 mr-3 muted-link">
                    <span class="category-color" :style="[getCategoryColor(page.frontmatter.category)]"></span>
                    <span class="category">{{ page.frontmatter.category }}</span>
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

  data () {
    return {
      fixed: false
    }
  },

  filters: {
    stripTags (value) {
      const regex = /<[^>]+>/ig
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
  },
  mounted () {
    const navBar = document.querySelector('#head-title')
    window.addEventListener('scroll', _.throttle(() => {
      this.fixed = navBar.getBoundingClientRect().bottom <= 0
    }), 100)
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

.top-0
  top 0

.UnderlineNav
  display flex
  overflow-x auto
  overflow-y hidden
  justify-content space-between
  &-item
    padding 16px 0
    margin-right 16px
    line-height 1.5
    color #586069
    text-align center
    border-bottom 2px solid transparent
    z-index 999

.nav-background
  background-color #fff
  border-bottom 1px solid #d1d5da
  position fixed
  z-index 999
  box-shadow 0 1px 2px rgba(0 0 0 .075)
  &:after
    position fixed
    top 0
    right 0
    left 0
    z-index 100
    height 54px
    content ""
    background-color #fff
    border-bottom 1px solid #d1d5da
    box-shadow 0 1px 2px rgba(0 0 0 .075)

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
  display inline-block
  padding .3em .9em
  margin 0 .5em .5em 0
  white-space nowrap
  background-color #f1f8ff
  border-radius 3px
  &-link:hover
    text-decoration none
    background-color #def
  &-container
    height 30px
    overflow hidden

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
