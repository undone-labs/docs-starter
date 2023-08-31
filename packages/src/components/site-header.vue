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
    <div id="site-toolbar">
      <div class="toolbar-list">

        <ButtonThemeToggle />

        <ZeroButton
          tag="a"
          :to="githubUrl"
          target="_blank"
          :disabled="!githubUrl"
          class="github-link">
          <IconGithub />
        </ZeroButton>

        <ButtonSearch />

        <DropdownSelector :options="languageOptions" />

      </div>
    </div>

  </header>
</template>

<script setup>
// ===================================================================== Imports
import Navigation from '@/data/components/navigation'

// ======================================================================== Data
const links = Navigation.header
const githubUrl = Navigation.toolbar.github_url
const languageOptions = Navigation.toolbar.language_options

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
  width: 100%;
  height: $siteHeaderHeight;
  padding: 1rem 2.5rem;
  border-bottom: 1px solid var(--divider);
  background-color: var(--background-color);
  z-index: 1000;
}

// /////////////////////////////////////////////////////////////////// Site Logo
.logo-link {
  position: relative;
  display: block;
  z-index: 10000;
}

.logo {
  display: block;
  height: 100%;
  transition: 150ms ease-out;
  &:hover {
    transition: 150ms ease-in;
    transform: scale(1.05);
  }
  :deep(path) {
    transition: 150ms ease-out;
    fill: var(--primary-text-color);
  }
  :deep(rect) {
    transition: 150ms ease-out;
    stroke: var(--primary-text-color);
  }
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

// ///////////////////////////////////////////////////////////////////// Toolbar
.toolbar-list {
  display: flex;
  align-items: center;
  & > * {
    &:not(:last-child) {
      margin-right: toRem(38);
    }
  }
}

.github-link {
  display: flex;
  :deep(path) {
    transition: 150ms ease-out;
    fill: var(--primary-text-color);
  }
}

</style>
