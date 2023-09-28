/**
 * The "npm run dev" script also fires off a nodemon watcher script →
 * nodemon modules/doczilla/sync.js --watch <entry> -e <extension>.
 * sync.js watches .md, .vue, .json and .scss files in the docs repo package.
 * When changes are detected, sync.js replaces the entire respective directories
 * listed below.
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Path = require('path')
const Fs = require('fs-extra')

require('dotenv').config({ path: `${__dirname}/../../.env` })

// /////////////////////////////////////////////////////////////////// Variables
// -----------------------------------------------------------------------------
const dirsToDelete = [
  '../../docs',
  '../../data',
  '../../assets/scss/theme'
]

const dirsToCopy = [
  {
    src: '../../../docs/components',
    dest: '../../docs/components',
    base: { // if directory doesn't exist, use base data
      src: '../../docs-base/components',
      dest: '../../docs/components'
    }
  },
  {
    src: '../../../docs/content',
    dest: '../../docs/content',
    base: { // if directory doesn't exist, use base data
      src: '../../docs-base/content',
      dest: '../../docs/content'
    }
  },
  {
    src: '../../../docs/theme',
    dest: '../../assets/scss/theme',
    base: { // if directory doesn't exist, use base data
      src: '../../docs-base/theme',
      dest: '../../assets/scss/theme'
    }
  },
  {
    src: '../../../docs/data',
    dest: '../../data',
    base: { // if directory doesn't exist, use base data
      src: '../../docs-base/data',
      dest: '../../data'
    }
  },
  {
    src: '../../../docs/public',
    dest: '../../public/public',
    base: { // if directory doesn't exist, use base data
      src: '../../docs-base/public',
      dest: '../../public/public'
    }
  }
]

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////////// deleteTargetDirs
const deleteTargetDirs = () => {
  dirsToDelete.forEach((dir) => {
    const path = Path.resolve(__dirname, dir)
    if (Fs.existsSync(path)) {
      Fs.removeSync(path)
    }
  })
}

// /////////////////////////////////////////////////////// copySrcDirToTargetDir
const copySrcDirToTargetDir = () => {
  dirsToCopy.forEach((dir) => {
    let src = Path.resolve(__dirname, dir.src)
    let dest = Path.resolve(__dirname, dir.dest)
    if (!Fs.existsSync(src) && dir.hasOwnProperty('base')) {
      src = Path.resolve(__dirname, dir.base.src)
      dest = Path.resolve(__dirname, dir.base.dest)
    }
    if (Fs.existsSync(src)) {
      Fs.copySync(src, dest)
    }
  })
}

// ////////////////////////////////////////////////// syncContentDirOnFileChange
async function syncContentDirOnFileChange () {
  deleteTargetDirs()
  copySrcDirToTargetDir()
}
syncContentDirOnFileChange()
