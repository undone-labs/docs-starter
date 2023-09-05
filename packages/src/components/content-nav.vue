<template>
  <nav id="content-nav">
    <section
      v-for="directory in Sidebar"
      :key="directory.slug"
      class="section">

      <div class="section-heading">

        <template v-if="resolveDynamicComp(directory.icon)">
          <component :is="resolveDynamicComp(directory.icon)" class="icon" />
        </template>

        <h2
          :class="['title', { active: routeMatchesCurrentDirectory(directory.slug) }]"
          v-html="directory.title" />

      </div>

      <ButtonClear
        v-for="link in directory.children"
        :key="generateLink(directory.slug, link.href)"
        :to="generateLink(directory.slug, link.href)"
        :tag="link.type"
        class="link">
        <div class="button-label" v-html="link.title" />
      </ButtonClear>

    </section>
  </nav>
</template>

<script setup>
// ===================================================================== Imports
import { getCurrentInstance } from 'vue'
import Sidebar from '@/docs/data/sidebar.json'

// ======================================================================== Data
const route = useRoute()

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

/**
 * @method routeMatchesCurrentDirectory
 */
const routeMatchesCurrentDirectory = (slug) => {
  return route.path.includes(slug)
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
  &.active {
    color: var(--link-color);
  }
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
      transition: 150ms ease-in;
      color: var(--link-color);
    }
  }
  &.router-link-active {
    .button-label {
      font-weight: 700;
    }
  }
}

:deep(.button-label) {
  @include sidebar;
  transition: 150ms ease-out;
}
</style>
