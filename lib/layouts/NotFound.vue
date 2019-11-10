<template>
  <div class="bg-gray-dark text-white py-5 text-center">
    <div class="pt-5 text-bold mx-2 mt-0" style="font-size: 100px; margin-bottom: 20px; line-height: 0">
      4<span class="not-found-octocat-wrapper d-inline-block mx-2 bg-gray-dark position-relative">
        <NotFoundIcon class="not-found-lightbulb-ani position-relative" />
      </span>4
    </div>
    <div class="pb-5">
      <h4 class="mb-0">{{ notFound }}</h4>
    </div>
  </div>
</template>

<script>
import NotFoundIcon from '@theme/components/icons/NotFound'
import _ from 'lodash'

export default {
  name: 'NotFound',

  components: {
    NotFoundIcon
  },

  computed: {
    notFound () {
      return _.sample([
        'How did we get here?',
        'There\'s nothing here.',
        'That\'s a Four-Oh-Four.',
        'Looks like we\'ve got some broken links.'
      ])
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@theme/styles/padding.styl'
@import '~@theme/styles/margin.styl'
@import '~@theme/styles/display.styl'
@import '~@theme/styles/position.styl'
@import '~@theme/styles/text.styl'

.bg-gray-dark
  background-color #24292e

.not-found
  &-octocat-wrapper
    width 71px
    height 71px
    border-radius 45px
    &:after
      position absolute
      top 58px
      left 45px
      z-index -2
      display block
      width 4px
      height 4px
      vertical-align initial
      content ""
      background #fff
      border-radius 4px
      box-shadow 0 4px 0 #fff, 0 8px 0 #fff, 0 12px 0 #fff, 0 16px 0 #fff, 0 20px 0 #fff
      animation-name pull-string
      animation-duration .75s
      animation-fill-mode forwards
      animation-delay .5s
  &-lightbulb-ani
    z-index 999
    opacity .25
    animation-name lightbulb
    animation-duration 2.5s
    animation-fill-mode forwards
    animation-delay 1.3s

@keyframes lightbulb {
  0%, 8%, 14% {
    opacity: .1;
  }
  0%, 10%, 25% {
    opacity: .25;
  }
  5%, 30%, 50%, 70% {
    opacity: .5;
  }
  16%, 60%, 80% {
    opacity: .75;
  }
  90% {
    opacity: .8;
  }
  94% {
    opacity: .5;
  }
  100% {
    opacity: 1;
    stddeviation: 0;
  }
}
</style>