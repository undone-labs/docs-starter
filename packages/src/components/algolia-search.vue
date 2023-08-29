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
                <section
                  v-for="item in items"
                  :key="item.objectID"
                  class="hit-section">
                  <div>{{ logItem(item) }}</div>
                  <div class="hit-source">
                    {{ item.title }}
                  </div>
                  <ul class="hits-list">
                    <li
                      v-for="hit in getHits(item)"
                      :key="hit">
                      <nuxt-link to="/">
                        <div class="hit-container">
                          <div class="icon">
                            <IconHash />
                          </div>
                          <div class="content">
                            <span class="hit-title" v-html="hit.title.value"></span>
                            <span class="hit-path">{{ item.title }}</span>
                          </div>
                          <div class="action">
                            <IconReturn />
                          </div>
                        </div>
                      </nuxt-link>
                    </li>
                  </ul>
                </section>
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
        <div class="tip">
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
const logItem = (item) => {
  console.log(item)
  return ''
}

const getHits = (item) => {
  return item._highlightResult.children.filter(e => e.title.matchLevel !== 'none')
}

const closeModal = () => { generalStore.setSearchModalActive() }

const searchBoxFocus = () => { searchFocused.value = true }

const searchBoxBlur = () => { searchFocused.value = false; console.log('blur') }

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
  background-color: var(--secondary-background-color);
  border: solid 1px var(--divider);
  border-radius: 0.625rem;
  z-index: 10;
}

:deep(.ais-SearchBox) {
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

:deep(.ais-SearchBox),
:deep(.hit-container) {
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  background-color: var(--background-color);
}

:deep(.ais-SearchBox-input) {
  border: none;
  padding: toRem(8) toRem(50);
  @include h2;
  font-weight: 400;
  letter-spacing: 0;
}

:deep(.ais-SearchBox-submitIcon) {
  width: 2rem;
  height: 2rem;
  margin: 0 toRem(9);
  path {
    transition: 250ms ease;
  }
}

:deep(.ais-Hits-list) {
  flex-direction: column;
  flex-wrap: nowrap;
}

:deep(.ais-Hits-item) {
  width: unset;
}

.hits-list {
  list-style: none;
}

.hit-container {
  display: flex;
  align-items: center;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);
  .icon,
  .action {
    transition: none;
    :deep(path) {
      fill: var(--primary-text-color);
    }
  }
  &:hover {
    background-color: var(--brand-color);
    .hit-title,
    .hit-path {
      color: white;
      :deep(mark) {
        color: white;
      }
    }
    .hit-path {
      opacity: 0.7;
    }
    .icon,
    .action {
      :deep(path) {
        fill: white;
      }
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.hit-source {
  color: var(--brand-color);
  @include p1;
  margin-top: toRem(15);
  margin-bottom: toRem(10);
}

.hit-title,
.hit-path {
  display: block;
  transition: none;
}

.hit-title {
  @include p1;
  :deep(mark) {
    background: none;
    color: var(--brand-color);
  }
}

.hit-path {
  @include p2;
  color: var(--secondary-text-color);
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
}

.tip {
  :deep(path) {
    fill: var(--primary-text-color);
  }
}
</style>
