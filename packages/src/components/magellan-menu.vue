<template>
  <nav id="magellan-menu">

    <div
      :class="['active-link-marker', { hide: !activeUrlHash }]"
      :style="{ height: activeLinkMarkerHeight, transform: activeLinkMarkerPosition }" />

    <!-- <button
      v-for="(link, index) in magellanLinks"
      :key="index"
      ref="linkElements"
      :class="['link', link.level, { active: hashIsActive(link.hash) }]"
      :hash="link.hash.slice(1)"
      @click="goToSection(link.hash)">
      {{ link.text }}
    </button> -->

    <!-- {{ getLink(magellanLinks[0].hash) }} -->

    <ButtonClear
      v-for="(link, index) in magellanLinks"
      :key="index"
      tag="nuxt-link"
      :to="link.hash"
      :class="['link', link.level, { active: hashIsActive(link.hash) }]"
      :hash="link.hash.slice(1)"
      class="link">
      <div class="button-label" v-html="link.text" />
    </ButtonClear>

  </nav>
</template>

<script setup>
// ===================================================================== Imports
import { storeToRefs } from 'pinia'

// ======================================================================== Data
const magellanLinks = ref([])
// const linkElements = ref(null)
const activeLinkMarkerHeight = ref('0px')
// const router = useRouter()
const route = useRoute()
const generalStore = useGeneralStore()
const { activeUrlHash } = storeToRefs(generalStore)

// ==================================================================== Computed
const activeLinkMarkerPosition = computed(() => {
  // if (!activeUrlHash.value) { return false }
  // const activeLinkIndex = Array.from(linkElements.value).findIndex((link) => {
  //   console.log(link)
  //   return link.getAttribute('hash') === activeUrlHash.value
  // })
  return `translateY(${0 * 100}%)`
})

// ======================================================================= Hooks
onMounted(() => {
  magellanLinks.value = compileMagellanLinks()
  nextTick(() => {
    const linkElements = document.querySelector('#magellan-menu .link')
    // console.log(linkElements)
    // console.log(linkElements.value[0].$el)
    if (linkElements) {
      // console.log(linkElements.value[0].value)
      activeLinkMarkerHeight.value = `${linkElements[0].offsetHeight}px`
    }
  })
})

// ===================================================================== Methods
/**
 * @method compileMagellanLinks
 */
const compileMagellanLinks = () => {
  const headings = Array.from(document.querySelectorAll('.markdown *[id]'))
  return headings.reduce((acc, item) => {
    acc.push({
      level: `level-${item.localName}`,
      hash: `#${item.id}`,
      text: item.textContent
    })
    return acc
  }, [])
}

/**
 * @method hashIsActive
 */
const hashIsActive = (hash) => {
  if (!activeUrlHash.value || !hash) { return false }
  return hash.slice(1) === activeUrlHash.value
}

/**
 * @method goToSection
 */
// const goToSection = (hash) => {
//   const element = document.getElementById(hash.slice(1))
//   element.scrollIntoView({
//     behavior: 'smooth'
//   })
// }

/**
 * @method getLink
 */
// const getLink = (hash) => {
//   return `${route.path}${hash}` // path.replace('/docs/content', '')
// }
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
</style>
