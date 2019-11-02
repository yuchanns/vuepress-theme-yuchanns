<template>
  <div class="page not-found">
    <section class="row justify-center">
      <div class="column md-50 tac not-found__message">
        <h2>404</h2>
        <p>{{ notFound }}</p>
        <router-link to="/">
        <button
          type="button"
          class="ui-button reset-button ui-button--primary">
          {{ $themeConfig.lang.resetButton }}
        </button>
        </router-link>
      </div>
    </section>
    <section class="row justify-center">
      <div class="column md-50">
        <div class="not-found__image">
          <Abduction />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import _ from 'lodash'
import Abduction from '@theme/components/Abduction'

export default {
  name: 'NotFound',
  
  components: {
    Abduction
  },

  computed: {
    notFound () {
      return _.sample(this.$themeConfig.lang.notFound)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~@theme/styles/common.styl"

.not-found
  position relative
  height 40vh
  &__message
    position absolute
    top 50%
    transform translateY(-50%)
    z-index 2
    p
      font-size $mediumText
      color $textLightColor
      margin-top 20px
      margin-bottom 20px
      line-height $title3
  &__image
    position relative
    text-align center
    top -5%
    z-index 1
    svg
      width 100%
      height 100%
      opacity .3

.row.justify-center
  justify-content center

.tac
  text-align center

.ui-button
  font-family inherit 
  padding 14px 30px
  border-radius 60px
  &.ui-button
    &--primary
      background-color $primaryColor
      color #fff
      transition-property background-color
      transition-duration .5s

.reset-button
  cursor pointer
</style>