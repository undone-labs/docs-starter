// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// import CloneDeep from 'lodash.clonedeep'
import { ref } from '#imports'
import GeneralSiteData from '@/content/pages/general.json'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const siteContent = ref({})
const staticFiles = ref({})
const clipboard = ref(false)
const theme = ref('light')

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////// getBaseData
const getBaseData = (payload) => {
  const key = typeof payload === 'string' ? payload : payload.key
  let data = false
  switch (key) {
    case 'general': data = GeneralSiteData; break
    default : data = payload.data; break
  }
  if (data) {
    siteContent.value[key] = data
  }
}

// //////////////////////////////////////////////////////////////////// setTheme
const setTheme = (newTheme) => {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
}

// ////////////////////////////////////////////////////////////// setSiteContent
// const setSiteContent = (payload) => {
//   commit('SET_SITE_CONTENT', payload)
// }
//
// // /////////////////////////////////////////////////////////////// getStaticFile
// const async = getStaticFile (path) => {
//   try {
//     const response = await this.$axiosAuth.get('/get-static-file', {
//       params: { path }
//     })
//     const file = response.data.payload
//     dispatch('setStaticFile', { path, file })
//     return file
//   } catch (e) {
//     console.log('===================== [Store Action: general/getStaticFile]')
//     console.log(e)
//     dispatch('setStaticFile', { path, file: false })
//     return false
//   }
// }
//
// // /////////////////////////////////////////////////////////////// getCachedFile
// const async = getCachedFile (path) => {
//   try {
//     const response = await this.$axiosAuth.get('/get-cached-file', {
//       params: { path }
//     })
//     const file = response.data.payload
//     dispatch('setStaticFile', { path, file })
//     return file
//   } catch (e) {
//     console.log('===================== [Store Action: general/getCachedFile]')
//     console.log(e)
//     dispatch('setStaticFile', { path, file: false })
//     return false
//   }
// }
//
// // /////////////////////////////////////////////////////////////// setStaticFile
// const setStaticFile = (payload) => {
//   const staticFiles = CloneDeep(getters.staticFiles)
//   const file = payload.file
//   const path = payload.path
//   !file ? delete staticFiles[path] : staticFiles[path] = file
//   commit('SET_STATIC_FILE', staticFiles)
// }
//
// // //////////////////////////////////////////////////////////////// setClipboard
// const setClipboard = (text) => {
//   this.$addTextToClipboard(text)
//   commit('SET_CLIPBOARD', text)
// }

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useGeneralStore = defineStore('general', () => ({
  // State
  siteContent,
  staticFiles,
  clipboard,
  theme,
  // Actions
  getBaseData,
  setTheme
}))
