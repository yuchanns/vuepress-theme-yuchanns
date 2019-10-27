<template>
  <div
    class="layout-main"
    itemscope="itemscope"
    itemtype="https://schema.org/WebPage">
    <div class="container-fluid wrapper-body__nm">
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
              <a href="/" itemprop="url"
                class="header-top-logo__link router-link-exact-active router-link-active">
                <img itemprop="logo"
                  :src="$site.themeConfig.favicon"
                  height="47px"
                  width="50px"
                  alt="Blog yuchanns'Atelier">
              </a>
            </h1>
          </div>
          <div class="column xs-33 sm-20">
            <div class="search header-top__search">
              <span class="icon search__icon">
                <font-awesome-icon icon="search" />
              </span>
            </div>
          </div>
        </div>
      </header>
      <main class="container main">
        <div class="page home">
          <div class="row">
            <div class="home__first-card column md-50">
              <article class="card box-default card--cover-top">
                <div class="card__box1 card__box1--top">
                  <header>
                    <div class="card-category">
                      <a href="" class="card-category__link">
                        <span class="bullet no_bw"></span>
                        <span class="meta-text">Golang</span>
                      </a>
                    </div>
                    <div class="card-cover">
                      <a href="">
                        <picture>
                          <img
                            src="/golang-study.jpeg"
                            alt="go语言学习笔记"
                            class="card-cover__image card-cover__image--top cover">
                        </picture>
                      </a>
                    </div>
                    <a href="/" class="card-title">
                      <h2 class="card-title__text">Go语言学习笔记</h2>
                    </a>
                  </header>
                  <aside class="row card-info">
                    <div class="column xs-50">
                      <ul class="card-info__list">
                        <li class="card-info__item">
                          <time class="card-timeago">
                            1 month ago
                          </time>
                        </li>
                      </ul>
                    </div>
                    <div class="column xs-50">
                      <a href="" class="card-readmore">
                        <span class="card-readmore__text">see post</span>
                        <span class="icon card-readmore__icon icon--arrow"><font-awesome-icon icon="long-arrow-alt-right" /></span>
                      </a>
                    </div>
                  </aside>
                </div>
              </article>
            </div>
            <div class="column md-50">
              <div class="row">
                <div class="column sm-100">
                  <article class="card box-default">
                    <div class="card__box1 card__box--false">
                      <header>
                        <div class="card-category">
                          <a href="" class="card-category__link">
                            <span class="bullet no_bw"></span>
                            <span class="meta-text">算法</span>
                          </a>
                          <a href="" class="card-title">
                            <h2 class="card-title__text">茴字的四种写法-KMP算法</h2>
                          </a>
                        </div>
                      </header>
                      <aside class="row card-info">
                        <div class="column xs-50">
                          <ul class="card-info__list">
                            <li class="card-info__item">
                              <time class="card-timeago">1 month ago</time>
                            </li>
                          </ul>
                        </div>
                        <div class="column xs-50">
                          <a href="" class="card-readmore">
                            <span class="card-readmore__text">see post</span>
                            <span class="icon card-readmore__icon icon--arrow"><font-awesome-icon icon="long-arrow-alt-right" /></span>
                          </a>
                        </div>
                      </aside>
                    </div>
                  </article>
                </div>
                <div class="column sm-100 mt-30">
                  <article class="card box-default">
                    <div class="card__box1 card__box--false">
                      <header>
                        <div class="card-category">
                          <a href="" class="card-category__link">
                            <span class="bullet no_bw"></span>
                            <span class="meta-text">swoole</span>
                          </a>
                          <a href="" class="card-title">
                            <h2 class="card-title__text">协程下的mysql连接池实现分析</h2>
                          </a>
                        </div>
                      </header>
                      <aside class="row card-info">
                        <div class="column xs-50">
                          <ul class="card-info__list">
                            <li class="card-info__item">
                              <time class="card-timeago">1 month ago</time>
                            </li>
                          </ul>
                        </div>
                        <div class="column xs-50">
                          <a href="" class="card-readmore">
                            <span class="card-readmore__text">see post</span>
                            <span class="icon card-readmore__icon icon--arrow"><font-awesome-icon icon="long-arrow-alt-right" /></span>
                          </a>
                        </div>
                      </aside>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSearch, faLongArrowAltRight)

