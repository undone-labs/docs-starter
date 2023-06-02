<template>
  <main class="page">

    <!-- ============================================================ Header -->
    <SiteHeader />

    <div class="grid">

      <!-- ========================================================= Content -->
      <div class="col-6" data-push-left="off-3">
        <ContentDoc v-slot="{ doc }">
          <ContentRendererMarkdown
            :value="doc.body"
            class="markdown" />
        </ContentDoc>
      </div>

      <!-- ========================================================= Preview -->
      <div class="col-3">
        <div class="preview">
          Preview
        </div>
      </div>

    </div>

  </main>
</template>

<script setup>
// ======================================================================= Setup
definePageMeta({
  layout: 'docs'
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// Content
.markdown,
.preview {
  padding: 0 2rem;
  padding-top: $bodyOffsetTop;
  @include gridMaxMQ {
    padding-left: 0;
  }
}

.preview {
  @include gridMaxMQ {
    padding-right: 0;
  }
}
</style>
