// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineStore } from 'pinia'
import { ref } from '#imports'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const buttons = ref([])

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////////// setButton
const setButton = (payload) => {
  const index = buttons.value.findIndex(button => button.id === payload.id)
  index === -1 ? buttons.value.push(payload) : buttons.value.splice(index, 1, payload)
}

// //////////////////////////////////////////////////////////////// removeButton
const removeButton = (id) => {
  const index = buttons.value.findIndex(button => button.id === id)
  buttons.value.splice(index, 1)
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useZeroButtonStore = defineStore('zero-button', () => ({
  // State
  buttons,
  // Actions
  setButton,
  removeButton
}))
