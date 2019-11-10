<template>
  <div class="footer container-lg width-full p-responsive">
    <div class="position-relative d-flex flex-row-reverse flex-lg-row flex-lg-nowrap flex-justify-center flex-lg-justify-between pt-6 pb-2 mt-6 f6 text-gray border-top border-gray-light">
      //
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>

<style lang="stylus" scoped>
.container
  &-lg
    margin-right auto 
    margin-left auto
    max-width 1012px

.p-responsive
  padding-right 16px
  padding-left 16px
  @media (min-width 544px)
    padding-right 40px
    padding-left 40px
  @media (min-width 1012px)
    padding-right 16px
    padding-left 16px
</style>
