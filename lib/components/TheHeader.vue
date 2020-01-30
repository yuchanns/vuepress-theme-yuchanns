<template>
  <div class="position-relative">
    <header class="Header flex-wrap flex-lg-nowrap Details p-responsive">
      <div class="Header-item d-none d-lg-flex">
        <router-link
          to="/"
          class="Header-link">
          <img :src="$themeConfig.logo" height="32" width="32" v-if="$themeConfig.logo">
            <Tags
              type="mark-github"
              class="v-align-middle"
              width="32"
              height="32"
              v-else/>
        </router-link>
      </div>
      <div class="Header-item Header-item--full flex-justify-center d-lg-none position-relative">
        <router-link
          to="/"
          class="Header-link">
          <img :src="$themeConfig.logo" height="32" width="32" v-if="$themeConfig.logo">
          <Tags
            type="mark-github"
            class="v-align-middle"
            width="32"
            height="32"
            v-else/>
        </router-link>
      </div>
      <div class="Header-item Header-item--ful flex-column flex-lg-row width-full flex-order-2 flex-lg-order-none mr-0 mr-lg-3 mt-lg-0">
        <div class="header-search flex-self-stretch flex-lg-self-auto mr-0 mr-lg-3 mb-3 mb-lg-0 position-relative">
          <label class="form-control header-search-wrapper input-sm p-0 position-relative d-flex flex-justify-between flex-items-center">
            <SearchBox />
          </label>
        </div>
      </div>
      <div class="Header-item position-relative mr-0 d-none d-lg-flex">
        <details class="details-overlay details-reset">
          <summary class="Header-link" role="button">
            <img
              class="avatar"
              :src="$themeConfig.author.avatar"
              :alt="`@${$themeConfig.author.name}`">
            <span class="dropdown-caret"></span>
          </summary>
          <details-menu class="dropdown-menu dropdown-menu-sw mt-2" style="width: 180px" role="menu">
            <div class="header-nav-current-user">
              <span class="px-3 pt-2 pb-2 mb-n2 mt-n2 mt-n1 d-block">
                Owned by
                <strong class="css-truncate-target">{{ $themeConfig.author.name }}</strong>
              </span>
            </div>
            <div role="none" class="dropdown-divider"></div>
            <div class="pl-3 pr-3 pb-1">
              <img :src="$themeConfig.author.avatar" :alt="`@${$themeConfig.author.name}`" style="width:100%; height: 100%">
            </div>
            <div role="none" class="dropdown-divider"></div>
            <div class="pl-3 pr-3 f6 user-status-container pb-1">
              <div class="user-status-compact rounded-1 px-2 py-1 mt-2 border">
                <details class="details-reset details-overlay details-overlay-dark">
                  <summary>
                    <div class="d-flex">
                      <div class="d-inline-block v-align-middle css-truncate css-truncate-target user-status-message-wrapper f6"
                        style="line-height: 20px">
                        <div class="d-inline-block text-gray-dark v-align-text-top text-left">
                          <span>{{ $themeConfig.author.desc || 'Welcome' }}</span>
                        </div>
                      </div>
                    </div>
                  </summary>
                </details>
              </div>
            </div>
            <div role="none" class="dropdown-divider"></div>
            <span class="dropdown-item" v-if="'job' in $themeConfig.author">
              <tags type="briefcase" style="margin-right: 2px; margin-bottom: 2px" />
              <span>{{ $themeConfig.author.job }}</span>
            </span>
            <span class="dropdown-item" v-if="'location' in $themeConfig.author">
              <tags type="location" style="margin-right: 2px; margin-bottom: 2px" />
              <span>{{ $themeConfig.author.location }}</span>
            </span>
            <span class="dropdown-item dropdown-item-hover" v-if="'email' in $themeConfig.author">
              <tags type="email" style="margin-right: 2px; margin-bottom: 2px" />
              <a :href="`mailto:${$themeConfig.author.email}`">{{ $themeConfig.author.email }}</a>
            </span>
            <span class="dropdown-item dropdown-item-hover" v-if="'link' in $themeConfig.author">
              <tags type="link" style="margin-right: 2px; margin-bottom: 2px" />
              <a :href="`//${$themeConfig.author.link}`">{{ $themeConfig.author.link }}</a>
            </span>
          </details-menu>
        </details>
      </div>
    </header>
  </div>
