<template>
  <div id="site-header" class="grid-max-height">

    <div class="grid-noGutter max-height">
      <div class="col">
        <div class="inner-container">

          <!-- ======================================================== Logo -->
          <NuxtLink to="/" class="logo-link">
            <Logo class="logo" />
          </NuxtLink>

          <!-- =================================================== Nav links -->
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

          <!-- =============================================== Theme toggler -->
          <ButtonThemeToggle />

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
// ======================================================================= Setup
const store = useGeneralStore()
store.getBaseData('general')

// ======================================================================== Data
const { general: generalSiteContent } = store.siteContent
const links = generalSiteContent.navigation.header
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $siteHeaderHeight;
  z-index: 1000;
  border-bottom: 1px solid var(--divider);
  background-color: var(--background-color);
}

.inner-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  @include small {
    flex-wrap: wrap;
    padding: 1rem 0;
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
