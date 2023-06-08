// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { resolve } from 'path'

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
          // make SCSS variables globally accessible
          additionalData: '@import "@/assets/scss/variables.scss";'
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
    '~/modules/doczilla/index.js',
    '@nuxt/content',
    '~/modules/zero-components/index.js',
    'nuxt-simple-sitemap'
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
    watch: false
  },
  // ////////////////////////////////////////////////////////// [Module] sitemap
  // ---------------------------------------------------------------------------
  sitemap: {
    xls: false
  }
})
