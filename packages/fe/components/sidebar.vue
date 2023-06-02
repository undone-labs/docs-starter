<template>
  <aside class="sidebar">

    <div class="navigation-wrapper">
      <div class="gradient top" />
      <ContentNav />
      <div class="gradient bottom" />
    </div>

    <div class="magellan-menu-wrapper">
      <div class="gradient top" />
      <MagellanMenu />
      <div class="gradient bottom" />
    </div>

  </aside>
</template>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.sidebar {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: calc((100vw - $gridWidth) / 2);
  width: $sidebarWidth;
  height: 100%;
  border-right: 1px solid var(--divider);
  @include gridMaxMQ {
    left: 0;
  }
}

#content-nav,
#magellan-menu {
  height: 100%;
  overflow-y: scroll;
  padding: 2rem;
  padding-left: 0;
  @include customMaxMQ($gridWidth + 1rem) {
    padding-left: 2rem;
  }
}

.gradient {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2rem;
  pointer-events: none;
  z-index: 100;
  &.top {
    top: 0;
    background: linear-gradient(to bottom, white, rgba(white, 0));
  }
  &.bottom {
    bottom: 0;
    background: linear-gradient(to top, white, rgba(white, 0));
  }
}

// //////////////////////////////////////////////////////// [Navigation] content
.navigation-wrapper {
  position: relative;
  max-height: calc(100vh * 0.618);
}

// /////////////////////////////////////////////////////// [Navigation] magellan
.magellan-menu-wrapper {
  position: relative;
  min-height: calc(100vh * 0.382);
  &:after {
    content: '';
    position: absolute;
    bottom: calc(100% - 1px);
    right: 0;
    height: 1px;
    width: calc(100% + (100vw - $gridWidth) / 2);
    background-color: var(--divider);
    @include gridMaxMQ {
      width: calc(100% + (100vw * 0.041665));
    }
  }
  .gradient.top {
    top: 1px;
  }
}
</style>
