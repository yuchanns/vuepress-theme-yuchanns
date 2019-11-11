<template>
  <div>
    <img
    :src="$themeConfig.avatar"
    class="avatar avatar-before-user-status"
    height="150"
    width="150">
    <div class="user-status-container position-relative">
      <div class="f5">
        <div class="border-top-0 rounded-top-0 rounded-bottom-1 p-2 border-avatar">
          <div class="d-flex">
            <div class="pt-1 f6">
              <span>{{ $themeConfig.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Avatar'
}
</script>

<style lang="stylus" scoped>
@import '~@theme/styles/border.styl'
@import '~@theme/styles/padding.styl'
@import '~@theme/styles/display.styl'

.avatar
  display inline-block
  overflow hidden
  line-height 1
  vertical-align middle
  border-radius 3px
  &-before-user-status
    @media (min-width 768px)
      border 1px solid #e1e4e8
      border-bottom 0
      border-top-left-radius 3px
      border-top-right-radius 3px
      border-bottom-right-radius 0
      border-bottom-left-radius 0

.user-status-container
  word-break break-word
  word-wrap break-word
  white-space normal
  width 150px
  height 150px
  @media (max-width 543px)
    display none

.position-relative
  position releative

.border-avatar
  @media (min-width 768px)
    border 1px solid #e1e4e8
    border-top 0
</style>