// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'
import { defineNuxtPlugin } from '#imports'
import { useZeroButtonStore } from '../stores/button.js'

// ////////////////////////////////////////////////////////////// [Class] Button
// -----------------------------------------------------------------------------
const Button = (store, id) => {
  let button = store.buttons.find(button => button.id === id)
  return {
    // ================================================================ register
    async register () {
      if (!button) {
        this.set({
          id,
          loading: false
        })
      }
    },

    // ============================================================== deregister
    // async deregister () {
    //   if (button) {
    //     await store.dispatch('button/removeButton', id)
    //   }
    // },

    // ===================================================================== get
    get () {
      return button
    },

    // ===================================================================== set
    async set (incoming) {
      await store.setButton(Object.assign(CloneDeep(button || {}), incoming))
      button = store.butons.find(button => button.id === id)
    },

    // ================================================================= loading
    loading () {
      return button.loading
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtPlugin(() => {
  const store = useZeroButtonStore()
  return {
    provide: {
      button: (id) => Button(store, id)
    }
  }
})
