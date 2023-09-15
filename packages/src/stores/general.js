// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { ref } from '#imports'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const clipboard = ref(false)
const theme = ref('light')
const activeUrlHash = ref(false)
const activeLinkMarkerHeight = ref(0)
const magellanLinks = ref([])
const searchModalActive = ref(false)

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////////////////// setTheme
const setTheme = (newTheme) => {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  document.documentElement.className = newTheme
}

// //////////////////////////////////////////////////////////// setActiveUrlHash
const setActiveUrlHash = (hash) => {
  activeUrlHash.value = hash
}

// //////////////////////////////////////////////////////// compileMagellanLinks
const compileMagellanLinks = () => {
  const headings = Array.from(document.querySelectorAll('#markdown *[id]'))
  magellanLinks.value = headings.reduce((acc, item) => {
    acc.push({
      level: `level-${item.localName}`,
      hash: `#${item.id}`,
      text: item.textContent
    })
    return acc
  }, [])
  return magellanLinks.value.length > 0
}

// /////////////////////////////////////////////////// setActiveLinkMarkerHeight
const setActiveLinkMarkerHeight = () => {
  const firstLinkElement = document.querySelector(`[link-hash]`)
  if (firstLinkElement) {
    activeLinkMarkerHeight.value = firstLinkElement.offsetHeight
  }
}

// //////////////////////////////////////////////////////// setSearchModalActive
const setSearchModalActive = (state) => {
  document.body.classList[state ? 'add' : 'remove']('no-scroll')
  searchModalActive.value = state
}

// //////////////////////////////////////////////////////////////// setClipboard
const setClipboard = (text) => {
  clipboard.value = text
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useGeneralStore = defineStore('general', () => ({
  // ----- state
  clipboard,
  theme,
  activeUrlHash,
  magellanLinks,
  searchModalActive,
  activeLinkMarkerHeight,
  // ----- actions
  setTheme,
  setActiveUrlHash,
  compileMagellanLinks,
  setActiveLinkMarkerHeight,
  setClipboard,
  setSearchModalActive
}))
