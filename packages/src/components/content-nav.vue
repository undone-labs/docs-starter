<template>
  <nav id="content-nav">
    <section
      v-for="directory in navigation"
      :key="directory.slug"
      class="section">

      <h2
        class="title"
        v-html="directory.title" />

      <ButtonClear
        v-for="link in directory.children"
        :key="generateLink(directory.slug, link.href)"
        :to="generateLink(directory.slug, link.href)"
        :tag="link.type"
        class="link">
        <div class="button-label" v-html="link.title" />
      </ButtonClear>

      <!-- <ButtonClear
        v-for="(num, index) in 20"
        :key="index"
        class="link">
        <div class="button-label" v-html="'This is a link'" />
      </ButtonClear> -->

    </section>
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

const navigation = sidebar.value.body

// ===================================================================== Methods
/**
 * @method generateLink
 */
const generateLink = (dirSlug, href) => {
  return `/${dirSlug}${href}`
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.section {
  &:not(:first-of-type) {
    padding-top: 1rem;
  }
}

.title {
  @include sidebarSectionTitle;
  padding: toRem(4) 0;
  margin: 0;
}

.link {
  display: block;
  &:hover:not(.router-link-active) {
    cursor: pointer;
    .button-label {
      color: var(--primary-text-color);
      transition: color .25s ease;
    }
  }
  &.router-link-active {
    .button-label {
      color: var(--brand-color);
      font-weight: 600;
    }
  }
}

:deep(.button-label) {
  @include sidebar;
}
</style>
