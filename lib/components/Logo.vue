<template>
  <router-link to="/">
    <img itemprop="logo"
      :src="$site.themeConfig.logo"
      height="47px"
      width="50px"
      alt="$site.title">
  </router-link>
</template>

<script>
export default {
  name: 'Logo'
}
</script>