import Path from 'path'

function getNuxtConfig () {
  try {
    return require(Path.resolve(__dirname, '../docs/data/nuxt.config.js'))
  } catch {
    return require(Path.resolve(__dirname, 'docs-base/data/nuxt.config.js'))
  }
}

export default defineNuxtConfig(getNuxtConfig())
