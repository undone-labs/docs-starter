<template>
  <nav id="magellan-menu">

    <button
      v-for="(link, index) in links"
      :key="index"
      :class="['link', link.level]"
      @click="link.hash">
      {{ link.text }}
    </button>

  </nav>
</template>

<script setup>
// ======================================================================== Data
const links = ref([])

// ======================================================================= Hooks
onMounted(() => {
  links.value = compileLinks()
})

// ===================================================================== Methods
const compileLinks = () => {
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
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#magellan-menu {
  overflow-y: scroll;
}

.link {
  @include sidebar;
  display: block;
}
</style>
