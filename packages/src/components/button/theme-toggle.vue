<template>
  <button
    id="theme-toggle"
    type="button"
    :class="theme"
    @click="toggleTheme">
    <span class="icon-container">

      <IconSun v-if="theme === 'light'" class="icon sun" />

      <IconMoon v-if="theme === 'dark'" class="icon moon" />

    </span>
  </button>
</template>

<script setup>
// ===================================================================== Imports
import { storeToRefs } from 'pinia'

// ======================================================================= Setup
const generalStore = useGeneralStore()

// ======================================================================== Data
const { theme } = storeToRefs(generalStore)

// ======================================================================= Hooks
onMounted(() => {
  const initialTheme = localStorage.getItem('theme')
  if (initialTheme) {
    generalStore.setTheme(initialTheme)
  }
})

// ===================================================================== Methods
/**
 * @method toggleTheme
 */
const toggleTheme = () => {
  const toggle = theme.value === 'light' ? 'dark' : 'light'
  generalStore.setTheme(toggle)
}
</script>

<style lang="scss" scoped>
$toggleHeight: toRem(30);

// ///////////////////////////////////////////////////////////////////// General
#theme-toggle {
  display: flex;
  width: toRem(50);
  height: $toggleHeight;
  border: 2px solid var(--divider);
  border-radius: toRem(17.5);
  box-sizing: border-box;
  background-color: var(--background-color);
  transition: 150ms ease-out;
  &:hover {
    // border-color: var(--primary-text-color);
    transition: 150ms ease-in;
  }
}

.icon-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(#{$toggleHeight} - 8px);
  height: calc(#{$toggleHeight} - 8px);
  margin-top: 2px;
  margin-left: 2px;
  background-color: var(--secondary-background-color);
  border-radius: 50%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  transition: transform 150ms ease-out;
}

.icon {
  display: block;
  width: toRem(10);
  height: toRem(10);
  :deep(path) {
    color: var(--primary-text-color);
  }
}

// ////////////////////////////////////////////////////////////////////// Themes
.light,
.dark {
  .icon-container {
    transition: transform 150ms ease-in;
  }
}

.light {
  .icon-container {
    transform: translateX(0);
  }
}

.dark {
  .icon-container {
    transform: translateX(calc(#{$toggleHeight} - 10px));
  }
}
</style>
