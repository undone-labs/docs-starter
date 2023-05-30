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

import IntroductionPageData from '@/content/pages/introduction.json'
import IntroductionPageContent from '@/content/markdown/introduction.md'

// ====================================================================== Export
export default {
  name: 'IntroductionPage',

  components: {
    Sidebar,
    MarkdownParser,
    MagellanMenu
  },

  data () {
    return {
      tag: 'introduction'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'introduction', data: IntroductionPageData })
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
      return IntroductionPageContent
    },
    magellanLinks () {
      const regex = /(?<=#{2,3})[\w \p{P} \p{S}]+(?=\n)/gu
      const heading = this.markdown.match(regex).map((heading) => {
        const sectionName = heading.toLowerCase()
          .replace(/\p{P}/gu, '') // Remove punctuation
          .replace(/[^\w]/g, '-')
          .replace(/--+/g, '-') // Replace multiple - with single -
          .replace(/^-+/, '') // Trim - from start of text
          .replace(/-+$/, '') // Trim - from end of text
        let sectionType = 'title'
        if (heading[0] === '#') {
          heading = heading.slice(1)
          sectionType = 'subtitle'
        }
        return {
          text: heading,
          id: sectionName,
          type: sectionType
        }
      })
      return heading
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-introduction {
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
