<template>
  <div
    :class="['search-modal', { active: searchModalActive }]"
    @click.self="closeModal">
    <div class="search-container">

      <ais-instant-search :index-name="indexName" :search-client="algolia">
        <ais-search-box
          :class="{ focused: searchFocused }"
          @focus="searchBoxFocus"
          @blur="searchBoxBlur" />
        <div class="results-container">
          <div class="results-dropdown">
            <ais-hits>
              <template #default="{ items }">
                <HitsList :hits="items" />
              </template>
            </ais-hits>
          </div>
        </div>
      </ais-instant-search>

      <div class="toolbar-bottom">
        <div class="tip">
          <IconReturn />
          <span>
            to select
          </span>
        </div>
        <div class="tip">
          <IconNavigate />
          <span>
            to navigate
          </span>
        </div>
        <div class="tip">
          <IconEscape />
          <span>
            to close
          </span>
        </div>
        <div class="tip algolia-logo">
          <span>
            search by
          </span>
          <IconAlgolia />
        </div>
      </div>

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
const keyCommandEventListenerFunction = ref(null)
const searchFocused = ref(false)
const route = useRoute()
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
            h(AisHits)
          ]);
        },
      },
    },
    renderToString,
  });
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
      generalStore.setSearchModalActive()
    }
  }
  window.addEventListener('keydown', keyCommandEventListenerFunction.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', keyCommandEventListenerFunction.value)
})

// ===================================================================== Methods
const closeModal = () => { generalStore.setSearchModalActive() }

const searchBoxFocus = () => { searchFocused.value = true }

const searchBoxBlur = () => { searchFocused.value = false; }

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
  z-index: -1;
  opacity: 0;
  transition: 250ms ease;
  &.active {
    visibility: visible;
    z-index: 1001;
    opacity: 1;
  }
}

.search-container {
  position: absolute;
  width: toRem(710);
  height: toRem(672);
  // height: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem;
  padding-bottom: 0;
  background-color: var(--search-modal-background);
  border: solid 1px var(--divider);
  border-radius: 0.625rem;
  z-index: 10;
}

:deep(.ais-InstantSearch) {
  height: calc(100% - toRem(54)); // 100% - bottom toolbar height
}

:deep(.ais-SearchBox) {
  height: toRem(84);
  margin-bottom: 1rem;
  border: 3px solid var(--divider);
  transition: border 250ms ease;
  &.focused {
    border: 3px solid var(--brand-color);
    .ais-SearchBox-submitIcon {
      path {
        fill: var(--brand-color);
      }
    }
  }
}

.results-container {
  height: calc(100% - toRem(84) - 1rem); // 100% minus height and margin on search input
  overflow: scroll;
}

:deep(.ais-SearchBox),
:deep(.hit-container) {
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  background-color: var(--secondary-background-color);
}

:deep(.ais-SearchBox-input) {
  border: none;
  padding: toRem(8) toRem(50);
  @include h2;
  font-weight: 400;
  letter-spacing: 0;
  background-color: var(--secondary-background-color);
  color: var(--primary-text-color);
}

:deep(.ais-SearchBox-submitIcon) {
  width: 2rem;
  height: 2rem;
  margin: 0 toRem(9);
  path {
    transition: 250ms ease;
  }
}

:deep(.ais-SearchBox-resetIcon) {
  path {
    fill: var(--primary-text-color);
  }
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
  position: absolute;
  height: toRem(54);
  width: 100%;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  padding: toRem(10) toRem(20);
  border-top: solid 1px var(--divider);
}

.tip {
  display: flex;
  align-items: center;
  span {
    font-size: toRem(14);
    line-height: 1.5;
    margin-left: 0.5rem;
  }
  :deep(path) {
    fill: var(--primary-text-color);
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
</style>
