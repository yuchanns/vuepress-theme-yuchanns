<template>
  <div class="page not-found">
    <section class="row justify-center">
      <div class="column md-50 tac not-found__message">
        <h2>404</h2>
        <p>{{ $themeConfig.lang.notFound }}</p>
        <router-link to="/">
        <button
          type="button"
          class="ui-button reset-button ui-button--primary">
          {{ $themeConfig.lang.resetButton }}
        </button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style lang="stylus" scoped>
@import "~@theme/styles/common.styl"

.not-found
  position relative
  height 40vh

.row.justify-center
  justify-content center

.tac
  text-align center

.not-found__message
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