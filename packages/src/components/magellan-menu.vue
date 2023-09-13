<template>
  <nav id="magellan-menu" ref="magellanMenu">

    <div class="title">
      ON THIS PAGE
    </div>

    <div
      :class="['active-link-marker', { hide: !activeUrlHash }]"
      :style="{ height: `${activeLinkMarkerHeight}px`, top: `${activeLinkMarkerPosition}px` }" />

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
const magellanMenu = ref(null)
const activeLinkMarkerHeight = ref(0)
const scrollTop = ref(0)
const scrollMagellanMenuEventListenerFunction = ref(null)
const route = useRoute()
const generalStore = useGeneralStore()
const { activeUrlHash, magellanLinks } = storeToRefs(generalStore)

// ==================================================================== Computed
const activeLinkMarkerPosition = computed(() => {
  if (!activeUrlHash.value || !linkElement.value) { return 52 }
  const buttonTop = linkElement.value.getBoundingClientRect().top
  const parentTop = linkElement.value.parentNode.getBoundingClientRect().top
  return buttonTop - parentTop + scrollTop.value
})

// ==================================================================== Watchers
watch(activeUrlHash, (hash) => {
  linkElement.value = document.querySelector(`[link-hash="${hash}"]`)
  if (!hash || !linkElement.value) { return false }
  activeLinkMarkerHeight.value = linkElement.value.offsetHeight
})

watch(route, () => {
  const firstLinkElement = document.querySelector(`[link-hash]`)
  if (firstLinkElement) {
    activeLinkMarkerHeight.value = firstLinkElement.offsetHeight
  }
})

watch([activeLinkMarkerPosition, activeLinkMarkerHeight], ([pos, height]) => {
  const magellanHeight = magellanMenu.value.getBoundingClientRect().height
  const topPadding = window.getComputedStyle(magellanMenu.value).paddingTop
  const bottomPadding = window.getComputedStyle(magellanMenu.value).paddingBottom
  const markerTop = parseFloat(pos)
  const markerBottom = markerTop + parseFloat(height)
  const contentTop = parseInt(topPadding) + scrollTop.value
  const contentHeight = magellanHeight - parseInt(bottomPadding)
  if (markerBottom > contentHeight) {
    magellanMenu.value.scrollTop = markerBottom - contentHeight
  }
  if (markerTop < contentTop) {
    magellanMenu.value.scrollTop = magellanMenu.value.scrollTop - (contentTop - markerTop)
  }
})

// ======================================================================= Hooks
onMounted(() => {
  scrollMagellanMenuEventListenerFunction.value = useThrottle(function () {
    scrollTop.value = this.scrollTop
  }, 100)
  magellanMenu.value.addEventListener('scroll', scrollMagellanMenuEventListenerFunction.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollMagellanMenuEventListenerFunction.value)
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

.title {
  position: absolute;
  top: toRem(21);
  @include h6;
  opacity: 0.7;
}

.active-link-marker {
  position: absolute;
  top: calc($sidebarPadding + 1.25rem);
  left: 0;
  width: 0.25rem;
  background-color: var(--link-color);
  border-radius: toRem(4);
  transition: 150ms ease-in-out;
  @include gridMaxMQ {
    left: calc($sidebarPadding - 0.5rem);
  }
  &.hide {
    opacity: 0;
  }
}

.link {
  @include sidebar;
  display: block;
  margin-left: toRem(14);
  padding: toRem(3) 0;
  &.active {
    :deep(.button-label) {
      font-weight: 700;
    }
  }
}

.button-label {
  white-space: break-spaces;
  line-height: 1.2;
}
</style>
