// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineTransformer } from '@nuxt/content/transformers'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineTransformer({
  name: 'output-raw-markdown',
  extensions: ['.md'],
  parse (_id, rawContent) {
    return {
      _id,
      body: rawContent
    }
  }
})