export default {
  name: 'Home',
  components: {
    FontAwesomeIcon
  }
}
</script>

<style lang="stylus">
@import '~@theme/styles/config.styl'

*
  margin: 0
  padding: 0

body
  color: $textColor
  overflow-x: hidden
  background-color: $bgColor

a
  text-decoration: none
  color: inherit

ol, ul
  list-style-type: none

img
  &.cover
    position: relative
    display: flex
    width: 100%
    line-height: 1em
    text-align: center
    background-color: $bgColor
    overflow: hidden

.layout-main
  .container-fluid
    background-color: $bgColor

.container
.container-fluid *
  box-sizing: border-box

.container
.container-fluid
  max-width: 100%
  margin-left: auto
  margin-right: auto
  padding-left: .9375rem
  padding-right: .9375rem

.container-fluid
  padding: .4px

.main
  width: 100%
  max-width: 1360px
  padding-left: 24px
  padding-right: 24px

  @media (min-width: 1500px)
    max-width: 1500px

.wrapper-body
  &__nm
    transition: transform .2s ease-in-out
    transform-origin: top center

.row
  margin: 0
  display: flex
  flex-wrap: wrap

.header-top
  position: relative
  padding: 30px 20px 24px
  background-color: #fff
  &__hamburguer
    transform: rotate(90deg)

@media (max-width: 576px)
  .header-top
    top: 0
    left: 0
  .conteinr-fluid
    padding: 0

.column
  flex: 0 0 100%
  padding-left: .9375rem
  padding-right: .9375rem

  &.xs-33
    flex: 0 0 33.33333%
    max-width: 33.33333%

  &.xs-50
    flex: 0 0 50%
    max-width: 50%

  .column
    padding-right: 0
    padding-left: 0

@media (max-width: 768px)
  .column
    padding-right: 0!important
    padding-left: 0!important

  .home__first-card
    margin-bottom: 30px

  .card__box1
    width: 100%

@media (min-width: 36rem)
  .column
    &.sm-20
      flex: 0 0 20%
      max-width: 20%
    &.sm-60
      flex: 0 0 60%
      max-width: 60%
    &.sm-100
      flex: 0 0 100%
      max-width: 100%

@media (min-width: 48rem)
  .column
    flex: 1

    &.md-50
      flex: 0 0 50%
      max-width: 50%

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

.header__logo
  text-align: center

.search, .search__icon
    position: relative

.search
  &__icon
    float: right
    padding: 10px
    cursor: pointer

.icon
  text-transform: none
  line-height: 1

  &--arrow
    font-size: 7px

[class*=icon-]
  transition: color .5s

[class*=" icon-"]
[class^=icon-]
  line-height: 1
  text-transform: none

.page
  margin-top: 50px

@media (max-width: 1024px)
  .card-title__text
    font-size: 1rem
    line-height: 1rem

.bullet
  position: relative
  border-radius: 50%
  width: 8px
  height: 8px
  display: inline-block

.bullet
  background-color: $primaryColor

.meta-text
  font-size: .75rem
  text-transform: uppercase
  font-weight: 400

.card
  display: flex

  &.box-default
    padding-bottom: 0

  &-cover
    width: 100%
    height: 150px
    margin-bottom: 20px

    &__image
      width: 100%
      object-fit: cover

      &--top
        height: 150px

  &__box1
    width: 100%
    min-width: 120px

  &-category
    &__link
      display: inline-block
      margin-bottom: 10px

  &-title
    display: block
    height: 60px

  &--cover-top
    .card-title
      height: 84px

  &-info
    &.row
      border-top: .5px solid $borderColor

      .column
        padding: 0

    &__item
      display: inline-flex

  &-readmore
    position: relative
    right: 4px
    display: block
    text-align: right

    &__icon
      margin-left: 6px

    &__text
      text-transform: uppercase

  &-readmore
  &-readtime
  &-timeago
    font-size: .75rem
    color: $textLightColor
    padding: 16px 0

.box-default
  border-radius: 20px
  padding: 16px 20px
  box-shadow: 1px 1px 99px $shadowColor
  background-color: #fff
  border: 1px solid #fff

.mt-30
  margin-top: 30px
</style>
