<template>
  <span class="bullet no_bw" :class="`bullet--${type} bullet--${size}`"></span>
</template>

<script>
  export default {
    name: 'Bullet',

    props: {
      type: {
        type: String,
        default: 'html'
      },
      size: String
    }
  }
</script>

<style lang="stylus" scoped>
@import '~@theme/styles/config.styl'

.bullet
  position relative
  border-radius 50%
  width 8px
  height 8px
  display inline-block
  background-color $primaryColor

  &--small 
    width 6px
    height 6px

  &--primary
    background-color $colorPrimary

</style>