<template>
  <main>
    <FixedHead selector='#head-title'
      :title="$themeConfig.lang.home"
      :back="false"
      class="text-uppercase"
      :uppercase="true" />
    <div class="container-xl clearfix px-3 mt-4">
      <div class="col-12 float-md-left pl-md-2">
        <div class="position-relative">
          <div class="d-lg-flex gutter-lg mt-4">
            <div class="col-lg-12">
              <div class="position-relative d-md-flex flex-wrap flex-justify-between flex-items-center border-bottom border-gray-dark pb-3" id="head-title">
                <h2 class="h6 text-uppercase">{{ $themeConfig.lang.home }}</h2>
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
                  <p class="d-inline-block col-9 text-gray pr-4"
                    itemprop="description"
                    v-html="page.excerpt">
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
                  {{ $themeConfig.lang.createdAt }} {{ page.frontmatter.date | getDistanceToNow }}
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
import FixedHead from '@theme/components/FixedHead'

export default {
  name: 'Home',

  components: {
    Tags,
    Pagination,
    FixedHead
  },

  filters: {
    // stripTags (value) {
    //   const regex = /<[^>]+>/ig
    //   if (value) {
    //     return value.replace(regex, '')
    //   }
    //   return ''
    // },
    getDistanceToNow
  },

  methods: {
    getCategoryColor (label) {
      if (label in this.$themeConfig.categories && 'color' in this.$themeConfig.categories[label]) {
        return { backgroundColor: this.$themeConfig.categories[label].color }
      }
      return {}
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

.category-color
  position relative
  top 1px
  display inline-block
  width 12px
  height 12px
  border-radius 50%
  background-color $accentColor

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
</style>
