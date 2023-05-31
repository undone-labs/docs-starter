<template>
  <div class="sidebar">

    <section
      v-for="(section, sectionIndex) in sidebar"
      :key="`section-${sectionIndex}`"
      class="section">
      <template v-for="(item, itemIndex) in section">

        <h2
          v-if="item.type === 'title'"
          :key="`item-${itemIndex}`"
          class="title"
          v-html="item.label" />

        <ButtonClear
          v-else
          :key="`item-${itemIndex}`"
          :to="item.href"
          :tag="item.type"
          class="link">
          <div class="button-label" v-html="item.label" />
        </ButtonClear>

      </template>
    </section>

  </div>
</template>

<script setup>
// ======================================================================== Data
const content = await queryContent('components/sidebar').findOne()
const sidebar = content.body
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.sidebar {
  position: fixed;
  top: $siteHeaderHeight;
  height: calc(100vh - $siteHeaderHeight);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 2rem 6rem 2rem 0;
  border-right: 1px solid var(--divider);
}

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
