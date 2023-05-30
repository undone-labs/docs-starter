<template>
  <component
    :is="tag"
    :to="tag === 'nuxt-link' ? to : false"
    :href="tag === 'a' || tag === 'nuxt-link' ? to : false"
    :disabled="disabled || loading"
    :target="target"
    :class="['button', { selected }]"
    @click="clickHandler($event)">

    <slot :loading="loading" />

  </component>
</template>

<script setup>
// ======================================================================= Props
const props = defineProps({
  tag: { // button, 'a' or nuxt-link
    type: String,
    required: false,
    default: 'button'
  },
  to: {
    type: [String, Object],
    required: false,
    default: undefined
  },
  target: {
    type: [String, Object],
    required: false,
    default: undefined
  },
  loader: {
    type: [String, Object],
    required: false,
    default: undefined
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  selected: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['clicked'])

// ======================================================================= Setup
const { $button } = useNuxtApp()
const id = props.loader || 'asd' // self.$uuid.v4()
const button = $button(id).get()
if (!button) {
  await $button(id).register()
}
const loading = button && button.loading

// ===================================================================== Methods
const clickHandler = (e) => {
  e.stopPropagation()
  if (!props.disabled) {
    if (typeof props.loader === 'string') {
      $button(id).set({ loading: true })
    }
    emit('clicked', e)
  }
}
</script>
