console.log('📦 [module] doczilla')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Fs from 'fs-extra'

import {
  defineNuxtModule,
  createResolver,
  extendPages,
  addComponent
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
  Fs.copy(contentSrcDirPath, docsDirPath)
}

// ////////////////////////////////////////// registerTargetDirWithContentModule
const registerTargetDirWithContentModule = (nuxt) => {
  const sources = nuxt.options.content.sources || {}
  nuxt.options.content.sources = Object.assign(sources, {
    docs: {
      driver: 'fs',
      prefix: '/docs', // All contents inside this source will be prefixed with `/docs`
      base: resolve(nuxt.options.vite.root, 'docs')
    }
  })
  console.log(nuxt.options.content)
}

// ////////////////////////////////////////////////////////// registerComponents
const registerComponent = (submodule, components) => {
  if (!components) { return }
  components.forEach((component) => {
    addComponent({
      name: component.name,
      filePath: resolve(submodule, 'components', component.file)
    })
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
    // const content = compileContent(nuxt, contentPath)
    // // console.log(content)
    // // const manifest =
    // content.forEach((pages) => {
    //   // console.log(section)
    //   pages.forEach((page) => {
    //     console.log(page)
    //     registerRoute(nuxt, page, contentPath)
    //   })
    // })

    // console.log(content)
    // const submodules = Fs.readdirSync(modulePath)
    // const len = submodules.length
    // for (let i = 0; i < len; i++) {
    //   const submodule = submodules[i]
    //   const path = `${modulePath}/${submodule}`
    //   if (Fs.statSync(path).isDirectory()) {
    //     const config = await import(`${path}/index.js`)
    //     registerPlugins(submodule, config.plugins)
    //     registerStores(submodule, config.stores)
    //     registerComponents(submodule, config.components)
    //   }
    // }
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
