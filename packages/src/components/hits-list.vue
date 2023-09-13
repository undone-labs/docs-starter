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
          <nuxt-link to="/">
            <div class="hit-container">
              <div class="icon">
                <IconHash />
              </div>
              <div class="content">
                <span class="hit-title" v-html="hit.entryName"></span>
                <span class="hit-path">{{ item.heading }}</span>
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
      hits: filtered
    })
  })
  return array
})

onMounted(() => {
  console.log(headings.value)
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
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
</style>
