<template>
  <ZeroDropdown
    :display-selected="true"
    :default-option="options[0]"
    @option-selected="handleOptionSelect">

    <template #toggle-button="{ togglePanel, panelOpen, selected }">
      <button class="selector" @click="togglePanel">
        <span class="selection">{{ selected }}</span>
        <IconChevron :class="['chevron', { up: panelOpen }]" />
      </button>
    </template>

    <template #dropdown-panel="{ setSelected }">
      <button
        v-for="option in options"
        :key="option"
        class="dropdown-option"
        @click="setSelected(option)">
        {{ option }}
      </button>
    </template>

  </ZeroDropdown>
</template>

<script setup>
// ======================================================================= Props
const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  }
})
// ===================================================================== Methods
/**
 * @method handleOptionSelect
 */
const handleOptionSelect = (val) => {
  console.log(val)
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.selector {
  display: flex;
  align-items: center;
  span,
  :deep(svg) {
    display: block;
  }
  .selection {
    margin-right: toRem(5);
  }
}

.dropdown-option {
  white-space: nowrap;
}
</style>
