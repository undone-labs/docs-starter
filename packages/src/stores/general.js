// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { ref } from '#imports'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const clipboard = ref(false)
const theme = ref('light')
const activeUrlHash = ref(false)
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
const compileMagellanLinks = (headings) => {
  magellanLinks.value = headings.reduce((acc, item) => {
    acc.push({
      level: `level-${item.localName}`,
      hash: `#${item.id}`,
      text: item.textContent
    })
    return acc
  }, [])
}

// //////////////////////////////////////////////////////// setSearchModalActive
const setSearchModalActive = () => {
  searchModalActive.value = !searchModalActive.value
}

// //////////////////////////////////////////////////////////////// setClipboard
// const setClipboard = (text) => {
//   this.$addTextToClipboard(text)
//   commit('SET_CLIPBOARD', text)
// }

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useGeneralStore = defineStore('general', () => ({
  // ----- state
  clipboard,
  theme,
  activeUrlHash,
  magellanLinks,
  searchModalActive,
  // ----- actions
  setTheme,
  setActiveUrlHash,
  compileMagellanLinks,
  setSearchModalActive
}))
