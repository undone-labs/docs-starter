<template>
  <nav v-if="previous || next" id="pagination">

    <ButtonClear
      v-if="previous"
      :to="previous.path"
      tag="nuxt-link"
      class="nav-link prev">
      <div class="label">
        <IconArrow class="icon-arrow left" />
        Previous
      </div>
      <div class="page-title">
        {{ previous.title }}
      </div>
      <div v-if="onFirstPage" class="directory-title">
        {{ previous.dirTitle }}
      </div>
    </ButtonClear>

    <ButtonClear
      v-if="next"
      :to="next.path"
      tag="nuxt-link"
      class="nav-link next">
      <div class="label">
        Next
        <IconArrow class="icon-arrow right" />
      </div>
      <div class="page-title">
        {{ next.title }}
      </div>
      <div v-if="onLastPage" class="directory-title">
        {{ next.dirTitle }}
      </div>
    </ButtonClear>

  </nav>
</template>

<script setup>
// ======================================================================== Data
const { data: sidebar } = await useAsyncData('sidebar', () => {
  const queryWithout = ['title', '_dir', '_draft', '_extension', '_file', '_id', '_locale', '_partial', '_path', '_source', '_type']
  return queryContent('/docs/data/sidebar')
    .without(queryWithout)
    .findOne()
})

const rawNavigation = sidebar.value.body
const navigation = rawNavigation.reduce((acc, directory) => {
  const dirSlug = directory.slug
  directory.children.forEach((page) => {
    acc.push({
      dirTitle: directory.title,
      dirSlug,
      title: page.title,
      path: `/${dirSlug}${page.href}`
    })
  })
  return acc
}, [])

const navItemCount = navigation.length
const firstNavItem = navigation[0]
const lastNavItem = navigation.slice(-1)[0]

const route = useRoute()
const currentPath = route.path
const currentPathIndex = navigation.findIndex(page => page.path === currentPath)

const onFirstPage = currentPathIndex === 0
const onLastPage = currentPathIndex === navItemCount - 1
const previous = onFirstPage ? lastNavItem : navigation[currentPathIndex - 1]
const next = onLastPage ? firstNavItem : navigation[currentPathIndex + 1]
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#pagination {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

:deep(.nav-link) {
  &:hover {
    &.prev {
      .icon-arrow.left {
        transition: 150ms ease-in;
        transform: translateX(-0.5rem);
      }
    }
    &.next {
      .icon-arrow.right {
        transition: 150ms ease-in;
        transform: rotate(180deg) translateX(-0.5rem);
      }
    }
    .page-title {
      transition: 150ms ease-in;
      color: $blueRibbon;
    }
  }
  .button-content {
    display: flex;
    flex-direction: column;
  }
  &.prev {
    .button-content {
      align-items: flex-start;
    }
  }
  &.next {
    .button-content {
      align-items: flex-end;
    }
  }
}

.label {
  font-size: toRem(18);
  font-weight: 700;
}

.icon-arrow {
  width: toRem(14);
  transition: 150ms ease-out;
  &.left {
    margin-right: toRem(11);
  }
  &.right {
    margin-left: toRem(11);
    transform: rotate(180deg);
  }
}

.page-title {
  font-size: toRem(18);
  font-weight: 500;
  transition: 150ms ease-out;
}
</style>
