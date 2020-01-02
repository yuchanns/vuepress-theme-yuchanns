<template>
  <footer class="footer mt-6">
    <Navigation />
    <div class="bg-gray-light">
      <div class="container-lg p-responsive f6 py-4 d-sm-flex flex-justify-between flex-row-reverse flex-item-center">
        <ul class="list-style-none d-flex flex-items-center mb-3 mb-sm-0 lh-condensed-ultra">
          <li class="mr-3" v-if="twitter">
            <a
              :href="twitter.link"
              :title="twitter.account + ' on twitter'"
              style="color: #959da5">
              <SnsIcons
                type="twitter"
                class="d-block" />
            </a>
          </li>
          <li class="mr-3" v-if="facebook">
            <a
              :href="facebook.link"
              :title="facebook.account + ' on facebook'"
              style="color: #959da5">
              <SnsIcons
                type="facebook"
                class="d-block" />
            </a>
          </li>
          <li class="mr-3" v-if="youtube">
            <a
              :href="youtube.link"
              :title="youtube.account + ' on youtube'"
              style="color: #959da5">
              <SnsIcons
                type="youtube"
                class="d-block" />
            </a>
          </li>
          <li class="mr-3" v-if="linkedin">
            <a
              :href="linkedin.link"
              :title="linkedin.account + ' on linkedin'"
              style="color: #959da5">
              <SnsIcons
                type="linkedin"
                class="d-block" />
            </a>
          </li>
          <li class="mr-3" v-if="github">
            <a
              :href="github.link"
              :title="github.account + ' on github'"
              style="color: #959da5">
              <Tags
                height="20"
                width="20"
                type="mark-github"
                class="d-block" />
            </a>
          </li>
        </ul>
        <ul class="list-style-none d-flex text-gray">
          <li class="mr-3">
            © {{ year }} {{ $siteTitle }}
          </li>
          <li class="mr-3">
            <a href="https://github.com/vuejs/vuepress" class="link-gray">Vuepress</a>
          </li>
          <li>
            <a href="https://github.com/yuchanns/vuepress-theme-yuchanns" class="link-gray">yuchanns</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script>
import { format } from 'date-fns'
import _ from 'lodash'
import Tags from '@theme/components/icons/Tags'
import SnsIcons from '@theme/components/icons/SnsIcons'
import Navigation from '@theme/components/Navigation'

export default {
  name: 'TheFooter',

  components: {
    Tags,
    SnsIcons,
    Navigation
  },

  computed: {
    year () {
      return format(new Date(), 'yyyy')
    },
    github () {
      return this.getSns('github')
    },
    twitter () {
      return this.getSns('twitter')
    },
    facebook () {
      return this.getSns('facebook')
    },
    youtube () {
      return this.getSns('youtube')
    },
    linkedin () {
      return this.getSns('linkedin')
    }
  },

  methods: {
    isLast (list, key) {
      return list.length === (key + 1)
    },
    getSns (sns) {
      if (_.has(this.$themeConfig.sns, [sns])) {
        return _.get(this.$themeConfig.sns, [sns])
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

.p-responsive
  padding-right 16px
  padding-left 16px
  @media (min-width 544px)
    padding-right 40px
    padding-left 40px
  @media (min-width 1012px)
    padding-right 16px
    padding-left 16px

.bg-gray-light
  background-color #fafbfc
</style>
