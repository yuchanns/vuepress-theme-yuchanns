<template>
  <div
    class="layout-main"
    itemscope="itemscope"
    itemtype="https://schema.org/WebPage">
    <div class="container-fluid wrapper-body__nm">
      <TheHeader />
      <TheMain />
      <TheFooter />
    </div>
  </div>
</template>

<script>
import TheHeader from '@theme/components/TheHeader'
import TheMain from '@theme/components/TheMain'
import TheFooter from '@theme/components/TheFooter'

export default {
  name: "vuepress-theme-yuchanns",

  components: {
    TheHeader,
    TheMain,
    TheFooter
  }
}
</script>

<style lang="stylus">
@import "~@theme/styles/common.styl"

.layout-main
  >.container-fluid
    background-color: $bgColor

.container
.container *
.container-fluid
.container-fluid *
.container-fluid:after
.container-fluid :after
.container-fluid:before
.container-fluid :before
.container:after
.container :after
.container:before
.container :before
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
  @media (max-width $mobile)
    padding 0
</style>