<template>
  <main>
    <div class="container-xl clearfix px-3 mt-4">
      <div class="position-relative">
        <div class="mt-4 position-relative">
          <div class="d-flex">
            <div class="col-12 col-lg-10">
              <div class="position-relative">
                <h2 class="f4 text-normal mb-2">{{ postsLastYear.length }} posts in {{ heatTitle }}</h2>
                <div class="border border-gray-dark py-2 graph-before-activity-overview">
                  <div class="mx-3 d-flex flex-column flex-items-end flex-xl-items-center overflow-hidden pt-1 height-full text-center">
                    <calendar-heatmap
                      :end-date="endDate"
                      :values="heatValues"
                      :range-color="rangeColor"
                      height="112"
                      width="622"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-2 pl-5 hide-sm hide-md hid-lg">
              <div class="d-none d-lg-block">
                <div class="bg-white">
                  <ul class="filter-list">
                    <li :key="key" v-for="(title, key) in timeTitles">
                      <span class="filter-item px-3 mb-2 py-2"
                        :class="{'selected': (title === selectedYear)}"
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
import { parseISO, format } from 'date-fns'
import getYear from 'date-fns/getYear'
import compareDesc from 'date-fns/compareDesc'
import { CalendarHeatmap } from 'vue-calendar-heatmap'

export default {
  name: 'Posts',

  components: {
    CalendarHeatmap
  },

  data () {
    const date = new Date()
    const thisYear = parseInt(format(date, 'yyyy'))
    const thisDay = format(date, 'yyyy-MM-dd')

    return {
      rangeColor: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
      selectedYear: thisYear,
      today: thisDay,
      todayISO: date
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
        return compareDesc(parseISO(post.frontmatter.date), startDate) < 0
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

.bg-white
  background-color #fff

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
  &.selected
    color #fff
    background-color #0366d6
</style>
