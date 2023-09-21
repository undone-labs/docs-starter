<template>
  <div
    :class="['search-modal', { active: searchModalActive }]"
    @click.self="closeModal">
    <ais-instant-search :index-name="indexName" :search-client="algolia">

      <ais-search-box
        :class="{ focused: searchFocused }"
        @focus="searchBoxFocus"
        @blur="searchBoxBlur" />

      <div class="results-container">
        <ais-hits>
          <template #default="{ items }">
            <AlgoliaHitsList :hits="items" />
          </template>
        </ais-hits>
      </div>

      <div class="toolbar-bottom">
        <!-- <div class="tip">
          <IconReturn class="icon return" />
          <span class="tip-text">to select</span>
        </div> -->
        <!-- <div class="tip">
          <IconNavigate class="icon navigate" />
          <span class="tip-text">to navigate</span>
        </div> -->
        <!-- <div class="tip">
          <IconEscape class="icon escape" />
          <span class="tip-text">to close</span>
        </div> -->
        <div class="tip algolia-logo">
          <span class="tip-text">search by</span>
          <IconAlgolia class="icon algolia" />
        </div>
      </div>

    </ais-instant-search>
  </div>
</template>

<script setup>
// ===================================================================== Imports
import { storeToRefs } from 'pinia'
import { renderToString } from 'vue/server-renderer'
import {
  AisInstantSearch,
  AisSearchBox,
  AisHits,
  createServerRootMixin
} from 'vue-instantsearch/vue3/es'

// ======================================================================== Data
const runtimeConfig = useRuntimeConfig()
const generalStore = useGeneralStore()
const { searchModalActive } = storeToRefs(generalStore)
const keyCommandEventListenerFunction = ref(null)
const searchFocused = ref(false)
const route = useRoute()
const indexName = runtimeConfig.public.algolia.indexName
const algolia = useAlgoliaRef()
const serverRootMixin = ref(
  createServerRootMixin({
    searchClient: algolia,
    indexName
  })
)
const { instantsearch } = serverRootMixin.value.data()
provide('$_ais_ssrInstantSearchInstance', instantsearch)

const { data: algoliaState } = await useAsyncData('algolia-state', async () => {
  if (process.server) {
    const nuxtApp = useNuxtApp()
    nuxtApp.$algolia.transporter.requester = (
      await import('@algolia/requester-node-http').then(
        (lib) => lib.default || lib
      )
    ).createNodeHttpRequester()
  }
  return instantsearch.findResultsState({
    // IMPORTANT: a component with access to `this.instantsearch` to be used by the createServerRootMixin code
    component: {
      $options: {
        components: {
          AisInstantSearchSsr,
          AisIndex,
          AisConfigure,
          AisRefinementList,
          AisHits,
          AisHighlight,
          AisSearchBox,
          AisStats,
          AisPagination
        },
        data() {
          return { instantsearch }
        },
        provide: { $_ais_ssrInstantSearchInstance: instantsearch },
        render() {
          return h(AisInstantSearchSsr, null, () => [
            // Include any vue-instantsearch components that you use including each refinement attribute
            h(AisHits)
          ])
        }
      }
    },
    renderToString
  })
})

// ==================================================================== Watchers
watch(route, () => {
  if (searchModalActive.value) { closeModal() }
})

// ======================================================================= Hooks
onBeforeMount(() => {
  if (algoliaState.value) {
    instantsearch.hydrate(algoliaState.value)
  }
})

onMounted(() => {
  keyCommandEventListenerFunction.value = (e) => {
    if (e.metaKey && (e.key === 'k' || e.keyCode === 75)) {
      generalStore.setSearchModalActive(true)
    }
  }
  window.addEventListener('keydown', keyCommandEventListenerFunction.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', keyCommandEventListenerFunction.value)
})

// ===================================================================== Methods
const closeModal = () => { generalStore.setSearchModalActive(false) }

const searchBoxFocus = () => { searchFocused.value = true }

const searchBoxBlur = () => { searchFocused.value = false }
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  pointer-events: none;
  z-index: 2000;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--algolia-backdrop);
    opacity: 0;
    z-index: -1;
    transition: 150ms ease-out;
  }
  &.active {
    visibility: visible;
    pointer-events: all;
    opacity: 1;
    &:before {
      transition: 250ms ease-in;
      opacity: 0.7;
    }
    .ais-InstantSearch {
      transition: 150ms ease-in;
      opacity: 1;
      transform: translateY(0);
    }
  }
}

