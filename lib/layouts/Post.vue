<template>
  <main>
    <div class="pagehead pt-lg-4" id="post-title" style="padding-top: 20px">
      <div class="pagehead-details-cotainer clearfix container-lg p-responsive d-lg-block">
        <h1>
          <router-link to="/"><BackIcon /></router-link>
          <strong>{{ $page.title }}</strong>
        </h1>
      </div>
    </div>
    <FixedHead selector='#post-title' :title="$page.title" />
    <div class="container-lg clearfix p-responsive">
      <div class="post-content">
        <div class="Box Box--condensed d-flex flex-column flex-shrink-0">
          <div class="Box-body d-flex flex-justify-between bg-blue-light flex-column flex-md-row flex-items-start flex-md-items-center">
            <div class="pr-md-4 f6">
              <span class="lh-default v-align-middle link-gray">{{ $themeConfig.lang.createdAt }} {{ formatDate($page.frontmatter.date) }}</span>
            </div>
            <div class="no-wrap d-flex flex-self-start flex-items-baseline">
              <span class="mr-1 f6 link-gray">{{ $themeConfig.lang.updatedAt }} {{ $page.lastUpdated ? formatDate($page.lastUpdated) : formatDate($page.frontmatter.date) }}</span>
            </div>
          </div>
          <div class="Box-body d-flex flex-items-center flex-auto f6 border-bottom-0 flex-wrap flex-justify-between">
            <span v-if="prevPage" class="text-capitalize">{{ $themeConfig.lang.prev }}: <router-link :to="prevPage.path">{{ prevPage.title }}</router-link></span>
            <span v-if="nextPage" class="text-capitalize">{{ $themeConfig.lang.next }}: <router-link :to="nextPage.path">{{ nextPage.title }}</router-link></span>
          </div>
        </div>
        <div class="Box mt-3 position-relative">
          <div class="Box-header py-2 d-flex flex-column flex-shrink-0 flex-md-row flex-md-items-center">
            <div class="text-mono f6 flex-auto pr-3 flex-order-2 flex-md-order-1 mt-2 mt-md-0">
              {{$page.readingTime.text}}
              <span class="file-info-divider"></span>
              {{$page.readingTime.words}} words
            </div>
          </div>
          <div class="Box-body">
            <Content/>
          </div>
          <Vssue :title="$page.title"
           v-if="$themeConfig.vssue" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import BackIcon from '@theme/components/icons/BackIcon'
import FixedHead from '@theme/components/FixedHead'
import { getDistanceToNow } from '@theme/utils/compare-time'
import { sortPosts } from '@theme/utils/sort-posts'
import _ from 'lodash'

export default {
  name: 'Post',

  components: {
    BackIcon,
    FixedHead
  },

  computed: {
    prevPage () {
      if (this.index === this.pages.length) {
        return null
      }
      return this.pages[this.index + 1]
    },

    nextPage () {
      if (this.index === 0) {
        return null
      }
      return this.pages[this.index - 1]
    },

    index () {
      return _.findIndex(this.pages, obj => {
        return obj.key === this.$page.key
      })
    },

    pages () {
      return sortPosts(this.$site.pages, 0, this.$site.pages.length, true)
    }
  },

  methods: {
    formatDate (date) {
      return getDistanceToNow(date, this.$lang)
    }
  }
}
</script>

<style lang="stylus" scoped>
.pagehead
  padding-bottom 0
  background-color $headBgColor
  position relative
  margin-bottom 24px
  border-bottom 1px solid #e1e4e8
  &-details-cotainer
    margin-bottom 20px
  h1
    position relative
    float left
    max-width 635px
    font-size 18px
    line-height 26px
    color #586069
    margin-top 0
    margin-bottom 0

.Box
  background-color $white
  border 1px solid #d1d5da
  border-radius 3px
  &--condensed
    line-height 1.25
  &-body
    padding 8px 16px
    border-bottom 1px solid #e1e4e8
  &-header
    padding 16px
    margin -1px -1px 0
    background-color #f6f8fa
    border 1px solid #d1d5da
    border-top-left-radius 3px
    border-top-right-radius 3px
  &-body
    padding 16px
    border-bottom 1px solid #e1e4e8
    &:last-of-type
      margin-bottom -1px
      border-bottom-right-radius 2px
      border-bottom-left-radius 2px

.bg-blue-light
  background-color lighten($accentColor, 95.2%)
.lh-default
  line-height 1.5
.v-align-middle
  vertical-align middle

.file-info-divider
    display inline-block
    width 1px
    height 18px
    margin-right 3px
    margin-left 3px
    vertical-align middle
    background-color #ddd
</style>
