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
              <router-link to="/test" class="header-top-logo__link">
                <img itemprop="logo"
                  :src="$site.themeConfig.favicon"
                  height="47px"
                  width="50px"
                  alt="Blog yuchanns'Atelier">
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
      <main class="container main">
        <div class="page home">
          <div class="row">
            <div class="home__first-card column md-50">
              <article class="card box-default card--cover-top">
                <div class="card__box1 card__box1--top">
                  <header>
                    <div class="card-category">
                      <router-link to="/test" class="card-category__link">
                        <span class="bullet no_bw"></span>
                        <span class="meta-text">Golang</span>
                      </router-link>
                    </div>
                    <div class="card-cover">
                      <router-link to="/test">
                        <picture>
                          <img
                            src="/golang-study.jpeg"
                            alt="go语言学习笔记"
                            class="card-cover__image card-cover__image--top cover">
                        </picture>
                      </router-link>
                    </div>
                    <router-link to="/test" class="card-title">
                      <h2 class="card-title__text">Go语言学习笔记</h2>
                    </router-link>
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
                      <router-link to="/test" class="card-readmore">
                        <span class="card-readmore__text">see post</span>
                        <span class="icon card-readmore__icon icon--arrow">arrow</span>
                      </router-link>
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
                          <router-link to="/test" class="card-category__link">
                            <span class="bullet no_bw"></span>
                            <span class="meta-text">算法</span>
                          </router-link>
                          <router-link to="/test" class="card-title">
                            <h2 class="card-title__text">茴字的四种写法-KMP算法</h2>
                          </router-link>
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
                          <router-link to="/test" class="card-readmore">
                            <span class="card-readmore__text">see post</span>
                            <span class="icon card-readmore__icon icon--arrow">arrow</span>
                          </router-link>
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
                          <router-link to="/test" class="card-category__link">
                            <span class="bullet no_bw"></span>
                            <span class="meta-text">swoole</span>
                          </router-link>
                          <router-link to="/test" class="card-title">
                            <h2 class="card-title__text">协程下的mysql连接池实现分析</h2>
                          </router-link>
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
                          <router-link to="/test" class="card-readmore">
                            <span class="card-readmore__text">see post</span>
                            <span class="icon card-readmore__icon icon--arrow">arrow</span>
                          </router-link>
                        </div>
                      </aside>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
          <section class="row section-more home__see-more">
            <div class="column more-posts sm-100 md-67">
              <h3>More posts</h3>
              <ul class="more-posts__list">
                <li class="more-posts__item">
                  <h2>another article</h2>
                </li>
              </ul>
            </div>
            <div class="column more-sidebar sm-100 md-33">
              <div class="sidebar">
                <div class="sidebar__categories">
                  <h3 class="meta-text meta-text--primary">Categories</h3>
                  <nav class="categories">
                    <ul class="categories__list">
                      <li class="categories__item">
                        <router-link to="/test" class="categories__link">
                          <span class="bullet no_bw bullet--small"></span>
                          <span class="meta-text">Golang</span>
                        </router-link>
                      </li>
                      <li class="categories__item">
                        <router-link to="/test" class="categories__link">
                          <span class="bullet no_bw bullet--small"></span>
                          <span class="meta-text">算法</span>
                        </router-link>
                      </li>
                      <li class="categories__item">
                        <router-link to="/test" class="categories__link">
                          <span class="bullet no_bw bullet--small"></span>
                          <span class="meta-text">swoole</span>
                        </router-link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer class="footer">
        <div class="footer-box1">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1366 161" class="footer-box__shape"><path d="M-11.925-4809v-154.746c40.454,19.75,273.683,130.936,420.544,142.612,161.25,12.821,339.978-42.709,521.543-86.3,169.82-40.769,395.43,29.2,423.912,38.429v60Z" transform="translate(11.926 4970)"></path></svg>
        </div>
        <div class="footer-box2">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1366 246" class="footer-box__shape"><path d="M-1505.5-4725.5v-238.1c8.149-3.133,18.138-5.059,29.672-5.9h30.954c201.21,11.667,696.6,224.535,855.572,236.458,205.129,15.385,287.179-164.1,432.047-175.625a42.381,42.381,0,0,1,16.756,1.857V-4725.5Z" transform="translate(1506 4971)"></path></svg>
          <ul class="footer-social__list">
            <li class="footer-social__item">
              <a href="https://www.github.com/yuchanns"
                target="_blank" 
                rel="noopener external"
                title="Follow me on Github">
                  <span class="icon footer-social__icon">github</span>
                </a>
            </li>
          </ul>
        </div>
        <section class="footer-box3">
          <div class="row">
            <div class="column sm-50 footer-card">
              <div class="observer observer--displayed">
                <div class="spinner observer__spinner observer__spinner--hide"></div>
                <div itemscope="itemscope" itemtype="https://schema.org/Person" class="card-author box-default footer__card-author card-author--no-shadow">
                  <div class="row">
                    <div class="column xs-33">
                      <img
                        :src="$site.themeConfig.personalInfo.avatar"
                        itemprop="image"
                        class="card-author__avatar">
                    </div>
                    <div class="column xs-67 card-author-info">
                      <div class="card-author-info__role">
                        <span class="bullet no_bw bullet--primary bullet--undefined"></span>
                        <span itemprop="jobTitle" class="meta-text">
                          {{$site.themeConfig.personalInfo.class}}
                        </span>
                        <router-link to="/test"   
                          class="card-author__link"
                          itemprop="url">
                          <h3 itemprop="name" class="card-author-info__title">{{$site.themeConfig.personalInfo.name}}</h3>
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column sm-50 footer-nav"></div>
            <div class="column sm-100 footer-copy"></div>
          </div>
        </section>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="stylus">
