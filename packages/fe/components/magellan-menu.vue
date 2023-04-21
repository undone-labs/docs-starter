<template>
  <div class="magellan-menu sticky ">
    <div class="title">
      On this page
    </div>
    <template v-for="(link, index) in links">
      <a
        :ref="link.id"
        :key="index"
        :class="['magellan-menu-item', activeSection === link.id ? 'active' : '']"
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
      headingLocations: []
    }
  },

  computed: {
    menuItemLocations () {
      // console.log('refs ', this.$refs)
      return []
    }
  },

  watch: {
    activeSection () {

    }
  },

  mounted () {
    console.log('mounted')
    const locations = this.links.map((item) => {
      const id = item.id
      const element = document.getElementById(id)
      const top = element.getBoundingClientRect().top
      const active = top < 93 && top > 0
      const isActive = this.activeSection === item.id
      if (active && !isActive) { this.activeSection = id }
      return {
        id,
        top,
        active
      }
    })
    this.headingLocations = locations

    // const manageScroll = this.$throttle(this.activeSectionUpdate, 100)

    window.addEventListener('scroll', this.activeSectionUpdate)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.activeSectionUpdate)
  },

  methods: {
    activeSectionUpdate () {
      if (window.scrollY === 0) { this.activeSection = false }

      const locations = this.headingLocations.map((item) => {
        const element = document.getElementById(item.id)
        const top = element.getBoundingClientRect().top
        const active = top < 93 && top > 0
        const isActive = this.activeSection === item.id
        // if (active && !isActive) { this.$router.replace({ hash: `#${item.id}` }) }
        if (active && !isActive) { this.activeSection = item.id }
        return {
          ...item,
          top,
          active
        }
      })
      this.headingLocations = locations
    }
  }
}
</script>

<style lang="scss" scoped>
.magellan-menu {
  align-self: flex-start;
  display: flex;
  flex-flow: column nowrap;
  margin-left: 6rem;
  position: sticky;
  top: calc($siteHeaderHeight + 2rem);
  bottom: 0;
  min-width: 25%;
}

.title {
  @include magellanTitle;
  margin-bottom: toRem(4);
}

.magellan-menu-item {
  @include magellan;
}

.active {
  color: var(--primary-text-color);
  &::before {
    content: '';
    position: absolute;
    left: -.5rem;
    height: 100%;
    top: 0;
    width: toRem(4);
    border-radius: toRem(4);
    background-color: var(--brand-color);
  }
}

.active-marker {
  position: absolute;
  left: -.5rem;
  height: toRem(20);
  top: 0;
  width: toRem(4);
  border-radius: toRem(4);
  background-color: var(--brand-color);

}
</style>
