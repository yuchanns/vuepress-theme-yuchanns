<template>
  <div class="pagehead pt-lg-4 width-full nav-background" v-show="fixed">
    <div class="pagehead-details-cotainer clearfix container-lg p-responsive d-lg-block">
      <h1>
        <router-link :to="router" v-if="back"><BackIcon /></router-link>
        <strong :class="{ 'text-capitalize': !uppercase, 'text-uppercase': uppercase }">{{ title }}</strong>
      </h1>
    </div>
  </div>
</template>

<script>
import BackIcon from '@theme/components/icons/BackIcon'
import _ from 'lodash'

export default {
  name: 'FixedHead',

  components: {
    BackIcon
  },

  props: {
    selector: {
      type: String
    },
    title: {
      type: String
    },
    back: {
      type: Boolean,
      default: true
    },
    uppercase: {
      type: Boolean,
      default: false
    },
    router: {
      type: String,
      default: '/'
    }
  },

  data () {
    return {
      fixed: false
    }
  },

  mounted () {
    const navBar = document.querySelector(this.selector)
    window.addEventListener('scroll', _.throttle(() => {
      this.fixed = navBar.getBoundingClientRect().bottom <= 0
    }), 100)
  }
}
</script>

<style lang="stylus" scoped>
.pagehead
  padding-bottom 0
  background-color $headBgColor
  margin-bottom 24px
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

.nav-background
  position fixed!important
  z-index 999
  padding-top 20px
  top 0
  border-bottom 1px solid #d1d5da!important
  box-shadow 0 1px 2px rgba(0 0 0 .075)
</style>
