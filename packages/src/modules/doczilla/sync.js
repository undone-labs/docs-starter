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
const dirs = [
  {
    src: '../../../docs', // need this parent entry to delete entire @/src/docs dir before adding child dirs
    dest: '../../docs',
    children: [
      {
        src: '../../../docs/components',
        dest: '../../docs/components'
      },
      {
        src: '../../../docs/content',
        dest: '../../docs/content'
      }
    ]
  },
  {
    src: '../../../docs/data',
    dest: '../../data'
  },
  {
    src: '../../../docs/theme',
    dest: '../../assets/scss/theme'
  }
]

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////// deleteTargetDir
const deleteTargetDir = () => {
  dirs.forEach((dir) => {
    const path = Path.resolve(__dirname, dir.dest)
    if (Fs.existsSync(path)) {
      Fs.removeSync(path)
    }
  })
}

// /////////////////////////////////////////////////////// copySrcDirToTargetDir
const copySrcDirToTargetDir = () => {
  dirs.forEach((dir) => {
    const src = Path.resolve(__dirname, dir.src)
    const dest = Path.resolve(__dirname, dir.dest)
    const children = dir.children
    if (!children) {
      Fs.copySync(src, dest)
    } else {
      children.forEach((childDir) => {
        Fs.copySync(
          Path.resolve(__dirname, childDir.src),
          Path.resolve(__dirname, childDir.dest)
        )
      })
    }
    // if (package.src.endsWith('/themes')) {
    //   const overrideTheme = nuxtConfig.overrideTheming.themeName
    //   const theme = overrideTheme && Fs.existsSync(Path.resolve(__dirname, `${package.src}/${overrideTheme}`)) ? overrideTheme : 'default'
    //   contentSrcDirPath = Path.resolve(__dirname, `${package.src}/${theme}`)
    // }
  })
}

// ////////////////////////////////////////////////// syncContentDirOnFileChange
(async function syncContentDirOnFileChange () {
  deleteTargetDir()
  copySrcDirToTargetDir()
})()
