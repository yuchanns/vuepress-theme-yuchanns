<template>
  <div style="background-color: #fcfdfd">
    <FixedHead selector='#tag-head' :title="$currentTags.key" router="/tags/" />
    <div class="container-lg d-sm-flex flex-items-center p-responsive py-5" id="tag-head">
      <div class="col-sm-10 d-flex flex-items-center mb-3 mb-sm-0">
        <div class="border border-black-fade bg-blue-light f4 text-gray-light text-bold rounded-1 flex-shrink-0 text-center mr-3"
          style="width: 48px; height: 48px; line-height: 48px">#</div>
        <h1 class="h1-mktg">{{ $currentTags.key }}</h1>
      </div>
    </div>
    <div class="container-lg p-responsive">
      <div class="d-md-flex gutter-md">
        <div class="col-lg-12 col-md-8">
          <h2 class="h3-mktg text-gray">
            Here are {{ $currentTags.pages.length }} posts matching this tag...
          </h2>
          <article
            :key="k"
            v-for="(page, k) in $currentTags.pages"
            class="border rounded-1 box-shadow bg-gray-light my-4">
            <div class="px-3" style="border-bottom: 1px solid #d1d5da">
              <div class="d-flex flex-justify-between my-3">
                <div class="d-flex flex-auto">
                  <span style="margin-top: 2px">
                    <tags type="repo" class="mr-2" />
                  </span>
                  <h1 class="f3 text-gray text-normal lh-condensed">
                    <router-link :to="page.path" class="text-bold">{{ page.title }}</router-link>
                  </h1>
                </div>
                <div class="d-flex flex-items-start ml-3">
                  <button class="d-flex flex-items-center btn btn-sm">
                    <tags
                      type="eye"
                      class="mr-1"/>
                    <span class="text-capitalize">watch</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="border-bottom bg-white">
              <div class="px-3 pt-3">
                <p class="text-gray mb-0 article-excerpt" v-html="page.excerpt"></p>
              </div>
              <div class="d-flex flex-wrap border-bottom border-gray-light px-3 pt-2 pb-2">
                <div class="tags-container f6 mb-2" v-if="page.frontmatter.tags">
                  <router-link
                    :to="$tags._metaMap[tag].path"
                    class="tags tags-link f6 my-1"
                    v-for="(tag, key) in page.frontmatter.tags" :key="key">
                    {{ tag }}
                  </router-link>
                </div>
              </div>
              <div class="p-3">
                <ul class="d-flex f6 list-style-none text-gray">
                  <li class="mr-4">Created {{ page.frontmatter.date | getDistanceToNow }}</li>
                  <li class="mr-4">
                    <span class="f6 my-1 ml-0">
                      <router-link :to="$categories._metaMap[page.frontmatter.category].path"
                        class="ml-0 mr-3 muted-link">
                        <span class="category-color" :style="[getCategoryColor(page.frontmatter.category)]"></span>
                        <span class="category">{{ page.frontmatter.category }}</span>
                      </router-link>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDistanceToNow } from '@theme/utils/compare-time'
import Tags from '@theme/components/icons/Tags'
import FixedHead from '@theme/components/FixedHead'

export default {
  name: 'TagItem',

  components: {
    Tags,
    FixedHead
  },

  filters: {
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
.gutter-md
  @media (min-width 768px)
    margin-right -16px
    margin-left -16px
  &>[class*=col-]
    padding-right 16px
    padding-left 16px

.float-sm-right
  @media (min-width 544px)
    float right

.markdown-body
  font-family -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji
  font-size 16px
  line-height 1.5
  word-wrap break-word
  &:before
  &:after
    display table
    content ""
  &:after
    clear both

.box-shadow
  box-shadow 0 1px 1px rgba(27 31 35 .1)

ol
ul
  padding-left 0
  margin-top 0
  margin-bottom: 0

.category-color
  position relative
  top 1px
  display inline-block
  width 12px
  height 12px
  border-radius 50%
  background-color $accentColor
</style>
