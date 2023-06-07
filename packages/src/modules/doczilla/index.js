console.log('📦 [module] doczilla')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Fs from 'fs-extra'

import {
  defineNuxtModule,
  createResolver,
  extendPages
  // addPlugin,
  // addImports,
  // addComponent
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

// const plugins = ['index', 'fetch-auth']
// const stores = [
//   { slug: 'zero-button', name: 'useZeroButtonStore' }
// ]

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////// registerPlugins
// const registerPlugins = (submodule, plugins) => {
//   if (!plugins) { return }
//   plugins.forEach((plugin) => {
//     addPlugin(resolve(`${submodule}/plugins/${plugin.file}`))
//   })
// }

// ////////////////////////////////////////////////////////////// compileContent
const compileContent = (nuxt, contentPath) => {
  const sections = Fs.readdirSync(contentPath)
  const len = sections.length
  const compiled = []
  for (let i = 0; i < len; i++) {
    const section = sections[i]
    const parsedName = section.split('-').map(word => (word.charAt(0).toUpperCase() + word.slice(1)))
    const sectionPath = resolve(`${contentPath}/${section}`)
    const entries = Fs.readdirSync(sectionPath)
    const pages = entries.reduce((acc, entry) => {
      const split = entry.split('.')
      const slug = split[0]
      const ext = split[1]
      if (!acc.hasOwnProperty(slug)) { acc[slug] = {} }
      if (ext === 'md') {
        acc[slug].name = `${section}-${slug}`
        acc[slug].path = `/${section}/${slug}`
      } else {
        acc[slug].component = `DoczillaPreview${slug.split('-').map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join('.')}`
      }
      return acc
    }, {})
    compiled.push(Object.values(pages))
  }
  return compiled
}

// /////////////////////////////////////////////////////////////// registerRoute
const registerRoute = (nuxt, page, contentPath) => {
  extendPages((pages) => {
    console.log(`${nuxt.options.vite.root}/pages/[...slug].vue`)
    pages.push({
      name: page.name,
      path: page.path,
      file: resolve(`${nuxt.options.vite.root}/pages/[...slug].vue`),
      payload: 'asd'
    })
  })
}

// ////////////////////////////////////////////////////////// registerComponents
// const registerComponent = (submodule, components) => {
//   if (!components) { return }
//   components.forEach((component) => {
//     addComponent({
//       name: component.name,
//       filePath: resolve(`${submodule}/components/${component.file}`)
//     })
//   })
// }

// ///////////////////////////////////////////////////////////// deleteTargetDir
const deleteTargetDir = (nuxt) => {
  const path = resolve(`${nuxt.options.vite.root}/docs`)
  if (Fs.existsSync(path)) {
    Fs.removeSync(path)
  }
}

// ///////////////////////////////////////////////////// copySrcDirToTargetDir
const copySrcDirToTargetDir = (nuxt) => {
  const packageRootPath = nuxt.options.vite.root
  const contentSrcDirPath = resolve(`${packageRootPath}/../docs`)
  const docsDirPath = resolve(`${packageRootPath}/docs`)
  Fs.copy(contentSrcDirPath, docsDirPath)
}

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = (options, nuxt) => {
  try {
    deleteTargetDir(nuxt)
    copySrcDirToTargetDir(nuxt)
    // const contentPath = resolve(`${nuxt.options.vite.root}/../src/content`)
    // if (!Fs.existsSync(contentPath)) { throw new Error('❗️<content> directory is missing') }
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
