<template>
  <div>
    <TransitionFadeSlide>
      <DefaultGlobalLayout />
    </TransitionFadeSlide>
  </div>
</template>

<script>
import TransitionFadeSlide from '@theme/components/TransitionFadeSlide.vue'
import GlobalLayout from '@app/components/GlobalLayout.vue'

export default {
  name: 'TheMain',

  components: {
    DefaultGlobalLayout: GlobalLayout,
    TransitionFadeSlide
  }
}
</script>
