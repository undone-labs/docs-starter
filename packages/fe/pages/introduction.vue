<template>
  <div :class="`page page-${tag} container`">

    <div class="grid">
      <div class="col-3">
        <Sidebar />
      </div>
      <div class="col-9">
        <div class="page-content">

          <MarkdownParser :markdown="markdown" />

          <MagellanMenu :links="magellanLinks" />

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
import MagellanMenu from '@/components/magellan-menu'

import IndexPageData from '@/content/pages/index.json'
import IndexPageContent from '@/content/markdown/index.md'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    Sidebar,
    MarkdownParser,
    MagellanMenu
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
    },
    magellanLinks () {
      const regex = /(?<=#{2})[\w \p{P}]+(?=\n)/gu
      const headings = this.markdown.match(regex).map((heading) => {
        const sectionName = heading.toLowerCase()
          .replace(/\p{P}/gu, '') // Remove punctuation
          .replace(/[^\w]/g, '-')
          .replace(/--+/g, '-') // Replace multiple - with single -
          .replace(/^-+/, '') // Trim - from start of text
          .replace(/-+$/, '') // Trim - from end of text
        return {
          text: heading,
          id: sectionName
        }
      })
      return headings
    }
  }

}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-index {
  position: relative;
  margin-top: $siteHeaderHeight;
}

.page-content {
  position: relative;
  width: 100%;
  display: flex;
  margin: 3.75rem 0 2rem 0;
}

</style>
