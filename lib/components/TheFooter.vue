<template>
  <footer class="footer">
    <div class="footer-box1">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1366 161" class="footer-box__shape"><path d="M-11.925-4809v-154.746c40.454,19.75,273.683,130.936,420.544,142.612,161.25,12.821,339.978-42.709,521.543-86.3,169.82-40.769,395.43,29.2,423.912,38.429v60Z" transform="translate(11.926 4970)"></path></svg>
    </div>
    <div class="footer-box2">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1366 246" class="footer-box__shape"><path d="M-1505.5-4725.5v-238.1c8.149-3.133,18.138-5.059,29.672-5.9h30.954c201.21,11.667,696.6,224.535,855.572,236.458,205.129,15.385,287.179-164.1,432.047-175.625a42.381,42.381,0,0,1,16.756,1.857V-4725.5Z" transform="translate(1506 4971)"></path></svg>
      <ul class="footer-social__list">
        <li class="footer-social__item" v-if="github">
          <a 
            :href="github.link"
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
                      {{$site.themeConfig.personalInfo.jobTitle}}
                    </span>
                  </div>
                  <router-link to="/test"   
                    class="card-author__link"
                    itemprop="url">
                    <h3 itemprop="name" class="card-author-info__title">{{$site.themeConfig.personalInfo.nickname}}</h3>
                  </router-link>
                  <div class="card-author-info__joined">
                    <span class="icon">enter</span>
                    <span class="text">Joined {{ distance }}</span>
                    <span 
                      itemprop="alternateName"
                      class="text meta-text--primary">
                      ({{ totalPosts }} Posts)
                    </span>
                  </div>
                  <div class="card-author-social">
                    <ul class="card-author-social__list">
                      <li class="card-author-social__item" 
                        v-if="twitter">
                        <a
                          itemprop="sameAs"
                          :href="twitter.link"
                          rel="nofollow noopener"
                          target="_blank"
                          class="card-author-social__link">
                            <span class="icon card-author-social__icon icon-twitter">twitter</span>
                          </a>
                      </li>
                      <li class="card-author-social__item" 
                        v-if="github">
                        <a
                          itemprop="sameAs"
                          :href="github.link"
                          rel="nofollow noopener"
                          target="_blank"
                          class="card-author-social__link">
                            <span class="icon card-author-social__icon icon-github">github</span>
                          </a>
                      </li>
                      <li class="card-author-social__item"
                        v-if="site">
                        <a
                          itemprop="sameAs"
                          :href="site.link"
                          rel="nofollow noopener"
                          target="_blank"
                          class="card-author-social__link">
                            <span class="icon card-author-social__icon icon-site">site</span>
                          </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="watermark-logo"></div>
          </div>
        </div>
        <div class="column sm-50 footer-nav">
          <div class="row justify-right">
            <div class="column xs-50 sm-40 md-33 footer-nav__box footer-nav__box--1">
              <h2 class="meta-text title">{{$site.title}}</h2>
              <nav class="footer-nav1">
                <ul>
                  <li class="footer-nav1__item">
                    <router-link to="/test">ABOUT</router-link>
                  </li>
                  <li class="footer-nav1__item">
                    <router-link to="/test">CATEGORIES</router-link>
                  </li>
                  <li class="footer-nav1__item">
                    <router-link to="/test">CONTACT</router-link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div class="column sm-100 footer-copy">
          {{ year }} © {{$site.title}} - <a href="https://vuepress.vuejs.org/">MADE WITH VUEPRESS</a>
        </div>
      </div>
      <span class="shapes shapes--circle" style="left: 3%; top: -20%"></span> <span class="shapes shapes--primary shapes--color3" style="left: 30%; top: -15%"></span> <span class="shapes shapes--primary" style="left: 13%; top: -80%; transform: rotate(45deg)"></span> <span class="shapes shapes--circle shapes--color4" style="left: 40%; top: 200px"></span> <span class="shapes shapes--primary" style="left: 15%; bottom: 10%; transform: rotate(75deg)"></span> <span class="shapes shapes--circle shapes--color3" style="right: 50%; top: 30%"></span> <span class="shapes shapes--primary" style="right: 20%; top: -100%"></span> <span class="shapes shapes--circle" style="right: 10%; top: -20%"></span> <span class="shapes shapes--color4" style="right: 35%; top: -20%; transform: rotate(45deg)"></span> <span class="shapes shapes--circle" style="left: 40%; top: -50%"></span> <span class="shapes shapes--color3" style="right: 30%; top: 20%"></span> <span class="shapes shapes--circle shapes--primary" style="right: 30%; bottom: 20%"></span>
    </section>
  </footer>
