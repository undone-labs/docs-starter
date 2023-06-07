// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { ref } from '#imports'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const clipboard = ref(false)
const theme = ref('light')

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////////////////// setTheme
const setTheme = (newTheme) => {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  document.documentElement.className = newTheme
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
  // ----- actions
  setTheme
}))
