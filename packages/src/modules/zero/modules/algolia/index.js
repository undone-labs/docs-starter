// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Path from 'path'
import Fs from 'fs'
import { loadNuxtConfig } from '@nuxt/kit'
import AlgoliaSearch from 'algoliasearch'
import MarkdownParser from 'kramed'
import { parse as NodeHtmlParser } from 'node-html-parser'

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


// /////////////////////////////////////////////////// parseMarkdownStringToJson
const parseMarkdownStringToJson = (fileName, string) => {
  const sections = []
  const parsedMarkdown = MarkdownParser(string)
  const parsedHtml = NodeHtmlParser(parsedMarkdown, {
    blockTextElements: {
      code: true
    }
  })
  const nodes = parsedHtml.childNodes
  const len = nodes.length
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  let heading = unslugify(fileName)
  let compiled = {}
  if (!headings.includes(nodes[0].rawTagName)) {
    compiled = { [heading]: '' }
  }
  for (let i = 0; i < len; i++) {
    const node = nodes[i]
    if (headings.includes(node.rawTagName)) {
      heading = node.textContent
      compiled[heading] = ''
    } else if (node.textContent && node.textContent !== '') {
      compiled[heading] += node.textContent
    }
  }
  Object.keys(compiled).forEach(key => {
    sections.push({
      heading: key,
      content: compiled[key]
    })
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
const compileDirContentForAlgoliaIndexing = (contentDirectoryName) => {
  const records = []
  walk(Path.resolve(__dirname, `../../../../docs/${contentDirectoryName}`), contentDirectoryName, file => {
    const filePath = file.path
    if (file.ext === '.md') {
      const sections = parseMarkdownStringToJson(
        file.name,
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

// //////////////////////////////////////////////////////////////////////// sync
const sync = async () => {
  const nuxtConfig = await loadNuxtConfig()
  if (!nuxtConfig.algolia.disable) {
    try {
      await createAlgoliaIndex(
        nuxtConfig,
        compileDirContentForAlgoliaIndexing(nuxtConfig.algolia.contentDirectoryName)
      )
    } catch (e) {
      console.log('================================ syncContentDirOnFileChange')
      console.log(e)
    }
  }
}; sync()

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  components: [
    { path: Path.resolve(__dirname, 'components/search-button.vue'), name: 'ZeroAlgoliaSearchButton' },
    { path: Path.resolve(__dirname, 'components/modal.vue'), name: 'ZeroAlgoliaModal' },
    { path: Path.resolve(__dirname, 'components/results.vue'), name: 'ZeroAlgoliaResults' }
  ],
  stores: [
    { path: Path.resolve(__dirname, 'stores/index.js'), name: 'useZeroAlgoliaStore' }
  ]
}
