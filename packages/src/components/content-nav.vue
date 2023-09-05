<template>
  <nav id="content-nav">
    <section
      v-for="directory in Sidebar"
      :key="directory.slug"
      class="section">

      <div class="section-heading">

        <template v-if="useResolveDoczillaComponent(directory.icon)">
          <component :is="useResolveDoczillaComponent(directory.icon)" class="icon" />
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
        :disabled="isCurrentRoute(generateLink(directory.slug, link.href))"
        class="link">
        <div class="button-label" v-html="link.title" />
      </ButtonClear>

    </section>
  </nav>
</template>

<script setup>
// ===================================================================== Imports
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
 * @method routeMatchesCurrentDirectory
 */
const routeMatchesCurrentDirectory = (slug) => {
  return route.path.includes(slug)
}

/**
 * @method isCurrentRoute
 */
const isCurrentRoute = (path) => {
  return path === route.path
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
    width: toRem(21);
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

:deep(.link.button) {
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
  &[disabled="true"] {
    opacity: 1;
    cursor: default;
  }
  .button-label {
    @include sidebar;
    transition: 150ms ease-out;
  }
}
</style>
