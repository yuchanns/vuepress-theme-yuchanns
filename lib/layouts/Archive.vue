<template>
  <main>
    <div class="container-xl clearfix px-3 mt-4">
      <div class="position-relative">
        <div class="mt-4 position-relative">
          <div class="d-flex">
            <div class="col-12 col-lg-10">
              <div class="position-relative" id="heatmap">
                <h2 class="f4 text-normal mb-2">{{ postsLastYear.length }} posts in {{ heatTitle }}</h2>
                <div class="border border-gray-dark py-2 graph-before-activity-overview">
                  <div class="mx-3 d-flex flex-column flex-items-end flex-xl-items-center overflow-hidden pt-1 height-full text-center">
                    <ClientOnly>
                      <component v-if="calendarHeatmap"
                        :is="calendarHeatmap"
                        :end-date="endDate"
                        :values="heatValues"
                        :range-color="rangeColor"
                        height="112"
                        width="622"
                        tooltip-unit="posts"
                      />
                    </ClientOnly>
                  </div>
                </div>
              </div>
              <div class="post-activity">
                <h2 class="f4 text-normal mb-2">
                  Post activity
                </h2>
                <div class="float-left col-12">
                  <TransitionFadeSlide group>
                    <div
                      class="profile-timeline discussion-timeline width-full pb-4"
                      :key="key"
                      v-for="(item, key) in monthItems">
                      <h3 class="profile-timeline-month-heading bg-white d-inline-block f6 pr-2 py-1">
                        {{ key | formatMonth }} <span class="text-gray">{{ key | formatYear }}</span>
                      </h3>
                      <div class="profile-rollup-wrapper py-4 pl-4 position-relative ml-3">
                        <span class="discussion-item-icon"><tags type="repo-push"/></span>
                        <span class="f4 lh-condensed width-full ws-normal text-left">Created {{ item.length }} posts in this month</span>
                        <ul class="profile-rollup-content list-style-none">
                          <li class="ml-0 py-1"
                            :key="pk"
                            v-for="(post, pk) in item">
                            <div class="d-inline-block col-8 css-truncate lh-condensed">
                              <router-link :to="post.path">{{ post.title }}</router-link>
                              <span class="f6 ml-lg-1 mt-1 mt-lg-0 d-block d-lg-inline text-gray">{{ post.frontmatter.date | formatDate}}</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TransitionFadeSlide>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-2 pl-5 hide-sm hide-md hid-lg">
              <div class="d-none d-lg-block">
                <div class="bg-white"
                  :class="{'year-list-fixed': fixed}">
                  <ul class="filter-list">
                    <li :key="key" v-for="(title, key) in timeTitles">
                      <span class="filter-item px-3 mb-2 py-2"
                        :class="{'selected': title === selectedYear}"
                        @click="selectedYear = title">{{ title }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import TransitionFadeSlide from '@theme/components/TransitionFadeSlide.vue'
import { parseISO, format } from 'date-fns'
import getYear from 'date-fns/getYear'
import compareDesc from 'date-fns/compareDesc'
import Tags from '@theme/components/icons/Tags'
import _ from 'lodash'

export default {
  name: 'Archive',

  components: {
    TransitionFadeSlide,
    Tags
  },

  data () {
    const date = new Date()
    const thisYear = parseInt(format(date, 'yyyy'))
    const thisDay = format(date, 'yyyy-MM-dd')

    return {
      rangeColor: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
      selectedYear: thisYear,
      today: thisDay,
      todayISO: date,
      fixed: false,
      calendarHeatmap: null
    }
  },

  filters: {
    formatMonth (date) {
      return format(parseISO(date), 'LLLL')
    },

    formatYear (date) {
      return format(parseISO(date), 'yyyy')
    },

    formatDate (date) {
      return format(parseISO(date), 'MM-dd')
    }
  },

  computed: {
    heatTitle () {
      if (this.selectedYear !== this.year.end) {
        return this.selectedYear
      }

      return 'the last year'
    },

    endDate () {
      if (this.selectedYear !== this.year.end) {
        return this.selectedYear.toString() + '-12-31'
      }

      return this.today
    },

    postsLastYear () {
      if (this.selectedYear !== this.year.end) {
        return this.timeItems[this.selectedYear]
      }

      const startDate = parseISO(this.timeTitles[1] + format(this.todayISO, '-MM-dd'))

      return this.posts.filter(post => {
        return compareDesc(parseISO(post.frontmatter.date), startDate) <= 0
      })
    },

    heatValues () {
      const heatDays = {}

      this.posts.forEach(post => {
        const date = format(parseISO(post.frontmatter.date), 'yyyy-MM-dd')
        const title = post.title
        if (date in heatDays) {
          heatDays[date].push(title)
        } else {
          heatDays[date] = []
          heatDays[date].push(title)
        }
      })

      const heatValues = []

      Object.keys(heatDays).forEach(heatDay => {
        heatValues.push({ date: heatDay, count: heatDays[heatDay].length })
      })

      return heatValues
    },

    posts () {
      return this.$site.pages.filter(item => {
        return item.id === 'Home'
      }).sort((a, b) => {
        return compareDesc(parseISO(a.frontmatter.date), parseISO(b.frontmatter.date))
      })
    },

    year () {
      return {
        end: getYear(this.todayISO),
        start: getYear(parseISO(this.posts[this.posts.length - 1].frontmatter.date))
      }
    },

    timeTitles () {
      return [...Array(this.year.end + 1 - this.year.start).keys()].map(item => this.year.start + item).reverse()
    },

    timeItems () {
      const timelines = {}

      this.timeTitles.forEach(year => {
        timelines[year] = this.posts.filter(item => {
          const itemDate = parseISO(item.frontmatter.date)
          return (compareDesc(parseISO(year.toString()), itemDate) > -1) && (compareDesc(parseISO((year + 1).toString()), itemDate) < 0)
        })
      })

      return timelines
    },

    monthItems () {
      const monthItems = {}
      this.postsLastYear.forEach(post => {
        const yearMonth = format(parseISO(post.frontmatter.date), 'yyyy-MM')
        if (yearMonth in monthItems) {
          monthItems[yearMonth].push(post)
        } else {
          monthItems[yearMonth] = []
          monthItems[yearMonth].push(post)
        }
      })
      return monthItems
    }
  },

  mounted () {
    const { CalendarHeatmap } = require('vue-calendar-heatmap')
    this.calendarHeatmap = CalendarHeatmap

    const heatmap = document.querySelector('#heatmap')
    window.addEventListener('scroll', _.throttle(() => {
      this.fixed = heatmap.getBoundingClientRect().bottom <= 0
    }), 100)
  }
}
</script>

<style lang="stylus" scoped>
ol
ul
  padding-left 0
  margin-top 0
  margin-bottom 0

.graph-before-activity-overview
  border-radius 3px

.hide
  &-sm
    @media (max-width 543px)
      display none
  &-md
    @media (max-width 767px) and (min-width 544px)
      display none
  &-lg
    @media (max-width 1011px) and (min-width 768px)
      display none

.filter-list
  list-style-type none
  .filter-item
    margin 0 0 2px
    font-size 12px

.filter-item
  position relative
  display block
  overflow hidden
  text-decoration none
  text-overflow ellipsis
  white-space nowrap
  cursor pointer
  border-radius 3px
  &:hover
    text-decoration none
    background-color #eaecef
  &.selected
    color #fff
    background-color #0366d6

.post-activity h2
  margin 30px 0 15px

.float-left
  float left

.profile-timeline
  &.discussion-timeline
    float none
    &:before
      left 15px
      background-color #eaecef
    .profile-timeline-month-heading:after
      position absolute
      top 12px
      right 0
      left 0
      z-index -1
      height 1px
      content ""
      background-color #eaecef

.discussion
  &-timeline
    position relative
    &:before
      position absolute
      top 0
      bottom 0
      z-index -1
      display block
      width 2px
      content ""
  &-item-icon
    float left
    width 32px
    height 32px
    margin-top -5px
    margin-left -39px
    line-height 28px
    color #24292e
    text-align center
    background-color #e1e4e8
    border 2px solid #fff
    border-radius 50%

.text-left
  text-align left
.ws-normal
  white-space normal

.profile-rollup-wrapper
  &>.profile-rollup-content
    display block
  .css-truncate
    max-width 85%

.css-truncate
  vertical-align top
  overflow hidden
  text-overflow ellipsis
  white-space nowrap

.year-list-fixed
  position fixed
  width 122.656px
  top 5px
  margin-top 0
</style>
