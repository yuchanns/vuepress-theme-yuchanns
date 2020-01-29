<template>
  <div class="position-relative">
    <header class="Header flex-wrap flex-lg-nowrap Details p-responsive">
      <div class="Header-item d-none d-lg-flex">
        <router-link
          to="/"
          class="Header-link">
          <img :src="$themeConfig.logo" height="32" width="32" v-if="$themeConfig.logo">
            <Tags
              type="mark-github"
              class="v-align-middle"
              width="32"
              height="32"
              v-else/>
        </router-link>
      </div>
      <div class="Header-item Header-item--full flex-column flex-lg-row width-full flex-order-2 flex-lg-order-none mr-0 mr-lg-3 mt-3 mt-lg-0 Details-content--hidden">
        <div class="header-search flex-self-stretch flex-lg-self-auto mr-0 mr-lg-3 mb-3 mb-lg-0 scoped-search site-scoped-search position-responsive">
          <div class="position-relative"></div>
        </div>
      </div>
      <div class="Header-item Header-item--full flex-justify-center d-lg-none position-relative">
        <router-link
          to="/"
          class="Header-link">
          <img :src="$themeConfig.logo" height="32" width="32" v-if="$themeConfig.logo">
          <Tags
            type="mark-github"
            class="v-align-middle"
            width="32"
            height="32"
            v-else/>
        </router-link>
      </div>
      <div class="Header-item Header-item--ful flex-column flex-lg-row width-full flex-order-2 flex-lg-order-none mr-0 mr-lg-3 mt-lg-0">
        <div class="header-search flex-self-stretch flex-lg-self-auto mr-0 mr-lg-3 mb-3 mb-lg-0 position-relative">
          <label class="form-control header-search-wrapper input-sm p-0 position-relative d-flex flex-justify-between flex-items-center">
            <!-- <input type="text" class="form-control input-sm header-search-input" placeholder="Search..."> -->
            <SearchBox />
          </label>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import Tags from '@theme/components/icons/Tags'
import SearchBox from '@SearchBox'

export default {
  name: 'TheHeader',

  data () {
    return {
      search: ''
    }
  },

  components: {
    Tags,
    SearchBox
  }
}
</script>

<style lang="stylus" scoped>
label
  font-weight 600

.input-sm
  min-height 28px
  padding-top 3px
  padding-bottom 3px
  font-size 12px
  line-height 20px

.form-control
  min-height 34px
  padding 6px 8px
  font-size 16px
  line-height 20px
  color #24292e
  vertical-align middle
  background-color #fff
  background-repeat no-repeat
  background-position right 8px center
  border 1px solid #d1d5da
  border-radius 3px
  outline none
  box-shadow inset 0 1px 2px rgba(27 31 35 .075)

.Header
.Header-item
  align-items center
  flex-wrap nowrap

.Header
  display flex
  z-index 32
  padding 16px
  font-size 14px
  line-height 1.5
  color hsla(0,0%,100%,.7)
  background-color #24292e
  &-item
    display flex
    margin-right 16px
    align-self stretch
    &--full
      flex auto
  &-link
    font-weight 600
    color $white
    white-space nowrap

.header-search
  min-width 300px
  transition .2s ease-in-out
  transition-property min-width,padding-bottom,padding-top
  &-wrapper
    display table
    width 100%
    max-width 100%
    padding 0
    font-size inherit
    font-weight 400
    color #fff
    vertical-align middle
    background-color hsla(0 0% 100% .125)
    border 0
    box-shadow none
  &-input
    display table-cell
    width 100%
    padding-top 0
    padding-bottom 0
    font-size inherit
    color inherit
    background none
    border 0
    box-shadow none

.v-align-middle
  vertical-align middle

.Details
  &-content--hidden
    display none
  @media (min-width 1012px)
    display flex!important
</style>
