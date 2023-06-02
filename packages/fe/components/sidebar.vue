<template>
  <aside class="sidebar">

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

  </aside>
</template>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.sidebar {
  position: fixed;
  top: 0;
  left: calc((100vw - $gridWidth) / 2);
  width: $sidebarWidth;
  height: 100%;
  padding: 2.5rem;
  padding-top: $siteHeaderHeight;
  padding-bottom: 8rem;
  border-right: 1px solid var(--divider);
  overflow-y: scroll;
  @include gridMaxMQ {
    left: 0;
  }
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
