<template>

  <div
    ref="markdown"
    class="markdown"
    v-html="parsed" />

</template>

<script>
// ===================================================================== Imports
import Kramed from 'kramed'
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'MarkdownParser',

  props: {
    markdown: { // unprocessed markdown
      type: String,
      required: true
    }
  },

  data () {
    return {
      renderer: false,
      headings: [],
      baseURL: false,
      textCopied: 'Copied!',
      textNotCopied: 'Click to copy link'
    }
  },

  computed: {
    ...mapGetters({
      clipboard: 'general/clipboard'
    }),
    parsed () {
      return Kramed(this.markdown, { renderer: this.renderer })
    }
  },

  created () {
    this.renderer = new Kramed.Renderer()
    // /////////////////////////////////////////////////////////////////// Links
    this.renderer.link = function (href, title, text) {
      const split = text.split('||')
      const len = split.length
      let attributeString = ''
      if (len > 1) {
        try {
          const attributes = JSON.parse(split[1].replace(/&quot;/g, '"'))
          if (typeof attributes === 'object') {
            Object.keys(attributes).forEach((key) => {
              attributeString += `${key}="${attributes[key]}" `
            })
          }
        } catch (e) {
          return `<a href="${href}">${split[0]}</a>`
        }
      }
      return `<a href="${href}" ${attributeString}>${split[0]}</a>`
    }
    // //////////////////////////////////////////////////////////////// Headings
    this.renderer.heading = function (text, level) {
      const escapedText = text.toLowerCase()
        .replace(/&#\d+;/g, '') // Remove parsed unicode decimal codes
        .replace(/[^\w]/g, '-')
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
      return `
        <h${level} id="${escapedText}" class="section-title">
          <a
            class="heading-anchor"
            href="#${escapedText}">
          </a>
          ${text}
        </h${level}>
      `
    }
  },

  mounted () {
  },

  methods: {
  }
}
</script>
