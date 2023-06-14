<template>
  <nav id="magellan-menu">

    <div
      :class="['active-link-marker', { hide: !activeUrlHash }]"
      :style="{ height: activeLinkMarkerHeight, top: activeLinkMarkerPosition }" />

    <ButtonClear
      v-for="(link, index) in magellanLinks"
      :key="index"
      tag="nuxt-link"
      :to="link.hash"
      :class="['link', link.level, { active: hashIsActive(link.hash) }]"
      :link-hash="link.hash.slice(1)"
      :link-index="index"
      class="link">
      <div class="button-label" v-html="link.text" />
    </ButtonClear>

  </nav>
</template>

<script setup>
// ===================================================================== Imports
import { storeToRefs } from 'pinia'

// ======================================================================== Data
const linkElement = ref(null)
const activeLinkMarkerHeight = ref('0px')
const generalStore = useGeneralStore()
const { activeUrlHash, magellanLinks } = storeToRefs(generalStore)

// ==================================================================== Computed
const activeLinkMarkerPosition = computed(() => {
  if (!activeUrlHash.value || !linkElement.value) { return false }
  const buttonTop = linkElement.value.getBoundingClientRect().top
  const parentTop = linkElement.value.parentNode.getBoundingClientRect().top
  return `${buttonTop - parentTop}px`
})

// ==================================================================== Watchers
watch(activeUrlHash, (hash) => {
  if (!hash) { return false }
  linkElement.value = document.querySelector(`[link-hash="${hash}"]`)
  activeLinkMarkerHeight.value = `${linkElement.value.offsetHeight}px`
})

// ===================================================================== Methods
/**
 * @method hashIsActive
 */
const hashIsActive = (hash) => {
  if (!activeUrlHash.value || !hash) { return false }
  return hash.slice(1) === activeUrlHash.value
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#magellan-menu {
  position: relative;
  overflow-y: scroll;
}

.active-link-marker {
  position: absolute;
  top: $sidebarPadding;
  left: calc($sidebarPadding - 0.5rem);
  width: 0.25rem;
  background-color: teal;
  border-radius: toRem(4);
  transition: 150ms ease-in-out;
  &.hide {
    opacity: 0;
  }
}

.link {
  @include sidebar;
  display: block;
  &.active {
    text-decoration: underline;
  }
}

.button-label {
  white-space: break-spaces;
  line-height: 1.2;
}
</style>
