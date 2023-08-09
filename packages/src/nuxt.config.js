// /////////////////////////////////////////////////////////// Variables & Setup
// -----------------------------------------------------------------------------
const env = process.env.SERVER_ENV

const baseUrls = {
  development: 'https://localhost',
  stable: '',
  production: ''
}

const frontendPort = 10040

const seo = {
  siteName: 'Docs Starter',
  description: 'Get a docs site up and running fast 🚀'
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtConfig({
  // ///////////////////////////////////////////////////// Runtime Configuration
  // ---------------------------------------------------------------------------
  runtimeConfig: {
    public: {
      siteUrl: env === 'development' ? `${baseUrls[env]}:${frontendPort}` : baseUrls[env],
      serverFlag: env,
      seo: {
        siteName: seo.siteName
      }
    }
  },
  // ////////////////////////////////////////////////////////// Server & Bundler
  // ---------------------------------------------------------------------------
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // make SCSS variables, functions and mixins globally accessible
          additionalData: '@import "@/assets/scss/settings.scss";'
        }
      }
    },
    assetsInclude: ['**/*.md']
  },
  // //////////////////////////////////////////////////////////////// Dev Server
  // ---------------------------------------------------------------------------
  devServer: {
    port: frontendPort,
    host: process.env.NODE_ENV !== 'development' ? '0.0.0.0' : 'localhost',
    ...(process.env.NODE_ENV === 'development' && {
      https: {
        key: '../../localhost_key.pem',
        cert: '../../localhost_cert.pem'
      }
    })
  },
  // /////////////////////////////////////////////////////////////////////// App
  // ---------------------------------------------------------------------------
  app: {
    // -------------------------------------------------------------------- head
    head: {
      title: seo.siteName,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { /* hid: 'description', */ name: 'description', content: seo.description }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon-96x96.png' }
      ]
    }
  },
  // ////////////////////////////////////////////////////////////// Auto-imports
  // ---------------------------------------------------------------------------
  imports: {
    dirs: ['stores']
  },
  // ///////////////////////////////////////////////////////////// Global Styles
  // ---------------------------------------------------------------------------
  css: [
    '@/assets/scss/main.scss'
  ],
  // /////////////////////////////////////////////////////////////////// Modules
  // ---------------------------------------------------------------------------
  modules: [
    '@pinia/nuxt',
    '@/modules/eslint-nuxt3-globals',
    '@nuxtjs/eslint-module',
    '@/modules/doczilla',
    '@nuxt/content',
    '@/modules/zero-components',
    'nuxt-simple-robots', // https://github.com/harlan-zw/nuxt-simple-robots
    'nuxt-simple-sitemap', // https://github.com/harlan-zw/nuxt-simple-sitemap
    '@nuxtjs/algolia'
  ],
  // ////////////////////////////////////////////////////// [Module] @pinia/nuxt
  // ---------------------------------------------------------------------------
  pinia: {
    autoImports: [
      'defineStore' // import { defineStore } from 'pinia'
    ]
  },
  // //////////////////////////////////////////////////// [Module] @nuxt/content
  // ---------------------------------------------------------------------------
  content: {
    watch: false,
    ignores: [
      '.+\\.vue'
    ]
  },
  // ////////////////////////////////////////////////////////// [Module] sitemap
  // ---------------------------------------------------------------------------
  sitemap: {},
  // ////////////////////////////////////////////////// [Module] @nuxtjs/algolia
  // ---------------------------------------------------------------------------
  algolia: {
    apiKey: process.env.ALGOLIA_API_KEY,
    applicationId: process.env.ALGOLIA_APPLICATION_ID,
    instantSearch: {
      theme: 'algolia'
    }
    // docSearch: {
    //   indexName: 'test_DOCS',
    // }
  }
})
