<template>
  <header
    itemscope="itemscope"
    itemtype="https://schema.org/Organization"
    class="header">
    <div class="row header-top">
      <div class="column xs-33 sm-20">
        <menu-hamburguer
          class="header-top__hamburguer" />
      </div>
      <div class="column xs-33 sm-60">
        <h1 class="header__logo">
          <logo class="header-top-logo__link" />
        </h1>
      </div>
      <div class="column xs-33 sm-20">
        <div class="search header-top__search">
          <span class="icon search__icon">
            search
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import MenuHamburguer from '@theme/components/Hamburguer'
import Logo from '@theme/components/Logo'

export default {
  name: 'TheHeader',

  components: {
    MenuHamburguer,
    Logo
  }
}
</script>

<style lang="stylus" scoped>
@import "~@theme/styles/common.styl"

.header
  &-top
    position relative
    padding 30px 20px 24px
    background-color #fff
    
    @media (max-width $mobile)
      top 0
      left 0
    
    &__hamburguer
      transform rotate(90deg)

  &__logo
    text-align center

.search
.search__icon
  position relative

.search
  &__icon
    float right
    padding 10px
    cursor pointer
</style>