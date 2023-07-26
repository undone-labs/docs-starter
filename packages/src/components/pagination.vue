<template>
  <nav id="pagination">

    <ButtonClear
      :to="previous.path"
      tag="nuxt-link"
      class="navlink prev">
      <span class="label">Previous</span>
      <div class="page-title">
        {{ previous.title }}
      </div>
      <div v-if="onFirstPage" class="directory-title">
        {{ previous.dirTitle }}
      </div>
    </ButtonClear>

    <ButtonClear
      :to="next.path"
      tag="nuxt-link"
      class="navlink next">
      <span class="label">Next</span>
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
// const currentPage = navigation[currentPathIndex]

const onFirstPage = currentPathIndex === 0
const onLastPage = currentPathIndex === navItemCount - 1
const previous = onFirstPage ? lastNavItem : navigation[currentPathIndex - 1]
const next = onLastPage ? firstNavItem : navigation[currentPathIndex + 1]
</script>

<style lang="scss">
// ///////////////////////////////////////////////////////////////////// General
#pagination {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
