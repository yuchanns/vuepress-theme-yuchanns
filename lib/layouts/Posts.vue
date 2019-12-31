<template>
  <main>
    <div class="container-xl clearfix px-3 mt-4">
      <div class="position-relative">
        <div class="mt-4 position-relative">
          <div class="d-flex">
            <div class="col-12 col-lg-10">
              <div class="position-relative">
                <h2 class="f4 text-normal mb-2">{{timeItems[year.end].length}} posts in the last year</h2>
                <div class="border border-gray-dark py-2 graph-before-activity-overview">
                  <div class="mx-3 d-flex flex-column flex-items-end flex-xl-items-center overflow-hidden pt-1 height-full text-center">
                    <calendar-heatmap
                      :end-date="today"
                      :values="heatValues"
                      :range-color="rangeColor"
                      height="112"
                      width="622"
                    />
                  </div>
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
  name: 'TimeLine',

  components: {
    CalendarHeatmap
  },

  data () {
    return {
      rangeColor: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
    }
  },

  computed: {
    today () {
      return format(new Date(), 'yyyy-MM-dd')
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
        end: getYear(parseISO(this.posts[0].frontmatter.date)),
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

.graph-before-activity-overview
  border-radius 3px
</style>
