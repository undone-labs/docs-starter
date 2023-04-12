<template>
  <header
    id="site-header"
    ref="header">

    <div class="grid-noGutter">
      <div class="col">
        <div class="inner-container">

          <!-- ======================================================== Logo -->
          <nuxt-link
            to="/"
            class="logo-link"
            @click.native="closeNav">
            <!-- <Logo class="logo" /> -->
          </nuxt-link>

          <nav id="site-nav">
            <!-- =============================================== Nav links -->
            <div
              ref="buttonList"
              class="button-list">
              <ButtonX
                v-for="(link, index) in links"
                :key="index"
                ref="navItems"
                :to="link.href"
                :selected="$isRouteCurrent($route, link.href)"
                :tag="link.type"
                :target="link.target"
                theme="nav"
                class="site-nav-link">
                <div class="text" v-html="link.label" />
              </ButtonX>
              <ButtonA
                v-if="cta"
                :to="cta.href"
                tag="button"
                class="site-nav-cta"
                @clicked="$highlightApplyForm">
                <div class="text" v-html="cta.label" />
              </ButtonA>
            </div>

          </nav>

          <ThemeToggle />

        </div>

        <!-- ================================================== Mobile nav -->
        <!-- <MobileNav
            v-else
            ref="mobileNav"
            :links="links"
            :cta="cta" /> -->

      </div>
    </div>

  </header>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// import Logo from '@/components/logo'
import ButtonA from '@/components/buttons/button-a'
import ButtonX from '@/components/buttons/button-x'
import ThemeToggle from '@/components/theme-toggle'
// import MobileNav from '@/components/mobile-nav'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    // Logo,
    ButtonA,
    ButtonX,
    ThemeToggle
    // MobileNav
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    navigationContent () {
      return this.siteContent.general.navigation
    },
    links () {
      return this.navigationContent.header
    },
    cta () {
      return this.navigationContent.cta
    }
  },

  methods: {
    closeNav () {
      const mobileNav = this.$refs.mobileNav
      if (mobileNav && mobileNav.modal) {
        mobileNav.toggleModal()
      }
    }
  }
}
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
  // &.mini {
  //   height: $siteHeaderHeightMini;
  //   @include mini {
  //     height: $siteHeaderHeight;
  //   }
  // }
}

[class~="grid"],
[class*="grid-"],
[class*="grid_"] {
  height: 100%;
}

.inner-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;;
  align-items: center;
  width: 100%;
  height: 100%;
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
  padding-right: toRem(46);
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
  height: 71.4%;
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

.button.site-nav-cta {
  padding: 0.375rem 1.5rem;
  margin-left: 3.125rem;
  @include large {
    padding: 0.25rem 1.25rem;
    margin-left: 2rem;
    :deep(.button-content) {
      font-size: 0.9375rem;
    }
  }
}

</style>
