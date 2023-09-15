<template>
  <div class="all-results">

    <!-- =========================================================== results -->
    <section
      v-if="resultsFound"
      v-for="item in headings"
      :key="item.heading"
      class="hit-section">

      <div class="hit-source">
        {{ item.heading }}
      </div>

      <ul class="hits-list">
        <li
          v-for="hit in item.hits"
          :key="hit">
          <nuxt-link :to="`/${hit.objectID}`">
            <div class="hit-container">
              <IconHash class="icon hash" />
              <div class="content">
                <span class="hit-title" v-html="getHitTitle(hit)"></span>
                <span class="hit-path">{{ `${hit.entryName}` }}</span>
              </div>
              <IconReturn class="icon action" />
            </div>
          </nuxt-link>
        </li>
      </ul>

    </section>

    <!-- ================================================== no results found -->
    <div v-else class="no-results-placeholder">
      No results found, try a different query
    </div>

  </div>
</template>

<script setup>
// ======================================================================== Data
const props = defineProps({
  hits: {
    type: Array,
    required: true,
    default: () => []
  }
})

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

const resultsFound = computed(() => headings.value.length > 0)

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
  &:hover {
    background-color: var(--link-color);
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
    .icon {
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