</template>

<script>
import { formatDistance, parseISO } from 'date-fns'

export default {
  name: 'TheFooter',
  
  computed: {
    totalPosts () {
      return this.$site.pages.length
    },
    year () {
      return new Date().getFullYear()
    },
    distance () {
      return formatDistance(
        parseISO(this.$themeConfig.personalInfo.joined),
        new Date(),
        { addSuffix: true }
      )
    },
    github () {
      return this.$themeConfig.personalInfo.sns.github || false
    },
    twitter () {
      return this.$themeConfig.personalInfo.sns.twitter || false
    },
    site () {
      return this.$themeConfig.personalInfo.sns.site || false
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "~@theme/styles/common.styl"

.icon
  &-twitter
    &:hover
      color #1da1f2
  &-github
    &:hover
      color #239a3b
  &-site
    &:hover
      color $primaryColor

.footer
  position relative
  overflow hidden

  &-copy
    color #fff
    font-size 11px
    text-align right
    padding-top 50px
    padding-right 4vw
    a:hover
      color #3eaf7c

  &-nav
    padding-right 4vw
    z-index 6
    @media (max-width $mobile)
      order 1
    .title
      color #fff
      font-weight 700
      font-size $mediumText
    &__box
      text-align right
      &--1.column
        @media (max-width $mobile)
          text-align left
          padding-left 5vw
  &-nav1
  &-nav2
    margin-top 10px
    &__item
      font-size $smallText
      color #fff
      a
        float right
        display block
        width 85%
        padding 6px 4px
        margin-bottom 3px
        &:hover
          text-decoration underline
          color #fff
  &-nav1
    &__item
      a
        @media (max-width $mobile)
          float left
  
  &-copy
    color #fff
    font-size 11px
    text-align right
    padding-top 50px
    padding-right 4vw
    @media (max-width $mobile)
      order 3
      text-align center
      padding-top 10px

  &-card
    position relative
    @media (max-width $mobile)
      order 2
      margin 40px 0

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
    @media (min-width $min-xlarge)
      height 249px

    .footer-box__shape
      fill $secondFooterColor

  &-box2
    height 250px
    background-color $secondFooterColor
    bottom -2px

    @media (max-width $mobile)
      height 110px

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
      @media (max-width $mobile)
        position relative
        left 50%
        margin-top 5%
        transform translateX(-50%)

    &__item
      display inline
      margin-right 16px
      color #fff

    &__icon
      color #fff
      font-size 2rem

.card-author
    position relative
    max-height 150px
    max-width 500px
    &__link
      &:hover
        color $primaryColor
    &--no-shadow
      &.box-default
        box-shadow none
    &__avatar
      width 100%
      max-width 120px
      max-height 120px
      border-radius 50%
    &-info
      &__joined
        color $textColor
        font-size $mediumText
        margin-top 2px
        .icon
          top 5px
          font-size $regularText
          color #000
        .text
          font-size $smallText
      &.column
        padding-left 15px!important
    &-social
      &__list
        margin-left -12px
      &__item
        display inline-flex
        margin-right 2px
      &__link
        padding 8px 10px
      &__icon
        font-size $title3

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

.watermark-logo
  position absolute
  top -150px
  left -30px
  width 472px
  height 429px
  background-image url(/watermark-logo.png)
  background-size cover
  background-repeat no-repeat
  z-index 5

.row.justify-right
  justify-content flex-end

.shapes
  position absolute
  width 20px
  height 20px
  border-style solid
  border-width 1px
  border-color #fff
  z-index 1
  
  &--circle
    border-radius 50%
  &--color3
    border-color $color3
  &--color4
    border-color $color4
  &--primary
    border-color $primaryColor
</style>