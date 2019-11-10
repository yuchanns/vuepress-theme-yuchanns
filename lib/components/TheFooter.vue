<template>
  <footer class="footer mt-6">
    <div class="bg-gray-light">
      <!-- todo: navigation list1-nav-more list2-categories-more list3-tags-more list4-site-aboutme -->
      <div class="footer container-lg width-full p-responsive">
        <div class="position-relative d-flex flex-row-reverse flex-lg-row flex-wrap flex-lg-nowrap flex-justify-center flex-lg-justify-between pt-6 pb-2 mt-6 f6 text-gray border-gray-light">
          <ul class="list-style-none d-flex flex-wrap col-12 col-lg-5 flex-justify-center flex-lg-justify-between mb-2 mb-lg-0">
            <li class="mr-3 mr-lg-0">
              © {{ year }} {{ $siteTitle }}
            </li>
            <li :class="{ 'mr-3': !isLast($themeConfig.footer.left, k), 'mr-lg-0': !isLast($themeConfig.footer.left, k) }"
              v-for="(left, k) in $themeConfig.footer.left"
              :key="k">
              <a :href="left.link">{{ left.title }}</a>
            </li>
          </ul>
          <a :href="$themeConfig.sns.github.link" title="GitHub" class="footer-octicon d-lg-block mx-lg-4">
            <tags
              type="mark-github"/>
          </a>
          <ul class="list-style-none d-flex flex-wrap col-12 col-lg-5 flex-justify-center flex-lg-justify-between mb-2 mb-lg-0">
            <li class="mr-3 mr-lg-0"
              v-for="(right, k) in $themeConfig.footer.right"
              :key="k">
              <a :href="right.link">{{ right.title }}</a>
            </li>
            <li class="mr-3 mr-lg-0">
              <a href="https://github.com/vuejs/vuepress">Vuepress</a>
            </li>
            <li>
              <a href="https://github.com/yuchanns/vuepress-theme-yuchanns">Theme-yuchanns</a>
            </li>
          </ul>
        </div>
        <div class="d-flex flex-justify-center pb-6">
          <span class="f6 text-gray-light"></span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { format } from 'date-fns'
import Tags from '@theme/components/icons/Tags'

export default {
  name: 'TheFooter',

  components: {
    Tags
  },

  computed: {
    year () {
      return format(new Date(), 'Y')
    }
  },

  methods: {
    isLast (list, key) {
      return list.length === (key + 1)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@theme/styles/container.styl'
@import '~@theme/styles/flexbox.styl'
@import '~@theme/styles/padding.styl'
@import '~@theme/styles/margin.styl'
@import '~@theme/styles/display.styl'
@import '~@theme/styles/position.styl'
@import '~@theme/styles/border.styl'
@import '~@theme/styles/text.styl'

.p-responsive
  padding-right 16px
  padding-left 16px
  @media (min-width 544px)
    padding-right 40px
    padding-left 40px
  @media (min-width 1012px)
    padding-right 16px
    padding-left 16px

.list-style-none
  list-style none 

.footer-octicon
  color #c6cbd1
  &:hover
    color #959da5

.bg-gray-light
  background-color #fafbfc
</style>
