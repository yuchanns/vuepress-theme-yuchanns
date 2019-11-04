export default {
  computed: {
    github () {
      return this.$themeConfig.personalInfo.sns.github || false
    },
    twitter () {
      return this.$themeConfig.personalInfo.sns.twitter || false
    },
    site () {
      return this.$themeConfig.personalInfo.sns.site || false
    }
  }
}
