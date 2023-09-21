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

const zeroPlugins = [
  { path: resolve('plugins/seo.js'), name: 'seo' }
]

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////// registerPlugins
const registerPlugins = (plugins) => {
  if (!plugins) { return }
  plugins.forEach((plugin) => {
    addPlugin(plugin.path)
  })
}

// ////////////////////////////////////////////////////////// registerComponents
const registerComponents = (components) => {
  if (!components) { return }
  components.forEach((component) => {
    addComponent({
      name: component.name,
      filePath: component.path
    })
  })
}

// ////////////////////////////////////////////////////////////// registerStores
const registerStores = (stores) => {
  if (!stores) { return }
  stores.forEach((store) => {
    addImports({
      name: store.name,
      from: store.path
    })
  })
}

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = async () => {
  const modulePath = `${resolve()}/components`
  const submodules = Fs.readdirSync(modulePath)
  const len = submodules.length
  for (let i = 0; i < len; i++) {
    const submodule = submodules[i]
    const path = `${modulePath}/${submodule}`
    if (Fs.statSync(path).isDirectory()) {
      const config = await import(`${path}/index.js`)
      registerPlugins(config.plugins)
      registerStores(config.stores)
      registerComponents(config.components)
    }
  }
  registerPlugins(zeroPlugins)
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtModule({
  meta,
  setup
})
