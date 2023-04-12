<template>
  <div :class="`page page-${tag} container`">

    <div class="grid">
      <div class="col-3">
        <Sidebar />
      </div>
      <div class="col-9">
        content!
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Sidebar from '@/components/sidebar'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    Sidebar
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
  margin-top: $siteHeaderHeight;
}

.container {
  position: relative;
}

// //////////////////////////////////////////////////////////////////////// Hero

// ///////////////////////////////////////////////////////////////////////// FAQ
</style>
