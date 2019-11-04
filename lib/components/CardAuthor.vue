<template>
  <div class="card-author card-author--no-shadow">
    <div class="row">
      <div class="column xs-33">
        <img
          :src="$site.themeConfig.personalInfo.avatar"
          itemprop="image"
          class="card-author__avatar">
      </div>
      <div class="column xs-67 card-author-info">
        <div class="card-author-info__role">
          <Bullet type="primary" />
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
</template>

<script>
import Bullet from '@theme/components/Bullet'
import { formatDistance, parseISO } from 'date-fns'
import SocialMixin from '@theme/mixins/Social'

export default {
  name: 'CardAuthor',

  mixins: [SocialMixin],

  components: {
    Bullet
  },

  props: {
    totalPosts: {
      type: Number,
      default: 0
    },
    joined: {
      type: String,
      default: '2019-01-01'
    }
  },

  computed: {
    distance () {
      return formatDistance(
        parseISO(this.joined),
        new Date(),
        { addSuffix: true }
      )
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "~@theme/styles/config.styl"

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
</style>