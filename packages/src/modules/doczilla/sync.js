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

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////// deleteTargetDir
const deleteTargetDir = () => {
  const path = Path.resolve(__dirname, '../../docs')
  if (Fs.existsSync(path)) {
    Fs.removeSync(path)
  }
}

// /////////////////////////////////////////////////////// copySrcDirToTargetDir
const copySrcDirToTargetDir = () => {
  const contentSrcDirPath = Path.resolve(__dirname, '../../../docs')
  const docsDirPath = Path.resolve(__dirname, '../../docs')
  Fs.copySync(contentSrcDirPath, docsDirPath)
}

// ////////////////////////////////////////////// syncContentDirWhenOnFileChange
(function syncContentDirWhenOnFileChange () {
  deleteTargetDir()
  copySrcDirToTargetDir()
})()
