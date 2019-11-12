<template>
  <div class="position-relative">
    <header class="Header flex-wrap flex-lg-nowrap Details p-responsive">
      <div class="Header-item d-none d-lg-flex">
        <a 
          href="/"
          class="Header-link">
          <img :src="$themeConfig.logo" height="32" width="32" v-if="$themeConfig.logo">
          <Tags 
            type="mark-github"
            class="v-align-middle"
            width="32"
            height="32"
            v-else/>
        </a>
      </div>
      <div class="Header-item Header-item--full flex-column flex-lg-row width-full flex-order-2 flex-lg-order-none mr-0 mr-lg-3 mt-3 mt-lg-0 Details-content--hidden">
        <div class="header-search flex-self-stretch flex-lg-self-auto mr-0 mr-lg-3 mb-3 mb-lg-0 scoped-search site-scoped-search position-responsive">
          <div class="position-relative"></div>
        </div>
      </div>
      <div class="Header-item Header-item--full flex-justify-center d-lg-none position-relative">
        <a 
          href="/"
          class="Header-link">
          <img :src="$themeConfig.logo" height="32" width="32" v-if="$themeConfig.logo">
          <Tags 
            type="mark-github"
            class="v-align-middle"
            width="32"
            height="32"
            v-else/>
        </a>
      </div>
    </header>
  </div>
</template>

<script>
import Tags from '@theme/components/icons/Tags'

export default {
  name: 'TheHeader',

  components: {
    Tags
  }
}
</script>

<style lang="stylus" scoped>
@import '~@theme/styles/position.styl'
@import '~@theme/styles/margin.styl'
@import '~@theme/styles/flexbox.styl'
@import '~@theme/styles/display.styl'

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
    color #fff
    white-space nowrap 

.v-align-middle
  vertical-align middle 

.Details
  &-content--hidden
    display none
  @media (min-width 1012px)
    display flex!important
</style>
