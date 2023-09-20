<template>
  <div class="page error">

    <AlgoliaSearch />

    <SiteHeader />

    <Sidebar />

    <div class="grid">
      <div class="col-6_md-8" data-push-left="off-2_lg-3_md-0">
        <div class="page-content">

          <h1 class="heading">
            {{ error.statusCode }}
          </h1>

          <div class="message">
            {{ error.message }}
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// ======================================================================== Data
defineProps({
  error: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.heading {
  @include h1;
  font-size: toRem(100);
  line-height: 1;
  color: var(--link-color);
  margin-bottom: 2rem;;
}

.message {
  @include h3;
  transition: color 500ms;
}
</style>
