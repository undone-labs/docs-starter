<template>
  <div class="layout default">

    <SiteHeader />

    <Sidebar />

    <AlgoliaSearch />

    <slot />

    <SiteFooter />

  </div>
</template>

<script setup>
// ======================================================================= Setup
if (process.client && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  useHead({
    meta: [
      { name: 'msapplication-config', content: '/favicon/light/browserconfig.xml' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/light/favicon-96x96.png' },
      { rel: 'manifest', href: '/favicon/light/manifest.json' }
    ]
  })
}
</script>
