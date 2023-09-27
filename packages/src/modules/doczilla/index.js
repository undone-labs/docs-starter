console.log('📦 [module] doczilla')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir
} from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// ////////////////////////////////////////////////////////////////////// Config
// -----------------------------------------------------------------------------
const meta = {
  name: 'doczilla',
  configKey: 'nuxtModuleDoczilla',
  compatibility: {
    nuxt: '^3.0.0'
  }
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////// registerTargetDirWithContentModule
const registerTargetDirWithContentModule = (nuxt) => {
  if (!nuxt.options.hasOwnProperty('content')) {
    nuxt.options.content = {}
  }
  const sources = nuxt.options.content.sources || {}
  nuxt.options.content.sources = Object.assign(sources, {
    docs: {
      driver: 'fs',
      prefix: '/docs', // All contents inside this source will be prefixed with `/docs`
      base: resolve(nuxt.options.vite.root, 'docs')
    }
  })
}

// ///////////////////////////////////////////////// registerTargetDirComponents
const registerTargetDirComponents = (nuxt) => {
  addComponentsDir({
    path: resolve(nuxt.options.vite.root, 'docs/content'),
    pathPrefix: false,
    prefix: 'Doczilla',
    global: true
  })
}

// ///////////////////////////////////////////////// registerTargetDirComponents
const registerCustomComponents = (nuxt) => {
  addComponentsDir({
    path: resolve(nuxt.options.vite.root, 'docs/components'),
    pathPrefix: false,
    prefix: 'Doczilla',
    global: true
  })
}

// ///////////////////////////////////////////// addEntriesToPublicRuntimeConfig
const addEntriesToPublicRuntimeConfig = (nuxt) => {
  const algolia = nuxt.options.algolia
  nuxt.options.runtimeConfig.public.algolia.indexName = algolia.indexName
  nuxt.options.runtimeConfig.public.algolia.disable = algolia.disable || false
}

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = (_, nuxt) => {
  try {
    registerTargetDirWithContentModule(nuxt)
    registerTargetDirComponents(nuxt)
    registerCustomComponents(nuxt)
    addEntriesToPublicRuntimeConfig(nuxt)
  } catch (e) {
    console.log('\n')
    console.log(e)
    process.exit(0)
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtModule({
  meta,
  setup
})
