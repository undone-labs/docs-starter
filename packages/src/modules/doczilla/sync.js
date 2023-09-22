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
const AlgoliaSearch = require('algoliasearch')

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
// /////////////////////////////////////////////////////////////////// unslugify
const unslugify = (slug, type = 'capitalize-first-character') => {
  if (type === 'capitalize-first-character') {
    const string = slug.toString().replace(/-/g, ' ')
    return string.charAt(0).toUpperCase() + string.substring(1)
  } else if (type === 'capitalize-all') {
    return slug.toString()
      .split('-')
      .map(a => a.charAt(0).toUpperCase() + a.substring(1))
      .join(' ')
  } else if (type === 'no-capitals') {
    return slug.toString().replace(/-/g, ' ')
  } else {
    return 'Incompatible "Type" specified. Must be type "capitalize-first-character", "capitalize-all" or "no-capitals". Default is "capitalize-first-character"'
  }
}

// ///////////////////////////////////////////////////////////////////// slugify
const slugify = (text, type = 'dash') => {
  if (type === 'dash') {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  } else if (type === 'underscore') {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '_') // Replace spaces with _
      .replace(/[^\w_]+/g, '') // Remove all non-word chars
      .replace(/__+/g, '_') // Replace multiple _ with single _
      .replace(/^_+/, '') // Trim _ from start of text
      .replace(/_+$/, '') // Trim _ from end of text
  } else if (type === 'underscore-no-trim') {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '_') // Replace spaces with _
      .replace(/[^\w_]+/g, '') // Remove all non-word chars
      .replace(/__+/g, '_') // Replace multiple _ with single _
  } else {
    return 'Incompatible "Type" specified. Must be type "dash", "underscore", or "underscore-no-trim". Default is "dash"'
  }
}

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

// /////////////////////////////////////////////////// parseMarkdownStringToJson
const parseMarkdownStringToJson = (string) => {
  const lines = string.split(/[\r\n]+/)
  const sections = []
  let entry
  lines.forEach((line) => {
    if (line.startsWith('#')) {
      sections.push({
        heading: line.replaceAll('#', '').trim(),
        content: ''
      })
      entry = sections.length
    } else if (sections.length) {
      sections[entry - 1].content = sections[entry - 1].content + line
    }
  })
  return sections
}

// //////////////////////////////////////////////////////////////////////// walk
const walk = (dir, split, next) => {
  let levelPath = dir.split(split)
  levelPath = levelPath.length === 2 ? levelPath.pop().slice(1) : `${split}${levelPath.pop()}`
  const level = levelPath === '' ? 0 : levelPath.split('/').length
  Fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {
    const dirPath = Path.join(dir, file.name)
    const isDirectory = Fs.statSync(dirPath).isDirectory()
    if (level >= 3) {
      console.error('‼️ Content can only be nested 2 directories deep. ‼️')
      process.exit(0)
    }
    isDirectory ?
      walk(dirPath, split, next) :
      next({
        path: Path.join(dir, file.name),
        name: file.name.split('.md')[0],
        ext: Path.extname(file.name).toLowerCase(),
        level,
        levelPath: levelPath,
        topLevelSlug: levelPath.split('/')[0],
        parentSlug: levelPath.split('/').pop()
      })
  })
}

// ///////////////////////////////////////// compileDirContentForAlgoliaIndexing
const compileDirContentForAlgoliaIndexing = () => {
  const records = []
  walk(Path.resolve(__dirname, '../../docs/content'), 'content', file => {
    const filePath = file.path
    if (file.ext === '.md') {
      const sections = parseMarkdownStringToJson(
        Fs.readFileSync(filePath, 'utf-8')
      )
      const topLevelSlug = file.topLevelSlug
      const parentSlug = file.parentSlug
      const fileLevelPath = file.levelPath
      const fileName = file.name
      sections.forEach(section => {
        records.push({
          objectID: file.level < 2 ?
            `/${fileLevelPath}/${fileName}#${slugify(section.heading)}` :
            `/${fileLevelPath}#${slugify(section.heading)}?${file.name}`,
          sidebarHeading: unslugify(topLevelSlug, 'capitalize-all'),
          entryName: unslugify(
            file.level < 2 ? fileName : parentSlug,
            'capitalize-all'
          ),
          entrySection: section.heading,
          content: section.content
        })
      })
    }
  })
  return records
}

// ////////////////////////////////////////////////////////// createAlgoliaIndex
const createAlgoliaIndex = async (nuxtConfig, records) => {
  try {
    const client = AlgoliaSearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY)
    const indexName = nuxtConfig.algolia.indexName
    const index = client.initIndex(indexName)
    await index.setSettings({
      searchableAttributes: [
        'sidebarHeading', 'entryName', 'entrySection', 'content'
      ]
    })
    const objectIDs = await index.saveObjects(records)
    console.log(`The following records have been added/updated to Algolia index [${indexName}]:`)
    console.log(objectIDs)
  } catch (e) {
    console.log('========================================== createAlgoliaIndex')
    throw e
  }
}

// ////////////////////////////////////////////////// syncContentDirOnFileChange
async function syncContentDirOnFileChange () {
  deleteTargetDirs()
  copySrcDirToTargetDir()
  const nuxtConfig = require(Path.resolve(__dirname, '../../data/nuxt.config.js'))
  if (!nuxtConfig.algolia.disable) {
    try {
      await createAlgoliaIndex(
        nuxtConfig,
        compileDirContentForAlgoliaIndexing()
      )
    } catch (e) {
      console.log('================================== syncContentDirOnFileChange')
      console.log(e)
    }
  }
}
syncContentDirOnFileChange()
