<template>
  <div id="magellan-menu">
    <div class="menu-title">
      ON THIS PAGE
    </div>

    <div class="active-marker" :style="menuItemStyles[activeSection]" />

    <template v-for="(link, index) in links">
      <a
        :ref="link.id"
        :key="index"
        :class="['magellan-menu-item',link.type, activeSection === link.id ? 'active' : '']"
        :href="`#${link.id}`"
        v-html="link.text" />
    </template>

  </div>
</template>

<script>
export default {
  name: 'MagellanMenu',

  props: {
    links: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      activeSection: false,
      headingLocations: [],
      menuItemStyles: {}
    }
  },

  mounted () {
    this.activeSectionUpdate('mounted', this.links)
    window.addEventListener('scroll', this.activeSectionUpdate)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.activeSectionUpdate)
  },

  methods: {
    activeSectionUpdate (trigger, currentLocations = this.headingLocations) {
      if (window.scrollY === 0) { this.activeSection = false }

      if (this.activeSection) { this.calcActiveMarkerStyles() }

      const locations = currentLocations.map((item) => {
        const id = item.id
        const element = document.getElementById(id)
        const active = element.getBoundingClientRect().top < 230
        const isActive = this.activeSection === id
        if (active && !isActive) { this.activeSection = id }
        return {
          id,
          active
        }
      })
      this.headingLocations = locations
    },
    calcActiveMarkerStyles () {
      const locations = {}
      const refs = this.$refs
      for (const entry in refs) {
        const item = refs[entry][0]
        locations[entry] = {
          top: `${item.offsetTop}px`,
          height: `${item.clientHeight}px`,
          opacity: 1
        }
      }
      this.menuItemStyles = locations
    }
  }
}
</script>

<style lang="scss" scoped>
#magellan-menu {
  align-self: flex-start;
  display: flex;
  flex-flow: column nowrap;
  margin-left: 6rem;
  position: sticky;
  top: calc($siteHeaderHeight + 2rem);
  bottom: 0;
  min-width: 25%;
}

.menu-title {
  @include magellanTitle;
  margin-bottom: toRem(4);
}

.magellan-menu-item {
  @include magellan;
}

.subtitle {
  padding-left: 1rem;
}

.active {
  color: var(--primary-text-color);
}

.active-marker {
  position: absolute;
  left: -.5rem;
  opacity: 0;
  width: toRem(4);
  border-radius: toRem(4);
  background-color: var(--brand-color);
  transition: all 200ms ease-in;
}
</style>
