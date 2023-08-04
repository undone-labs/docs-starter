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
    src: '../../../theme',
    dest: '../../assets/scss/theme'
  }
]

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
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
const copySrcDirToTargetDir = () => {
  for (let i = 0; i < packages.length; i++) {
    const contentSrcDirPath = Path.resolve(__dirname, packages[i].src)
    const destDirPath = Path.resolve(__dirname, packages[i].dest)
    Fs.copySync(contentSrcDirPath, destDirPath)
  }
}

// ////////////////////////////////////////////// syncContentDirWhenOnFileChange
(function syncContentDirWhenOnFileChange () {
  console.log('hit')
  deleteTargetDir()
  copySrcDirToTargetDir()
})()
