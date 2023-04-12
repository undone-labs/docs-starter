<template>
  <div class="sidebar">

    <section
      v-for="(section, sectionIndex) in sidebarContent"
      :key="`section_${sectionIndex}`"
      class="sidebar-section">

      <template
        v-for="(item, index) in section">
        <h2
          v-if="index === 0"
          :key="`item_${index}`"
          class="title"
          v-html="item" />
        <ButtonX
          v-else
          :key="`item_${index}`"
          :to="item.href"
          :tag="item.type"
          class="link">
          <div class="text" v-html="item.label" />
        </ButtonX>
      </template>

    </section>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ButtonX from '@/components/buttons/button-x'

export default {
  name: 'Sidebar',

  components: {
    ButtonX
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    sidebarContent () {
      return this.siteContent.general.sidebar
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: calc(100vh - $siteHeaderHeight);
  overflow-y: scroll;
  padding: 1rem 0;
}

.sidebar-section {
  &:not(:first-of-type) {
    padding-top: toRem(16);
  }

  .title {
    @include sidebarSectionTitle;
    padding: toRem(4) 0;
    margin: 0;
  }

  .link {
    .text {
      @include sidebar;
    }
    display: block;
    &:hover:not(.nuxt-link-active) {
      cursor: pointer;
      .text {
        color: var(--primary-text-color);
        transition: color .25s ease;
      }
    }
  }

  .nuxt-link-active {
    .text{
      color: var(--brand-color);
      font-weight: 600;
    }
  }
}
</style>
