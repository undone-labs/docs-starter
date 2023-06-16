<template>
  <nav id="content-nav">
    <section
      v-for="(section, dirSlug) in Sidebar"
      :key="dirSlug"
      class="section">

      <h2
        class="title"
        v-html="section.label" />

      <ButtonClear
        v-for="link in section.children"
        :key="generateLink(dirSlug, link.href)"
        :to="generateLink(dirSlug, link.href)"
        :tag="link.type"
        class="link">
        <div class="button-label" v-html="link.label" />
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
// ===================================================================== Imports
import Sidebar from '@/docs/data/sidebar.json'

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
