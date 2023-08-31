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
      <span>{{ keyCommand }}</span>
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

// ===================================================================== Methods
const handleClick = () => {
  console.log('search button clicked')
  emit('clicked')
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
  :deep(path) {
    transition: 250ms ease;
    fill: var(--primary-text-color);
  }
}

.text {
  @include navigation;
  font-weight: 400;
}

.key-command {
  display: flex;
  border: solid 1px var(--divider);
  border-radius: toRem(5);
  padding: 0.25rem 0.5rem 0.1875rem 0.5rem;
  line-height: 1;
  span {
    line-height: inherit;
    opacity: 0.6;
  }
}

</style>
