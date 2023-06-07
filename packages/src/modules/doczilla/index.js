console.log('📦 [module] doczilla')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Fs from 'fs-extra'

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
// ///////////////////////////////////////////////////////////// deleteTargetDir
const deleteTargetDir = (nuxt) => {
  const path = resolve(nuxt.options.vite.root, 'docs')
  if (Fs.existsSync(path)) {
    Fs.removeSync(path)
  }
}

// /////////////////////////////////////////////////////// copySrcDirToTargetDir
const copySrcDirToTargetDir = (nuxt) => {
  const packageRootPath = nuxt.options.vite.root
  const contentSrcDirPath = resolve(packageRootPath, '../docs')
  const docsDirPath = resolve(packageRootPath, 'docs')
  Fs.copySync(contentSrcDirPath, docsDirPath)
}

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

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = (options, nuxt) => {
  try {
    const contentPath = resolve(nuxt.options.vite.root, '../docs/content')
    if (!Fs.existsSync(contentPath)) { throw new Error('❗️<content> directory is missing') }
    deleteTargetDir(nuxt)
    copySrcDirToTargetDir(nuxt)
    registerTargetDirWithContentModule(nuxt)
    registerTargetDirComponents(nuxt)
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
