<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->

    <h1> it's the page! </h1>

    <!-- ========================================================== Overlays -->

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
  },

  data () {
    return {
      tag: 'index'
    }
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent[this.tag].page_content
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-index {
  position: relative;
  overflow: hidden;
}

.container {
  position: relative;
}

// //////////////////////////////////////////////////////////////////////// Hero

// ///////////////////////////////////////////////////////////////////////// FAQ
</style>
