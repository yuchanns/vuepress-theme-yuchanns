<template>
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
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="stylus" scoped>
@import "~@theme/styles/common.styl"

.icon--arrow
  font-size 7px

.home
  &__first-card
    @media (max-width $max-tablet)
      margin-bottom 30px
  &see-more
    &.row
      margin-top 50px


.card-title__text
  @media (max-width $min-large)
    font-size 1rem
    line-height 1rem

.card
  &.box-default
    padding-bottom 0

  &-cover
    width 100%
    height 150px
    margin-bottom 20px

    &__image
      width 100%
      object-fit cover

      &--top
        height 150px

  &__box1
    width 100%
    min-width 120px

  &-category
    &__link
      display inline-block
      margin-bottom 10px

  &-title
    display block
    height 60px

  &--cover-top
    .card-title
      height 84px

  &-info
    &.row
      border-top .5px solid $borderColor

      .column
        padding 0

    &__item
      display inline-flex

    &.column
      padding-left 15px!important

  &-readmore
    position relative
    right 4px
    display block
    text-align right

    &__icon
      margin-left 6px

    &__text
      text-transform uppercase

    &:hover
      .card-readmore__icon
        animation-name arrow
        animation-duration .5s
        animation-timing-function ease-out
        animation-iteration-count infinite

  &-readmore
  &-readtime
  &-timeago
    font-size $smallText
    color $textLightColor
    padding 16px 0

@keyframes arrow {
  0% { left: 0px }
  50% { left: 6px }
  100% { left: -5px }
}

.section-more
  border-top 1px solid $borderColor

.more-posts
.more-sidebar
  padding-top 30px
  padding-bottom 30px

  &.column
    padding-right 30px
  
  &__list
    margin-top 30px

.more-sidebar
  @media (min-width $max-tablet)
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