:deep(.ais-InstantSearch) {
  display: flex;
  flex-direction: column;
  box-shadow: 2px -4px 4px 0px rgba(0, 0, 0, 0.05), 2px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: var(--algolia-background);
  border-radius: 0.625rem;
  margin: toRem(60) auto auto;
  max-width: toRem(560);
  max-height: toRem(600);
  opacity: 0;
  overflow: hidden;
  transform: translateY(1rem);
  z-index: 1000;
  transition: 150ms ease-out;
}

// /////////////////////////////////////////////////////////////////// Searchbox
:deep(.ais-SearchBox-form) {
  display: flex;
  flex-direction: row-reverse;
  position: relative;
}

:deep(.ais-SearchBox) {
  margin: toRem(12);
  margin-bottom: 0;
  padding: 0;
  background-color: var(--algolia__searchbox__background-color);
  border: 2px solid var(--divider);
  border-radius: toRem(10);
  transition: border 250ms ease;
  &.focused {
    border-color: var(--link-color);
    .ais-SearchBox-submitIcon {
      path {
        transition: 150ms ease-in;
        fill: var(--link-color);
      }
    }
  }
}

:deep(.ais-SearchBox-input) {
  @include h2;
  flex: 1;
  height: toRem(60);
  padding-right: toRem(12);
  font-size: toRem(22);
  font-weight: 400;
  letter-spacing: 0;
  color: var(--theme-color);
  border: none;
  border-radius: toRem(10);
  appearance: none;
  &::-webkit-search-cancel-button {
    display: none;
  }
}

:deep(.ais-SearchBox-submitIcon) {
  display: block;
  width: toRem(24);
  height: toRem(24);
  margin: 0 toRem(18);
  path {
    fill: var(--theme-color);
    transition: 150ms ease-out;
  }
}

:deep(.ais-SearchBox-reset) {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  &:hover {
    .ais-SearchBox-resetIcon {
      path {
        transition: 150ms ease-in;
        fill: var(--link-color);
      }
    }
  }
}

:deep(.ais-SearchBox-resetIcon) {
  margin: 0 toRem(18);
  path {
    fill: var(--theme-color);
    transition: 150ms ease-out;
  }
}

// //////////////////////////////////////////////////////////////// Results list
.results-container {
  flex: 1;
  padding: 0 toRem(12);
  padding-bottom: toRem(12);
  overflow-y: scroll;
}

:deep(.ais-Hits-list) {
  flex-direction: column;
  flex-wrap: nowrap;
}

:deep(.ais-Hits-item) {
  width: unset;
}

// ///////////////////////////////////////////////////////// Bottom Toolbar Tips
.toolbar-bottom {
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  justify-content: flex-end;
  height: toRem(54);
  width: 100%;
  padding: toRem(10) toRem(20);
  border-top: solid 1px var(--divider);
}

.tip {
  display: flex;
  flex-direction: row;
  align-items: center;
  :deep(path) {
    fill: var(--theme-color);
  }
  :deep(.escape-icon) {
    transform: translateY(0.125rem);
  }
  &.algolia-logo {
    span {
      margin-left: 0;
      margin-right: 0.5rem
    }
    :deep(svg) {
      transform: translateY(0.125rem);
      path {
        fill: #003DFF;
      }
    }
  }
}

.icon {
  display: block;
  &.return {
    width: 14px;
  }
  &.navigate {
    width: 20px;
  }
  &.escape {
    width: 20px;
  }
  &.algolia {
    height: 16px;
  }
}

.tip-text {
  font-size: toRem(12);
  line-height: 1;
  margin-left: 0.5rem;
  white-space: nowrap;
}
</style>
