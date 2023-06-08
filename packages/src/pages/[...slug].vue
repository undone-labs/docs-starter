<template>
  <main class="page">

    <SiteHeader />

    <ContentList :query="QueryBuilderParams" v-slot="{ list }">

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
                :value="section.body"
                id="markdown"
                class="markdown" />
            </div>
          </div>

          <!-- ===================================================== Preview -->
          <div class="col-4">
            <div class="preview">
              <component
                v-if="getPreviewComponentName(section._path)"
                :is="getPreviewComponentName(section._path)" />
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
const headerHeight = ref(0)
const sections = ref([])
const loaded = ref(false)
const scroll = ref(null)
const route = useRoute()
const ctx = getCurrentInstance()
const dirNameSplit = route.path.slice(1).split('/')
const dirSlug = dirNameSplit[0] // get subdirectory slug
const pageSlug = dirNameSplit[1] // get page slug
const generalStore = useGeneralStore()

const QueryBuilderParams = {
  path: `/docs/content/${dirSlug}`
}

const pageHeading = useToPascalCase(dirSlug, ' ')

// ==================================================================== Computed
const headerHeightOffset = computed(() => headerHeight.value * 3)
const docPath = computed(() => `/docs/content${route.path}`)

// ======================================================================= Hooks
onMounted(() => {
  const header = document.getElementById('site-header')
  headerHeight.value = header.offsetHeight
  sections.value = Array.from(document.querySelectorAll('.markdown h2,h3,h4,h5,h6'))
  nextTick(() => {
    intersectionObserveHeadings()
    detectPageScrollTop()
  })
})

// ===================================================================== Methods
/**
 * @method intersectionObserveHeadings
 * @see {@link https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/} for a thorough overview of how the IntersectionObserver works
 * @todo Not sure if I need the "loaded" debounce in [...slug].vue
 */
const intersectionObserveHeadings = () => {
  const intersectionObserver = new IntersectionObserver((entries) => {
    if (!loaded.value) { loaded.value = true; return }
    const entry = entries[0]
    const entryId = entry.target.id
    const intersectingTop = entry.boundingClientRect.top <= headerHeightOffset.value
    const hash = window.location.hash.replace('#', '')
    // console.log(entryId, entry.intersectionRatio, entry.isIntersecting)
    // if (!entry.isIntersecting) { return }
    if (intersectingTop) {
      if (entryId !== hash) {
        history.replaceState({}, null, `${route.path}#${entryId}`)
        generalStore.setActiveUrlHash(entryId)
      } else {
        const index = sections.value.findIndex(section => section.id === entryId)
        if (index !== 0) {
          const current = sections.value[index - 1]
          history.replaceState({}, null, `${route.path}#${current.id}`)
          generalStore.setActiveUrlHash(current.id)
        }
      }
    }
  }, {
    rootMargin: `${-headerHeightOffset.value}px 0px 0px 0px`
  })
  sections.value.forEach((section) => {
    intersectionObserver.observe(section)
  })
}

/**
 * @method detectPageScrollTop
 */
const detectPageScrollTop = () => {
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
