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
  let level = dir.split(split).pop().slice(1)
  level = level === '' ? 0 : level.split('/').length
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
        levelPath: dir.split(split).pop(),
        topLevelSlug: dir.split(split).pop().slice(1).split('/')[0],
        parentSlug: dir.split(split).pop().slice(1).split('/').pop()
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
            `${fileLevelPath}/${fileName}#${slugify(section.heading)}` :
            `${fileLevelPath}#${slugify(section.heading)}?${file.name}`,
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
    const index = client.initIndex(nuxtConfig.algolia.indexName)
    await index.setSettings({
      searchableAttributes: [
        'sidebarHeading', 'entryName', 'entrySection', 'content'
      ]
    })
    const objectIDs = await index.saveObjects(records)
    console.log('The following records have been added/updated to the Algolia index:')
    console.log(objectIDs)
  } catch (e) {
    console.log('========================================== createAlgoliaIndex')
    throw e
  }
}

// ////////////////////////////////////////////////// syncContentDirOnFileChange
async function syncContentDirOnFileChange () {
  deleteTargetDir()
  copySrcDirToTargetDir()
  const nuxtConfig = require(Path.resolve(__dirname, '../../nuxt.config.content.js'))
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
syncContentDirOnFileChange()
