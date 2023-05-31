<template>
  <ContentDoc
    v-slot="{ doc }"
    :path="docPath"
    class="page">

    <ContentRendererMarkdown
      :value="doc.body"
      class="markdown" />

  </ContentDoc>
</template>

<script setup>
// ======================================================================= Setup
const route = useRoute()

// ======================================================================== Data
const docPath = `/main${route.path}`
</script>
