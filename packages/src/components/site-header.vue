<template>
  <header id="site-header">

    <!-- ============================================================== Logo -->
    <NuxtLink to="/" class="logo-link">
      <Logo class="logo" />
    </NuxtLink>

    <!-- ========================================================= Nav links -->
    <nav id="site-nav">
      <div class="button-list">
        <ButtonClear
          v-for="(link, index) in links"
          v-bind="link"
          :key="index"
          ref="navItems"
          theme="nav"
          class="site-nav-link">
          <div class="text" v-html="link.label" />
        </ButtonClear>
      </div>
    </nav>

    <!-- ===================================================== Theme toggler -->
    <ButtonThemeToggle />

  </header>
</template>

<script setup>
// ===================================================================== Imports
import Navigation from '@/data/components/navigation'

// ======================================================================== Data
const links = Navigation.header
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  // left: calc((100% - $gridWidth) / 2 + $sidebarWidth);
  // width: calc(100% - (100% - $gridWidth) / 2 - $sidebarWidth);
  width: 100%;
  height: $siteHeaderHeight;
  padding: 0 2.5rem;
  border-bottom: 1px solid var(--divider);
  background-color: var(--background-color);
  z-index: 1000;
  // @include gridMaxMQ {
  //   left: $sidebarWidth;
  //   width: calc(100% - $sidebarWidth);
  // }
}

// ////////////////////////////////////////////////////////////////// Navigation
#site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.button-list {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 2rem;
  @include large {
    padding-left: 0.25rem;
  }
}

.site-nav-link {
  &:not(:last-child) {
    margin-right: 3.125rem;
  }
  @include large {
    &:not(:last-child) {
      margin-right: 2rem;
    }
  }
}

.logo-link {
  position: relative;
  z-index: 10000;
  display: block;
  height: 75%;
}

.logo {
  display: block;
  height: 100%;
  transition: 150ms ease-out;
  &:hover {
    transition: 150ms ease-in;
    transform: scale(1.05);
  }
}
</style>
