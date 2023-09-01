/**
 * The "npm run dev" script also fires off a nodemon watcher script →
 * nodemon --watch ../docs -e md,vue --exec node src/modules/doczilla/sync.js.
 * sync.js watches .md and .vue files in the docs repo package. When changes
 * are detected, sync.js replaces the entire \@/src/docs directory with the
 * \@/docs directory
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Path = require('path')
const Fs = require('fs-extra')

// /////////////////////////////////////////////////////////////////// Variables
// -----------------------------------------------------------------------------
const packages = [
  {
    src: '../../../docs',
    dest: '../../docs'
  },
  {
    src: '../../../themes',
    dest: '../../assets/scss/theme'
  }
]

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const getConfig = async () => {
  const kit = await import('@nuxt/kit')
  return kit.loadNuxtConfig()
}

// ///////////////////////////////////////////////////////////// deleteTargetDir
const deleteTargetDir = () => {
  for (let i = 0; i < packages.length; i++) {
    const path = Path.resolve(__dirname, packages[i].dest)
    if (Fs.existsSync(path)) {
      Fs.removeSync(path)
    }
  }
}

// /////////////////////////////////////////////////////// copySrcDirToTargetDir
const copySrcDirToTargetDir = (nuxtConfig) => {
  for (let i = 0; i < packages.length; i++) {
    let contentSrcDirPath
    if (packages[i].src.endsWith('/themes')) {
      const overrideTheme = nuxtConfig.overrideTheming ? nuxtConfig.overrideTheming.themeName : ''
      const theme = overrideTheme &&
        Fs.existsSync(Path.resolve(__dirname, `${packages[i].src}/${overrideTheme}`)) ?
        overrideTheme : 'default'
      contentSrcDirPath = Path.resolve(__dirname, `${packages[i].src}/${theme}`)
    } else {
      contentSrcDirPath = Path.resolve(__dirname, packages[i].src)
    }
    const destDirPath = Path.resolve(__dirname, packages[i].dest)
    Fs.copySync(contentSrcDirPath, destDirPath)
  }
}

// ////////////////////////////////////////////// syncContentDirWhenOnFileChange
(async function syncContentDirWhenOnFileChange () {
  const nuxtConfig = await getConfig()
  deleteTargetDir()
  copySrcDirToTargetDir(nuxtConfig)
})()
