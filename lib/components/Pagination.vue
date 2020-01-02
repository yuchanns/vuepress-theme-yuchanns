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
  padding 6px 12px
  font-size 14px
  line-height 20px

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
