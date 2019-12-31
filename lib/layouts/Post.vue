<template>
  <main>
    <div class="pagehead pt-0 pt-lg-4" id="post-title">
      <div class="pagehead-details-cotainer clearfix container-lg p-responsive d-lg-block">
        <h1>
          <router-link to="/"><BackIcon /></router-link>
          <span class="text-uppercase">post</span>
          <span style="margin: 0 .25em">/</span>
          <strong>{{ $page.title }}</strong>
        </h1>
      </div>
    </div>
    <div class="pagehead pt-0 pt-lg-4 width-full nav-background" v-show="fixed">
      <div class="pagehead-details-cotainer clearfix container-lg p-responsive d-lg-block">
        <h1>
          <router-link to="/"><BackIcon /></router-link>
          <span class="text-uppercase">post</span>
          <span style="margin: 0 .25em">/</span>
          <strong>{{ $page.title }}</strong>
        </h1>
      </div>
    </div>
    <div class="container-lg clearfix p-responsive">
      <div class="post-content">
        <div class="Box Box--condensed d-flex flex-column flex-shrink-0">
          <div class="Box-body d-flex flex-justify-between bg-blue-light flex-column flex-md-row flex-items-start flex-md-items-center">
            <span class="pr-md-4 f6">
              <DateIcon width="15" height="15" style="vertical-align: middle;line-height: 1; display: inline-block"/>
              <span class="lh-default v-align-middle link-gray">Created {{ $page.frontmatter.date | getDistanceToNow }}</span>
            </span>
          </div>
          <div class="Box-body d-flex flex-items-center flex-auto f6 border-bottom-0 flex-wrap flex-justify-between">
            <span v-if="prevPage">Prev: <router-link :to="prevPage.path">{{ prevPage.title }}</router-link></span>
            <span v-if="nextPage">Next: <router-link :to="nextPage.path">{{ nextPage.title }}</router-link></span>
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
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import BackIcon from '@theme/components/icons/BackIcon'
import DateIcon from '@theme/components/icons/DateIcon'
import { getDistanceToNow } from '@theme/utils/compare-time'
import { parseISO } from 'date-fns'
import compareDesc from 'date-fns/compareDesc'
import _ from 'lodash'

export default {
  name: 'Post',

  components: {
    BackIcon,
    DateIcon
  },

  data () {
    return {
      fixed: false
    }
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
      return this.$site.pages.filter(item => {
        return item.id === 'Home'
      }).sort((a, b) => {
        return compareDesc(parseISO(a.frontmatter.date), parseISO(b.frontmatter.date))
      })
    }
  },

  filters: {
    getDistanceToNow
  },

  mounted () {
    const navBar = document.querySelector('#post-title')
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

.pagehead
  padding-bottom 0
  background-color #fafbfc
  position relative
  margin-bottom 24px
  border-bottom 1 solid #e1e4e8
  &-details-cotainer
    margin-bottom 20px
  h1
    position relative
    float left
    max-width 635px
    padding-left 18px
    font-size 18px
    line-height 26px
    color #586069
    margin-top 0
    margin-bottom 0

.Box
  background-color #fff
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
  background-color #f1f8ff
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

.nav-background
  position fixed
  z-index 999
  padding-top 20px
  top 0
  border-bottom 1px solid #d1d5da
  box-shadow 0 1px 2px rgba(0 0 0 .075)
</style>
