// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
require('dotenv').config({ path: `${__dirname}/../../src/.env` })

// /////////////////////////////////////////////////////////// Variables & Setup
// -----------------------------------------------------------------------------
const env = process.env.SERVER_ENV

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = {
  // ////////////////////////////////////////////////// [Module] @nuxtjs/algolia
  // ---------------------------------------------------------------------------
  algolia: {
    apiKey: process.env.ALGOLIA_API_KEY,
    applicationId: process.env.ALGOLIA_APPLICATION_ID,
    indexName: (function () {
      if (env === 'development') { return 'undone-labs__docs-starter__development' }
      return env === 'stable' ? 'undone-labs__docs-starter__stable' : 'undone-labs__docs-starter__production'
    }())
  }
}
