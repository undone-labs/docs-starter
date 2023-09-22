<template>
  <div class="all-results">

    <!-- =========================================================== results -->
    <template v-if="resultsFound">
      <section
        v-for="item in headings"
        :key="item.heading"
        class="hit-section">

        <div class="hit-source">
          {{ item.heading }}
        </div>

        <div class="hits-list">
          <nuxt-link
            v-for="hit in item.hits"
            :key="hit"
            :to="hit.objectID"
            @mouseenter="generalStore.setActiveHit(hit.objectID)"
            @click="handleClick">
            <div :class="['hit-container', { active: hit.objectID === searchActiveHit }]">
              <IconHash class="icon hash" />
              <div class="content">
                <span class="hit-title" v-html="getHitTitle(hit)"></span>
                <span class="hit-path">{{ `${hit.entryName}` }}</span>
              </div>
              <IconReturn class="icon action" />
            </div>
          </nuxt-link>
        </div>

      </section>
    </template>

    <!-- ================================================== no results found -->
    <div v-else class="no-results-placeholder">
      No results found, try a different query
    </div>

  </div>
</template>

<script setup>
// ===================================================================== Imports
import { storeToRefs } from 'pinia'

// ======================================================================== Data
const props = defineProps({
  hits: {
    type: Array,
    required: true,
    default: () => []
  }
})

const generalStore = useGeneralStore()
const { searchActiveHit, searchModalActive } = storeToRefs(generalStore)
const keyCommandEventListener = ref(null)

// ==================================================================== Computed
const headings = computed(() => {
  const uniqueHeadings = [...new Set(props.hits.map(hit => hit.sidebarHeading))]
  const array = []
  uniqueHeadings.forEach((itemHeading) => {
    const filtered = props.hits.filter((hit) => hit.sidebarHeading === itemHeading)
    array.push({
      heading: itemHeading,
      hits: filtered.slice(0, 5)
    })
  })
  return array
})

const filteredHitList = computed(() => {
  return headings.value.reduce((acc, group) => {
    acc = acc.concat(group.hits)
    return acc
  }, [])
})

const resultsFound = computed(() => headings.value.length > 0)

// ======================================================================= Hooks
onMounted(() => {
  /**
   * cmd+k/esc is handled in algolia-search.vue
   */
  keyCommandEventListener.value = (e) => {
    const key = e.key
    const code = e.code
    const keyCode = e.keyCode
    const meta = e.metaKey || key === 'Meta' || code === 'MetaLeft' || code === 'MetaRight' || keyCode === 91 || keyCode === 93
    const up = key === 'ArrowUp' || code === 'ArrowUp' || keyCode === 38
    const down = key === 'ArrowDown' || code === 'ArrowDown' || keyCode === 40
    const enter = key === 'Enter' || code === 'Enter' || keyCode === 13
    const ctrl = e.ctrlKey || key === 'Control' || code === 'ControlLeft' || code === 'ControlRight' || keyCode === 17
    const shift = e.shiftKey || key === 'Shift' || code === 'ShiftLeft' || code === 'ShiftRight' || keyCode === 16
    if (up || down) {
      if (searchModalActive.value) { e.preventDefault() }
      const list = filteredHitList.value
      let currentIndex = filteredHitList.value.findIndex(hit => hit.objectID === searchActiveHit.value)
      let nextIndex
      if (currentIndex === -1) {
        nextIndex = down ? 0 : nextIndex = filteredHitList.value.length - 1
      } else if (down && currentIndex < filteredHitList.value.length - 1) {
        nextIndex = currentIndex += 1
      } else if (up && currentIndex !== 0) {
        nextIndex = currentIndex -= 1
      }
      if (nextIndex !== undefined) {
        generalStore.setActiveHit(list[nextIndex].objectID)
      }
    } else if (enter && searchActiveHit.value) {
      generalStore.setSearchModalActive(false)
      if (meta || ctrl) { // cmd+enter → open in new tab | ctrl+enter → open in new tab and switch to tab
        navigateTo(searchActiveHit.value, { open: { target: '_blank' } } )
      } else if (shift) { // shift+enter → open in new window
        navigateTo(searchActiveHit.value, {
          open: { target: '_blank' },
          windowFeatures: { popup: true }
        })
      } else { // enter → open in same window
        navigateTo(searchActiveHit.value)
      }
    }
  }
  window.addEventListener('keydown', keyCommandEventListener.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', keyCommandEventListener.value)
})

// ===================================================================== Methods
/**
 * @method getHitTitle
 */

const getHitTitle = (hit) => {
  if (hit._highlightResult.entryName.matchLevel === 'full') {
    return hit.entrySection
  }
  if (hit._highlightResult.content.matchLevel === 'full') {
    return formatMatchingContent(hit._highlightResult.content.value, hit)
  }
  return hit.entrySection
}

/**
 * @method formatMatchingContent
 */

const formatMatchingContent = (string, hit) => {
  const sentences = string.split('.')
  const result = sentences.find(sentence => sentence.includes('<mark>'))
  if (result) {
    const text = result.trim()
    const maxChars = 75
    const afterIndex = text.indexOf('</mark>') + 7 // add 1 for each character in '</mark>'; i.e. 7
    if (afterIndex > maxChars - 1) {
      const trimBefore = afterIndex - maxChars + 10 // 10 for a buffer before the end of the string
      return `...${text.substring(trimBefore, text.length).trim()}`
    } else {
      return `${text.substring(0, maxChars)}`
    }
  }
  return hit.entrySection
}

/**
 * @method handleClick
 */

const handleClick = () => {
  generalStore.setSearchModalActive(false)
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.hits-list {
  list-style: none;
}

.hit-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  padding: toRem(8) toRem(14);
  padding-right: toRem(20);
  border-radius: 10px;
  background-color: var(--algolia__hit__background-color);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);
  &:hover,
  &.active {
    background-color: var(--link-color);
    .hit-title,
    .hit-path {
      color: var(--algolia__hit__hover__color);
      :deep(mark) {
        color: var(--algolia__hit__hover__color);
      }
    }
    .hit-path {
      opacity: 0.7;
    }
    .icon {
      :deep(path) {
        fill: var(--algolia__hit__hover__color);
      }
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 toRem(14);
}

.hit-source {
  @include p1;
  position: sticky;
  top: 0;
  padding: toRem(15) 0 toRem(10) toRem(12);
  background-color: var(--algolia-background);
  color: var(--link-color);
  font-weight: 700;
  z-index: 100;
}

.hit-title,
.hit-path {
  display: block;
  transition: none;
}

.hit-title {
  @include p1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-flex: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: var(--theme-color);
  :deep(mark) {
    background: none;
    color: var(--link-color);
    font-weight: 500;
  }
}

.hit-path {
  @include p2;
  color: var(--theme-color);
  opacity: 0.7;
}

.icon {
  &.hash {
    width: toRem(24);
  }
  &.action {
    width: toRem(20);
  }
  :deep(path) {
    fill: var(--theme-color);
  }
}

.no-results-placeholder {
  padding-top: toRem(12);
  text-align: center;
  font-weight: 500;
}
</style>
