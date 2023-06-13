<template>
  <main class="page">

    <SiteHeader />

    <ContentList v-slot="{ list }" :query="QueryBuilderParams">

      <!-- ========================================================== Header -->
      <header>
        <div class="grid">
          <div class="col-6" data-push-left="off-2">
            <div class="content">
              <h1
                :id="dirSlug"
                ref="heading"
                class="heading">
                {{ pageHeading }}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <!-- ======================================================== Sections -->
      <section
        v-for="section in list"
        :key="section._path"
        class="section">

        <div class="grid">

          <!-- ===================================================== Content -->
          <div class="col-6" data-push-left="off-2">
            <div class="content">
              <ContentRendererMarkdown
                id="markdown"
                :value="section.body"
                class="markdown" />
            </div>
          </div>

          <!-- ===================================================== Preview -->
          <div class="col-4">
            <div class="preview">
              <component
                :is="getPreviewComponentName(section._path)"
                v-if="getPreviewComponentName(section._path)" />
            </div>
          </div>

        </div>

      </section>

    </ContentList>

  </main>
</template>

<script setup>
// ======================================================================= Setup
definePageMeta({
  layout: 'docs'
})

// ======================================================================== Data
const intersectionObserver = ref(null)
const headerHeight = ref(0)
const sections = ref([])
const scroll = ref(null)
const route = useRoute()
const navigatedByRoute = ref(false)
const navigatedByRouteDebounce = ref(null)
const ctx = getCurrentInstance()
const dirNameSplit = route.path.slice(1).split('/')
const dirSlug = dirNameSplit[0] // get subdirectory slug
const generalStore = useGeneralStore()

const QueryBuilderParams = {
  path: `/docs/content${route.path}`
}

const pageHeading = useToPascalCase(dirSlug, ' ')

// ==================================================================== Computed
const headerHeightOffset = computed(() => headerHeight.value * 3)

// ==================================================================== Watchers
watch(route, (route) => {
  if (navigatedByRouteDebounce.value) { clearTimeout(navigatedByRouteDebounce.value) }
  navigatedByRouteDebounce.value = setTimeout(() => {
    navigatedByRoute.value = false
    clearTimeout(navigatedByRouteDebounce.value)
  }, 100)
  navigatedByRoute.value = true
  generalStore.setActiveUrlHash(route.hash.slice(1))
})

// ======================================================================= Hooks
onMounted(() => {
  const header = document.getElementById('site-header')
  headerHeight.value = header.offsetHeight
  sections.value = Array.from(document.querySelectorAll('.markdown h2,h3,h4,h5,h6'))
  intersectionObserveHeadings()
  detectPageScrolledToTop()
})

onBeforeUnmount(() => {
  sections.value.forEach((section) => {
    intersectionObserver.value.unobserve(section)
  })
})

// ===================================================================== Methods
/**
 * @method intersectionObserveHeadings
 * @see {@link https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/} for a thorough overview of how the IntersectionObserver works
 */
const intersectionObserveHeadings = () => {
  intersectionObserver.value = new IntersectionObserver((entries) => {
    const entry = entries[0]
    const entryId = entry.target.id
    const intersectingTop = entry.boundingClientRect.top <= headerHeightOffset.value
    const hash = window.location.hash.slice(1)
    let activeUrlHash = hash
    let activePath
    // console.log('→', entryId, intersectingTop, navigatedByRoute.value)
    /**
     * While scrolling, update URL hash from DOM and use hash from DOM headings.
     * This does not fire if navigating via the magellan nav.
     */
    if (!navigatedByRoute.value && intersectingTop) {
      if (entryId !== hash) {
        activePath = `${route.path}#${entryId}`
        activeUrlHash = entryId
      } else {
        const index = sections.value.findIndex(section => section.id === entryId)
        if (index !== 0) {
          const current = sections.value[index - 1]
          activePath = `${route.path}#${current.id}`
          activeUrlHash = current.id
        } else {
          activeUrlHash = false
        }
      }
    }
    if (!navigatedByRoute.value && activeUrlHash) {
      history.replaceState({}, null, activePath)
      generalStore.setActiveUrlHash(activeUrlHash)
    }
  }, {
    rootMargin: `${-headerHeightOffset.value}px 0px 0px 0px`
  })
  sections.value.forEach((section) => {
    intersectionObserver.value.observe(section)
  })
}

/**
 * @method detectPageScrolledToTop
 */
const detectPageScrolledToTop = () => {
  const scrollHandler = () => {
    const y = window.pageYOffset || document.documentElement.scrollTop
    if (y <= headerHeight.value) {
      history.replaceState({}, null, route.path)
      generalStore.setActiveUrlHash(false)
    }
  }
  scroll.value = useThrottle(scrollHandler, 100)
  window.addEventListener('scroll', scroll.value)
}

/**
 * @method getPreviewComponentName
 */
const getPreviewComponentName = (path) => {
  const componentList = ctx.appContext.components
  const previewComponentName = 'Doczilla' + useToPascalCase(path.split('/').pop())
  const previewExists = componentList.hasOwnProperty(previewComponentName)
  if (previewExists) { return previewComponentName }
  return false
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// Content
.page {
  padding-top: $bodyOffsetTop;
  padding-bottom: 5rem;
}

.header,
.content,
.preview {
  padding: 0 2rem 0 2rem;
  @include gridMaxMQ {
    padding-left: 0;
  }
}

.preview {
  height: 100%;
  @include gridMaxMQ {
    padding-right: 0;
  }
  > div {
    position: sticky;
    top: $siteHeaderHeight + 1rem;
  }
}

.heading {
  margin-bottom: 2rem;
}
</style>
