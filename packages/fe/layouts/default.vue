<template>
  <div class="main-container">

    <SiteHeader />

    <nuxt />

    <SiteFooter />

  </div>
</template>

<script>
// ===================================================================== Imports

import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'

// ====================================================================== Export
export default {
  name: 'LayoutDefault',

  components: {
    SiteHeader,
    SiteFooter
  },

  async created () {
    await this.$store.dispatch('general/getBaseData', 'general')
  },

  mounted () {
    // Scroll to hash
    this.$nextTick(() => {
      const hash = this.$route.hash.replace('#', '')
      if (hash) {
        const element = document.getElementById(hash) || document.querySelector(`[data-id='${hash}']`)
        if (element) {
          this.$scrollToElement(element, 200, -100)
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