@import '~@theme/styles/config.styl'

@font-face {
  font-family: 'ktquez'
  src:  url('../fonts/icons/ktquez.eot?5awxug')
  src:  url('../fonts/icons/ktquez.eot?5awxug#iefix') format('embedded-opentype'),
    url('../fonts/icons/ktquez.ttf?5awxug') format('truetype'),
    url('../fonts/icons/ktquez.woff?5awxug') format('woff'),
    url('../fonts/icons/ktquez.svg?5awxug#ktquez') format('svg')
  font-weight: normal
  font-style: normal
}

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

.footer
  position relative
  overflow hidden

  &-nav
    padding-right 4vw!important
    z-index 6
  
  &-copy
    color #fff
    font-size 11px
    text-align right
    padding-top 50px
    padding-right 4vw!important

  &-card
    position relative

  &__card-author
    position relative
    z-index 6
    margin-left 8px
    margin-right 8px

  &-box1
  &-box2
  &-box3
    position relative

  &-box1
    height 175px
    top 4px

    .footer-box__shape
      fill $secondFooterColor

  &-box2
    height 250px
    background-color $secondFooterColor
    bottom -2px

    .footer-box__shape
      fill $firstFooterColor

  &-box3
    background-color $firstFooterColor
    padding 50px 0
  
  &-box
    &__shape
      position absolute 
      bottom 0
      left 0

  &-social
    &__list
      display inline-block
      margin-top 8%
      margin-left 30px
      z-index 2
      position relative

    &__item
      display inline
      margin-right 16px
      color #fff

    &__icon
      color #fff
      font-size 2rem

.observer
  position relative
  height 100%
  min-height 200px

  &--displayed
    min-height auto

  &__spinner
    position absolute
    top 50%
    left 50%auto
    transform translate(-50%,-50%)
    z-index 1
    transition visibility .5s 1s,opacity .5s 1s
    &--hide
      opacity 0
      visibility hidden

.spinner
  width 60px
  height 60px

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

  &.xs-67
    flex 0 0 66.66667%
    max-width 66.66667%

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
    &.sm-50
      flex 0 0 50%
      max-width 50%
    &.sm-60
      flex: 0 0 60%
      max-width: 60%
    &.sm-100
      flex: 0 0 100%
      max-width: 100%

@media (min-width: 48rem)
  .column
    flex: 1

    &.md-33
      flex 0 0 33.33333%
      max-width 33.33333%

    &.md-50
      flex: 0 0 50%
      max-width: 50%
    &.md-67
      flex 0 0 66.66667%
      max-width: 66.66667%

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

.icon
[class*=icon-]
  font-family: ktquez!important
  position: relative
  speak: none
  font-style: normal 
  font-weight: 400
  font-variant: normal 
  text-transform: none 
  line-height 1
  letter-spacing 0

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

  &--small 
    width 6px
    height 6px

.bullet
  background-color: $primaryColor

.meta-text
  font-size: $smallText
  text-transform: uppercase
  font-weight: 400

  &--primary
    color $primaryColor

.card
  display: flex

  &-author
    position relative
    max-height 150px
    max-width 500px
    &--no-shadow
      &.box-default
        box-shadow none
    &__avatar
      width 100%
      max-width 120px
      max-height 120px
      border-radius 50%

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

    &.column
      padding-left 15px!important

  &-readmore
    position: relative
    right: 4px
    display: block
    text-align: right

    &__icon
      margin-left: 6px

    &__text
      text-transform: uppercase

    &:hover
      .card-readmore__icon
        animation-name: arrow
        animation-duration: .5s
        animation-timing-function: ease-out
        animation-iteration-count: infinite

  &-readmore
  &-readtime
  &-timeago
    font-size: $smallText
    color: $textLightColor
    padding: 16px 0

@keyframes arrow {
  0% { left: 0px }
  50% { left: 6px }
  100% { left: -5px }
}

.box-default
  border-radius: 20px
  padding: 16px 20px
  box-shadow: 1px 1px 99px $shadowColor
  background-color: #fff
  border: 1px solid #fff

.mt-30
  margin-top: 30px

.home__see-more
  &.row
    margin-top 50px

.section-more
  border-top: 1px solid $borderColor

.more-posts
.more-sidebar
  padding-top 30px
  padding-bottom 30px

  &.column
    padding-right 30px
  
  &__list
    margin-top 30px

@media (min-width: 768px)
  .more-sidebar
    border-left 1px solid $borderColor

.sidebar
  padding-top 50px

  &__categories
    .categories
      margin-top 10px

.categories
  &__item
    margin-bottom 2px

  &__link
    display block
    padding 6px 0
    .bullet
      margin-right 4px
      top -1px
</style>
