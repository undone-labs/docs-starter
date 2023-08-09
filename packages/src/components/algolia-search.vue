<template>
  <div :class="['search-modal', { active: searchModalActive }]">
    <div class="search-container">
      <ais-instant-search :index-name="indexName" :search-client="algolia">
        <ais-search-box />
        <ais-hits />
      </ais-instant-search>
    </div>
  </div>
</template>

<script setup>
// ====================================================================== Import
import { storeToRefs } from 'pinia'
import { renderToString } from 'vue/server-renderer'
import {
  AisInstantSearch,
  AisSearchBox,
  AisHits,
  createServerRootMixin
} from 'vue-instantsearch/vue3/es'

// ======================================================================== Data
const generalStore = useGeneralStore()
const { searchModalActive } = storeToRefs(generalStore)
const indexName = 'test_DOCS'
const algolia = useAlgoliaRef()
const serverRootMixin = ref(
  createServerRootMixin({
    searchClient: algolia,
    indexName,
  }),
)
const { instantsearch } = serverRootMixin.value.data()
provide('$_ais_ssrInstantSearchInstance', instantsearch)

const { data: algoliaState } = await useAsyncData('algolia-state', async () => {
  if (process.server) {
    const nuxtApp = useNuxtApp();
    nuxtApp.$algolia.transporter.requester = (
      await import('@algolia/requester-node-http').then(
        (lib) => lib.default || lib
      )
    ).createNodeHttpRequester();
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
          AisPagination,
        },
        data() {
          return { instantsearch };
        },
        provide: { $_ais_ssrInstantSearchInstance: instantsearch },
        render() {
          return h(AisInstantSearchSsr, null, () => [
            // Include any vue-instantsearch components that you use including each refinement attribute
            h(AisHits),
          ]);
        },
      },
    },
    renderToString,
  });
})

// ======================================================================= Hooks
onBeforeMount(() => {
  if (algoliaState.value) {
    instantsearch.hydrate(algoliaState.value)
  }
})

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.search-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  z-index: -1;
  opacity: 0;
  transition: 400ms ease;
  &.active {
    visibility: visible;
    z-index: 100;
    opacity: 1;
  }
}

.search-container {
  position: absolute;
  width: 72rem;
  height: 80%;
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
  padding: 1rem;
  background-color: var(--background-color);
  border: solid 1px var(--divider);
  border-radius: 0.625rem;
}

:deep(.ais-SearchBox) {
  margin-bottom: 1rem;
}

:deep(.ais-Hits-list) {
  flex-direction: column;
  flex-wrap: nowrap;
}

:deep(.ais-Hits-item) {
  width: unset;
}
</style>
