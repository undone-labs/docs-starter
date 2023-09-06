console.log('📦 [module] @undone-labs/nuxt-module-zero-components')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Fs from 'fs'

import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addImports,
  addComponent
} from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// ////////////////////////////////////////////////////////////////////// Config
// -----------------------------------------------------------------------------
const meta = {
  name: '@undone-labs/nuxt-module-zero-components',
  configKey: 'nuxtModuleZeroComponents',
  compatibility: {
    nuxt: '^3.0.0'
  }
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////// registerPlugins
const registerPlugins = (submodule, plugins) => {
  if (!plugins) { return }
  plugins.forEach((plugin) => {
    addPlugin(resolve(`${submodule}/plugins/${plugin.file}`))
  })
}

// ////////////////////////////////////////////////////////// registerComponents
const registerComponents = (submodule, components) => {
  if (!components) { return }
  components.forEach((component) => {
    addComponent({
      name: component.name,
      filePath: resolve(`${submodule}/components/${component.file}`)
    })
  })
}

// ////////////////////////////////////////////////////////////// registerStores
const registerStores = (submodule, stores) => {
  stores.forEach((store) => {
    addImports({
      name: store.name,
      from: resolve(`${submodule}/stores/${store.file}`)
    })
  })
}

// //////////////////////////////////////////////////////////////////// runHooks
const runHooks = (nuxt) => {
  nuxt.hook('content:context', (contentContext) => {
    contentContext.transformers.push(resolve('nuxt-content-transformers/output-raw-markdown.js'))
  })
}

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = async (options, nuxt) => {
  const modulePath = `${resolve()}/components`
  const submodules = Fs.readdirSync(modulePath)
  const len = submodules.length
  for (let i = 0; i < len; i++) {
    const submodule = submodules[i]
    const path = `${modulePath}/${submodule}`
    if (Fs.statSync(path).isDirectory()) {
      const config = await import(`${path}/index.js`)
      registerPlugins(`components/${submodule}`, config.plugins)
      registerStores(`components/${submodule}`, config.stores)
      registerComponents(`components/${submodule}`, config.components)
    }
  }
  runHooks(nuxt)
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtModule({
  meta,
  setup
})