</template>

<script>
import Tags from '@theme/components/icons/Tags'
import SearchBox from '@SearchBox'

export default {
  name: 'TheHeader',

  components: {
    Tags,
    SearchBox
  },
  mounted () {
    require('@github/details-menu-element')
  }
}
</script>

<style lang="stylus" scoped>
label
  font-weight 600
summary
  display list-item

details
  display block
  summary
    cursor pointer
    &::-webkit-details-marker
      display none
  &:not([open])>:not(summary)
    display none!important

img
  height 20px
  width 20px

.css-truncate
  &.css-truncate-target
    max-width 125px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap

.user-status
  &-container
    word-break break-word
    word-wrap break-word
    white-space normal
  &-message-wrapper
    color #24292e

.dropdown
  &-menu
    position absolute
    top 100%
    left 0
    z-index 100
    width 160px
    padding-top 4px
    padding-bottom 4px
    margin-top 2px
    list-style none
    background-color #fff
    background-clip padding-box
    border 1px solid rgba(27 31 35 .15)
    border-radius 4px
    box-shadow 0 1px 15px rgba(27 31 35 .15)
    &:before
    &:after
      position absolute
      display inline-block
      content ""
    &:before
      border 8px solid transparent
      border-bottom-color rgba(27 31 35 .15)
    &-sw
      right 0
      left auto
      &:before
        top -16px
        right 9px
        left auto
  &-divider
    display block
    height 0
    margin 8px 0
    border-top 1px solid #e1e4e8
  &-item
    display block
    padding 4px 8px 4px 16px
    overflow hidden
    color #24292e
    text-overflow ellipsis
    white-space nowrap
    cursor pointer
    &-hover:hover
      color #fff
      text-decoration none
      background-color #0366d6
      outline none
    a
      color inherit
      text-decoration none

.details-reset
  &>summary
    list-style none

.avatar
  display inline-block
  overflow hidden
  line-height 1
  vertical-align middle
  border-radius 3px

.dropdown-caret
  display inline-block
  width 0
  height 0
  vertical-align: middle
  content ""
  border-top-style solid
  border-top-width 4px
  border-right 4px solid transparent
  border-bottom 0 solid transparent
  border-left 4px solid transparent

.input-sm
  min-height 28px
  padding-top 3px
  padding-bottom 3px
  font-size 12px
  line-height 20px

.form-control
  min-height 34px
  padding 6px 8px
  font-size 16px
  line-height 20px
  color #24292e
  vertical-align middle
  background-color #fff
  background-repeat no-repeat
  background-position right 8px center
  border 1px solid #d1d5da
  border-radius 3px
  outline none
  box-shadow inset 0 1px 2px rgba(27 31 35 .075)

.Header
.Header-item
  align-items center
  flex-wrap nowrap

.Header
  display flex
  z-index 32
  padding 16px
  font-size 14px
  line-height 1.5
  color hsla(0 0% 100% .7)
  background-color #24292e
  &-item
    display flex
    margin-right 16px
    align-self stretch
    &--full
      flex auto
  &-link
    &:hover
      color hsla(0 0% 100% .7)
      text-decoration none
    font-weight 600
    color $white
    white-space nowrap

.header
  &-nav
    &-current-user
      padding-bottom 0
      font-size inherit
      color black
      .css-truncate-target
        max-width 100%
  &-search
    min-width 300px
    transition .2s ease-in-out
    transition-property min-width,padding-bottom,padding-top
    &-wrapper
      display table
      width 100%
      max-width 100%
      padding 0
      font-size inherit
      font-weight 400
      color #fff
      vertical-align middle
      background-color hsla(0 0% 100% .125)
      border 0
      box-shadow none
    &-input
      display table-cell
      width 100%
      padding-top 0
      padding-bottom 0
      font-size inherit
      color inherit
      background none
      border 0
      box-shadow none

.v-align
  &-text-top
    vertical-align text-top
  &-middle
    vertical-align middle

.Details
  &-content--hidden
    display none
  @media (min-width 1012px)
    display flex!important
</style>
