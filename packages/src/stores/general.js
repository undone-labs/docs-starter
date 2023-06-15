// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { ref } from '#imports'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const clipboard = ref(false)
const theme = ref('light')
const activeUrlHash = ref(false)
const magellanLinks = ref([])

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
  // const headings = Array.from(document.querySelectorAll('#markdown *[id]'))
  magellanLinks.value = headings.reduce((acc, item) => {
    acc.push({
      level: `level-${item.localName}`,
      hash: `#${item.id}`,
      text: item.textContent
    })
    return acc
  }, [])
  // console.log(magellanLinks.value)
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
  // ----- actions
  setTheme,
  setActiveUrlHash,
  compileMagellanLinks
}))
