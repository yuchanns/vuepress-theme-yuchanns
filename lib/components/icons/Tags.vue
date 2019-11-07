<template>
  <svg class="octicon" :class="`octicon-${type}`" :viewBox="svg.viewBox" version="1.1" :width="svg.height" :height="svg.height" aria-hidden="true"><path fill-rule="evenodd" :d="svg.d"></path></svg>
</template>

<script>
export default {
  name: 'Tags',

  props: {
    type: {
      type: String,
      default: undefined
    }
  },

  computed: {
    svg () {
      let view = []
      if (this.type == 'tags') {
        view['viewBox'] = '0 0 14 16'
        view['width'] = '14'
        view['height'] = '16'
        view['d'] = 'M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z'
      } else if (this.type == 'eye') {
        view['viewBox'] = '0 0 16 16'
        view['width'] = '16'
        view['height'] = '16'
        view['d'] = 'M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z'
      }
      return view
    }
  }
}
</script>

<style lang="stylus" scoped>
.octicon
  vertical-align text-bottom
  display inline-block
  fill currentColor
</style>