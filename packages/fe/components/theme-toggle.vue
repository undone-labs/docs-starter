<template>
  <button
    id="theme-toggle"
    type="button"
    :class="theme"
    @click="toggleTheme">
    <span class="icon-container">
      <IconSun v-if="theme === 'light'" />
      <IconMoon v-if="theme === 'dark'" />
    </span>
  </button>
</template>

<script>
import IconSun from '@/components/icons/sun'
import IconMoon from '@/components/icons/moon'

export default {
  name: 'ThemeToggle',

  components: {
    IconSun,
    IconMoon
  },

  data () {
    return {
      theme: null
    }
  },

  mounted () {
    const initialTheme = this.$ls.get('theme') || 'light'
    // const initialTheme = 'light'
    this.setTheme(initialTheme)
  },

  methods: {
    setTheme (newTheme) {
      this.$ls.set('theme', newTheme)
      this.theme = newTheme
      document.documentElement.className = newTheme
    },
    toggleTheme () {
      switch (this.theme) {
        case 'light':
          this.setTheme('dark')
          break
        case 'dark':
          this.setTheme('light')
          break
      }
    }
  }

}
</script>

<style lang="scss" scoped>
#theme-toggle {
  display: flex;
  width: 2.5rem;
  height: toRem(20);
  border: 1px solid var(--primary-text-color);
  border-radius: toRem(10);
  background-color: var(--code-background-color);
}

.icon-container {
  margin: 1px;
  background-color: var(--background-color);
  border-radius: 50%;
  box-shadow: var(--shadow-1);
}

.icon {
  opacity: 0;
  height: toRem(14);
  margin: 1px 2px;
  :deep(path){
    color: var(--sidebar-text-color);
  }
}

.light {
  .icon-container {
    transform: translateX(0);
    transition: transform 250ms ease-in;
    .icon-sun {
      opacity: 1;
      transition: opacity 100ms ease-in;
    }
  }
}

.dark {
  .icon-container {
    display: block;
    transform: translateX(toRem(18));
    transition: transform 250ms ease-in;
    .icon-moon {
      opacity: 1;
      transition: opacity 100ms ease-in;
    }
  }
}

</style>
