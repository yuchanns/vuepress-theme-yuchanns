<template>
  <main>
    <div class="container-xl clearfix px-3 mt-4">
      <div class="col-12 float-md-left pl-md-2">
        <div class="position-relative">
          <div class="d-lg-flex gutter-lg mt-4">
            <div class="col-lg-12">
              <div class="position-relative d-md-flex flex-wrap flex-justify-between flex-items-center border-bottom border-gray-dark pb-3">
                <h2 class="h6 text-uppercase">home</h2>
              </div>
              <div
                v-for="page in $pagination.pages"
                :key="page.key"
                class="col-12 d-block width-full py-4 border-bottom">
                <div class="d-inline-block mb-1">
                  <h3>
                    <router-link :to="page.path">
                      {{ page.title }}
                    </router-link>
                  </h3>
                </div>
                <div class="float-right">
                  <div class="d-linline-block">
                    <router-link :to="page.path">
                      <button class="btn btn-sm">
                        <tags
                          type="eye"
                          class="mr-1"/>
                        <span class="text-capitalize">watch</span>
                      </button>
                    </router-link>
                  </div>
                </div>
                <div class="py-1">
                  <p class="d-inline-block col-9 text-gray pr-4" itemprop="description">
                    {{ page.excerpt | stripTags }}
                  </p>
                </div>
                <div class="f6 text-gray mt-2">
                  <router-link :to="$categories._metaMap[page.frontmatter.category].path" class="ml-0 mr-3 muted-link">
                    <span class="category-color"></span>
                    <span class="category">{{ page.frontmatter.category }}</span>
                  </router-link>
                  <router-link
                    :to="$tags._metaMap[tag].path"
                    class="muted-link"
                    v-for="(tag, key) in page.frontmatter.tags" :key="key">
                    <tags type="tags" />
                    <span class="tags">{{ tag }}</span>
                  </router-link>
                  Created {{ page.frontmatter.date | formatDate }}
                </div>
              </div>
              <Pagination />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { formatDistanceToNow, parseISO } from 'date-fns'
import Tags from '@theme/components/icons/Tags'
import Pagination from '@theme/components/Pagination'

export default {
  name: 'Home',

  components: {
    Tags,
    Pagination
  },

  filters: {
    stripTags (value) {
      const regex = /(<([^>]+)>)/ig
      return value.replace(regex, '')
    },
    formatDate (value) {
      return formatDistanceToNow(parseISO(value), {
        addSuffix: true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  &-xl
    max-width 852px
    margin-right auto
    margin-left auto

.px-3
  padding-right 16px
  padding-left 16px

.ml-0
  margin-left 0

.mr
  &-1
    margin-right 4px
  &-3
    margin-right 16px

.muted-link
  color #586069

.category-color
  position relative
  top 1px
  display inline-block
  width 12px
  height 12px
  border-radius 50%
  background-color #00ADD8

.tags
  margin-right 5px
.mt
  &-2
    margin-top 8px
  &-4
    margin-top 24px

.mb-1
  margin-bottom 4px

.col
  &-lg-12
    @media (min-width 1012px)
      width 100%
  &-9
    width 75%
  &-12
    width 100%

.float
  &-md-left
    @media (min-width 768px)
      float left
  &-right
    float right

.btn
  color #242910
  background-color #eff3f6
  background-image linear-gradient(-180deg,#fafbfc,#eff3f6 90%)
  position relative
  display inline-block
  font-weight 600
  white-space nowrap
  vertical-align middle
  user-select none
  background-repeat repeat-x
  background-position -1px -1px
  background-size 110% 110%
  border 1px solid rgba(27,31,35,.2)
  border-radius .25rem
  cursor pointer

  &:hover
    background-color #e6ebf1
    background-image linear-gradient(-180deg,#f0f3f6,#e6ebf1 90%)
    background-position -.5em
    border-color rgba(27,31,35,.35)
    text-decoration: none
    background-repeat: repeat-x

  &-sm
    padding 3px 10px
    font-size 12px
    line-height 20px

.pl
  &-md-2
    @media (min-width 768px)
      padding-left 8px

.pr-4
  padding-right 24px

.position-relative
  position relative

.width
  &-full
    width 100%

.py
  &-1
    padding-top 4px
    padding-bottom 4px
  &-4
    padding-top 24px
    padding-bottom 24px

.f6
  font-size 12px

.d
  &-block
    display block
  &-inline-block
    display inline-block
  &-md-flex
    @media (min-width 768px)
      display flex
  &-lg-flex
    @media (min-width 1012px)
      display flex

.pb-3
  padding-bottom 16px

.flex
  &-items-center
    align-items center
  &-justify-between
    justify-content space-between
  &-wrap
    flex-wrap wrap

.border
  &-gray-dark
    border-color #d1d5da
  &-bottom
    border-bottom 1px solid #e1e4e8

.gutter-lg
  @media (min-width 1012px)
    margin-left -16px
    margin-right -16px
    &>[class*=col-]
      padding-left 16px
      padding-right 16px

.text-uppercase
  text-transform uppercase

.text-capitalize
  text-transform capitalize

.h6
  font-weight 600
  font-size 12px

.text-normal
  font-weight 400
</style>
