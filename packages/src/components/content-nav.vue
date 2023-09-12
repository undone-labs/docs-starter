<template>
  <nav id="content-nav">
    <section
      v-for="directory in navigation"
      :key="directory.slug"
      class="section">

      <div class="section-heading">

        <template v-if="resolveDynamicComp(directory.icon)">
          <component :is="resolveDynamicComp(directory.icon)" class="icon" />
        </template>

        <h2 class="title" v-html="directory.title" />

      </div>

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
import { getCurrentInstance } from 'vue'

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
/**
 * @method resolveDynamicComp
 */
const resolveDynamicComp = (name) => {
  if (!name) { return false }
  const instance = getCurrentInstance()
  const handle = useToPascalCase(name, '')
  const compToResolve = `Doczilla${handle}`
  if (
    typeof instance?.appContext.components === 'object' &&
    compToResolve in instance.appContext.components
  ) {
    return compToResolve
  }
  return false
}

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.section {
  &:not(:first-of-type) {
    padding-top: 1rem;
  }
}

.section-heading {
  display: flex;
  align-items: center;
  .icon {
    margin-right: toRem(14);
  }
}

.title {
  @include sidebarSectionTitle;
  padding: toRem(4) 0;
  margin: 0;
}

.link {
  display: block;
  padding: toRem(4) 0;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
  }
  &:hover:not(.router-link-active) {
    cursor: pointer;
    .button-label {
      color: var(--primary-text-color);
      transition: color .25s ease;
    }
  }
  &.router-link-active {
    .button-label {
      color: var(--link-color);
      font-weight: 700;
    }
  }
}

:deep(.button-label) {
  @include sidebar;
}
</style>
