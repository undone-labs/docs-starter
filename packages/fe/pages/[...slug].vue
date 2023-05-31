<template>
  <ContentDoc
    v-slot="{ doc }"
    class="page">

    <ContentRendererMarkdown
      :value="doc.body"
      class="markdown" />

  </ContentDoc>
</template>
