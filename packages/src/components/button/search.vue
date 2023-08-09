<template>
  <button
    class="search-button"
    @click="handleClick">

    <div v-if="icon" class="search-icon">
      <IconSearch />
    </div>

    <div v-if="text" class="text">
      {{ text }}
    </div>

    <div v-if="keyCommand" class="key-command">
      {{ keyCommand }}
    </div>

  </button>
</template>

<script setup>
// ======================================================================= Props
const props = defineProps({
  icon: {
    type: Boolean,
    required: false,
    default: true
  },
  text: {
    type: String,
    required: false,
    default: 'Search'
  },
  keyCommand: {
    type: String,
    required: false,
    default: '⌘ K'
  }
})

const emit = defineEmits(['clicked'])

// ======================================================================== Data
const generalStore = useGeneralStore()

// ===================================================================== Methods
const handleClick = () => {
  emit('clicked')
  generalStore.setSearchModalActive()
}

</script>

<style lang="scss" scoped>
.search-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    &:not(:last-child) {
      margin-right: toRem(14);
    }
  }
}

.search-icon {
  display: flex;
}

.key-command {
  display: flex;
  border: solid 1px var(--divider);
  border-radius: toRem(5);
  padding: 0.25rem 0.5rem 0.1875rem 0.5rem;
  line-height: 1;
}
</style>
