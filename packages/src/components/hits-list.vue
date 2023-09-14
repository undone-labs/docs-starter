<template>
  <div class="all-results">
    <section
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
              <div class="icon">
                <IconHash />
              </div>
              <div class="content">
                <span class="hit-title" v-html="getHitTitle(hit)"></span>
                <span class="hit-path">{{ `${hit.entryName}` }}</span>
              </div>
              <div class="action">
                <IconReturn />
              </div>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  hits: {
    type: Array,
    required: true,
    default: () => []
  }
})

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

const getHitTitle = (hit) => {
  if (hit._highlightResult.entryName.matchLevel === 'full') {
    return hit.entrySection
  }
  if (hit._highlightResult.content.matchLevel === 'full') {
    return formatMatchingContent(hit._highlightResult.content.value, hit)
  }
  return hit.entrySection
}

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
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);
  .icon,
  .action {
    display: flex;
    transition: none;
  }
  .icon {
    :deep(path) {
      fill: var(--theme-color);
    }
  }
  .action {
    :deep(path) {
      fill: rgba(var(--theme-color), 0);
    }
  }
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
  padding: 0 0.5rem;
}

.hit-source {
  color: var(--link-color);
  @include p1;
  font-weight: 700;
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
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-flex: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: var(--theme-color);
  :deep(mark) {
    background: none;
    color: var(--link-color);
  }
}

.hit-path {
  @include p2;
  color: var(--theme-color);
  opacity: 0.7;
}
</style>
