<template>
  <div class="layout default">

    <SiteHeader />

    <div class="grid">
      <div class="col-3">

        <Sidebar />

      </div>
      <div class="col-9">

        <slot />

      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.layout {
  padding-top: $siteHeaderHeight;
}
</style>
