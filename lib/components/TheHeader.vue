<template>
  <header
    itemscope="itemscope"
    itemtype="https://schema.org/Organization"
    class="header">
    <div class="row header-top">
      <div class="column xs-33 sm-20">
        <div class="hamburguer header-top__hamburguer">
          <div class="hamburguer__wrapper">
            <span class="hamburguer__line"></span>
            <span class="hamburguer__line"></span>
            <span class="hamburguer__line"></span>
          </div>
        </div>
      </div>
      <div class="column xs-33 sm-60">
        <h1 class="header__logo">
          <router-link to="/" class="header-top-logo__link">
            <img itemprop="logo"
              :src="$site.themeConfig.logo"
              height="47px"
              width="50px"
              alt="$site.title">
          </router-link>
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
export default {
  name: 'TheHeader'
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
      top: 0
      left: 0
    
    &__hamburguer
      transform: rotate(90deg)

  &__logo
    text-align: center

.hamburguer
  width: 44px
  height: 44px
  cursor: pointer
  &__wrapper
    width: 30px
    position: relative
    left: 50%
    top: 12px
    margin-left: -15px
    transition: .5s ease-in-out
    transform: rotate(0deg)
  &__line
    display: block
    position: absolute
    height: 5px
    width: 100%
    background-color: $primaryColor
    border-radius: 50px
    opacity: 1
    left: 0
    transition: .25s ease-in-out
    transform: rotate(0deg)
    &:first-child
      top: 0
    &:nth-child(2)
      top: 8px
      width: 60%
    &:nth-child(3)
      top: 16px
      width: 80%

.search
.search__icon
  position: relative

.search
  &__icon
    float: right
    padding: 10px
    cursor: pointer
</style>