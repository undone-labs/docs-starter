<template>
  <div class="sidebar">

    <ContentNavigation v-slot="{ navigation }">
      <section
        v-for="section in navigation"
        :key="section._path"
        class="section">

        <h2
          class="title"
          v-html="section.title" />

        <ButtonClear
          v-for="link in section.children"
          :key="link._path"
          :to="link._path"
          tag="nuxt-link"
          class="link">
          <div class="button-label" v-html="link.title" />
        </ButtonClear>

      </section>
    </ContentNavigation>

  </div>
</template>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.sidebar {
  position: fixed;
  top: $siteHeaderHeight;
  width: 100%;
  height: calc(100vh - $siteHeaderHeight);
  overflow-x: hidden;
  overflow-y: auto;
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
