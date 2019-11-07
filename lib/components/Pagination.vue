<template>
  <div class="pagination-container" v-if="$pagination.hasPrev || $pagination.hasNext">
    <div class="btnGroup">
      <router-link
        :to="$pagination.prevLink"
        class="btn btn-outline btnGroup-item"
        v-if="$pagination.hasPrev">
        Previous
      </router-link>
      <button
        class="btn btn-outline btnGroup-item"
        disabled
        v-else>
        Previous
      </button>
      <router-link
        :to="$pagination.nextLink"
        class="btn btn-outline btnGroup-item"
        v-if="$pagination.hasNext">
        Next
      </router-link>
      <button 
        class="btn btn-outline btnGroup-item"
        disabled
        v-else>
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination'
}
</script>

<style lang="stylus" scoped>
.pagination-container
  margin-top 20px
  margin-bottom 15px
  text-align center

.btn
  position relative
  display inline-block
  padding 6px 12px
  font-size 14px
  font-weight 600
  line-height 20px
  white-space nowrape
  vertical-align middle
  user-select none
  background-repeat repeat-x
  background-size 110% 110%
  border 1px solid rgba(27,31,35,.2)
  &:hover
    background-color #e6ebf1
    background-image linear-gradient(-180deg,#f0f3f6,#e6ebf1 90%)
    background-position -.5em
    border-color rgba(27,31,35,.35)
    text-decoration: none
    background-repeat: repeat-x
  &.disabled
  &:disabled
    color rgba(36,41,46,.4)
    background-color #eff3f6
    background-image none 
    border-color rgba(27,31,35,.2)
    box-shadow none
    cursor default
    background-position 0 0
  &-outline
    color #0366d6
    background-color #fff
    background-image none
    &:hover
      color #fff
      background-color #0366d6
      background-image none 
      border-color #0366d6
    &.disabled
    &:disabled
      color rgba(27,31,35,.3)
      background-color #fff
      border-color rgba(27,31,35,.15)
      box-shadow none

.btnGroup
  display inline-block
  vertical-align middle
  &:hover
    border-right-width 1px
  &-item
    position relative
    float left
    border-right-width 0
    border-radius 0
    &:first-child
      border-top-left-radius 3px
      border-bottom-left-radius 3px
    &:last-child
      border-right-width 1px;
      border-top-right-radius 3px
      border-bottom-right-radius 3px
</style>