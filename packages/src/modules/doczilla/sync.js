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
const AlgoliaSearch = require('algoliasearch')

require('dotenv').config({ path: `${__dirname}/../../.env` })

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
      const overrideTheme = nuxtConfig.overrideTheming.themeName
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

// ///////////////////////////////////////// compileDirContentForAlgoliaIndexing
const compileDirContentForAlgoliaIndexing = () => {
  const records = []
  const dirContents = Fs.readdirSync(Path.resolve(__dirname, '../../../docs/content'), { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
  for (let i = 0; i < dirContents.length; i++) {
    const subdir = dirContents[i]
    const files = Fs.readdirSync(Path.resolve(__dirname, `../../../docs/content/${subdir.name}`), { withFileTypes: true })
    const mdFiles = files.filter(file => Path.extname(file.name).toLowerCase() === '.md')
    for (let j = 0; j < mdFiles.length; j++) {
      const filename = mdFiles[j].name
      const fileContents = Fs.readFileSync(Path.resolve(__dirname, `../../../docs/content/${subdir.name}/${filename}`), 'utf8')
      const entry = filename.split('.md')[0]
      const sections = parseMarkdownStringToJson(fileContents)
      sections.forEach((section) => {
        records.push({
          objectID: `${subdir.name}/${entry}#${slugify(section.heading)}`,
          sidebarHeading: unslugify(subdir.name, 'capitalize-all'),
          entryName: unslugify(entry, 'capitalize-all'),
          entrySection: section.heading,
          content: section.content
        })
      })
    }
  }
  return records
}

// ////////////////////////////////////////////////////////// createAlgoliaIndex
const createAlgoliaIndex = async (records) => {
  const client = AlgoliaSearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY)
  const index = client.initIndex('test_DOCS')
  index.setSettings({
      searchableAttributes: [
        'sidebarHeading', 'entryName', 'entrySection', 'content'
      ]
    }).then(() => {
      index.saveObjects(records).then(({ objectIDs }) => {
        console.log('The following records have been added/updated to the Algolia index:')
        console.log(objectIDs)
      }).catch((e) => {
        console.log('============================ [Function: createAlgoliaIndex]')
        console.log(e)
      })
    })
}

// ////////////////////////////////////////////// syncContentDirWhenOnFileChange
(async function syncContentDirWhenOnFileChange () {
  const nuxtConfig = await getConfig()
  deleteTargetDir()
  copySrcDirToTargetDir(nuxtConfig)
  const records = compileDirContentForAlgoliaIndexing()
  await createAlgoliaIndex(records)
})()
