<template>
  <div :class="`page page-${tag} container`">

    <div class="grid">
      <div class="col-3">
        <Sidebar />
      </div>
      <div class="col-9">
        <div class="page-content">

          <MarkdownParser :markdown="markdown" />

        </div>
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Sidebar from '@/components/sidebar'
import MarkdownParser from '@/components/markdown-parser'

import IndexPageData from '@/content/pages/index.json'
import IndexPageContent from '@/content/markdown/index.md'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    Sidebar,
    MarkdownParser
  },

  data () {
    return {
      tag: 'index'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
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
    },
    markdown () {
      return IndexPageContent
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

</style>
