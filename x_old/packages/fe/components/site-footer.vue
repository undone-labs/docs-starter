<template>
  <footer id="site-footer">

    <section class="section-footer">
      <div class="grid-noGutter-equalHeight">

        <div class="col-3_md-5_mi-12">
          <div class="logo-cta">
            <!-- <Logo class="site-logo" /> -->
          </div>
        </div>

        <div class="col-4_md-7_mi-12">
          <div class="footer-nav">
            <ButtonX
              v-for="(link, i) in primaryLinks"
              :key="`primary-link-${i}`"
              :tag="link.type"
              :to="link.href"
              :target="link.target"
              :disabled="link.disabled"
              class="primary-link">
              {{ link.label }}
            </ButtonX>
          </div>
        </div>

      </div>

    </section>

    <section class="section-copyright">
      <div class="grid-noGutter">
        <div class="col">
          <div
            v-if="footerContent"
            class="copyright-content">

            <div class="secondary-links">
              <ButtonX
                v-for="(item, j) in secondaryLinks"
                :key="`secondary-link-${j}`"
                :to="item.url"
                :tag="item.type"
                :target="item.target"
                class="secondary-link">
                <component
                  :is="getIconComponent(item.icon)"
                  :class="`icon-${item.icon}`" />
              </ButtonX>
            </div>

            <div class="copyright-text" v-html="copyright.text" />

          </div>
        </div>
      </div>
    </section>

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// import Logo from '@/components/logo'
import ButtonX from '@/components/buttons/button-x'
import Card from '@/components/card'
import GithubIcon from '@/components/icons/github'
import SlackIcon from '@/components/icons/slack'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
    // Logo,
    ButtonX,
    Card,
    GithubIcon,
    SlackIcon
    // ButtonD
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    footerContent () {
      return this.siteContent.general ? this.siteContent.general.footer : false
    },
    primaryLinks () {
      if (this.footerContent) { return this.footerContent.links }
      return []
    },
    videoCta () {
      if (this.footerContent) { return this.footerContent.video_cta }
      return false
    },
    copyright () {
      return this.footerContent.copyright
    },
    secondaryLinks () {
      return this.copyright.links
    }
  },

  methods: {
    isRouteCurrent (href) {
      const route = this.$route
      if (route.path === href) { return true }
      return false
    },
    getIconComponent (type) {
      let icon
      switch (type) {
        case 'github': icon = 'GithubIcon'; break
        case 'slack': icon = 'SlackIcon'; break
        default: icon = 'div'
      }
      return icon
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  position: relative;
  overflow: hidden;
}

.section-footer,
.section-copyright {
  position: relative;
  z-index: 10;
}

.section-footer {
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
}

.site-logo {
  position: absolute;
}

// //////////////////////////////////////////////////////////////////// Logo CTA
.logo-cta {
  position: relative;
  .site-logo {
    width: 58%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @include mini {
      width: toRem(194);
    }
  }
  @include mini {
    padding: 1.5rem 0;
    height: toRem(350) !important;
  }
}

.cta-wrapper {
  position: absolute;
  width: 39%;
  right: 1rem;
  top: calc(50% + 1rem);
  cursor: pointer;
  @include mini {
    width: toRem(130);
    right: unset;
    left: calc(50% + 1rem);
  }
}

.cta-spinner {
  position: relative;
  width: 100%;
  animation: spinning 15s infinite linear reverse;
  &:hover {
    animation-play-state: paused;
  }
}

.cta-arrow {
  position: absolute;
  top: calc(50% - 4px);
  left: calc(50% + 1px);
  transform: translate(-50%, -50%);
}

@keyframes spinning {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// ///////////////////////////////////////////////////////////////////////// Nav
.footer-nav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  margin-bottom: 0.75rem;
  border-left: 3px solid --brand-color;
  border-right: 3px solid --brand-color;
  @include medium {
    border-right: none;
  }
  @include mini {
    border-left: none;
  }
}

:deep(.primary-link) {
  position: relative;
  padding: toRem(38) toRem(40);
  width: 100%;
  border-bottom: 3px solid --brand-color;
  font-weight: 500;
  :deep(.button) {
    @include mini {
      font-size: toRem(18);
    }
  }
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    .button-content {
      transform: scale(1.05);
    }
  }
  @include medium {
    width: calc(100% + 100vw * 0.041665);
  }
  @include mini {
    &:before {
      content: '';
      position: absolute;
      right: 100%;
      top: -7px;
      width: calc(100vw * 0.041665);
      height: 3px;
    }
    &:first-child {
      border-top: 3px solid --brand-color;
      &:before {
        top: -3px;
      }
    }
  }
}

// /////////////////////////////////////////////////////////// Copyright Section
.copyright-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: toRem(80);
  @include mini {
    height: unset;
    flex-direction: column;
    margin-top: toRem(45);
    margin-bottom: toRem(68);
    align-items: flex-start;
  }
}

.copyright-text {
  padding-left: 1rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: leading(30, 16);
  text-align: right;
  @include large {
    font-size: 0.875rem;
    line-height: leading(20, 14);
  }
  @include mini {
    padding: 0 1rem;
    margin-top: toRem(38);
  }
}

.secondary-links {
  display: flex;
  align-items: center;
}

.secondary-link {
  padding: 0;
  height: 1.875rem;
  border-bottom: none;
  transition: 150ms ease-out;
  &:hover {
    transition: 150ms ease-in;
    transform: scale(1.2);
  }
  &:not(:last-child) {
    margin-right: 1.5625rem;
  }
  @include mini {
    padding: 0 1rem;
  }
}

.icon-slack,
.icon-github {
  width: 1.875rem;
}
</style>
