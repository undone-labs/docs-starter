<template>
  <main class="page">

    <!-- ============================================================ Header -->
    <SiteHeader />

    <div class="grid">

      <!-- ========================================================= Content -->
      <div class="col-6" data-push-left="off-2">
        <div class="content">
          <ContentDoc v-slot="{ doc }">
            <h1
              :id="doc._dir"
              ref="heading"
              class="heading">
              {{ getHeading(doc._dir) }}
            </h1>

            <ContentRendererMarkdown
              :value="doc.body"
              id="markdown"
              class="markdown" />

          </ContentDoc>
        </div>
      </div>

      <!-- ========================================================= Preview -->
      <div class="col-4">
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

// ======================================================================== Data
const headerHeight = ref(0)
const sections = ref([])
const loaded = ref(false)
const scroll = ref(null)
const route = useRoute()

// ==================================================================== Computed
const headerHeightOffset = computed(() => headerHeight.value * 3)

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
 *
 * @method getHeading
 *
 * @param {string} dirName
 * @returns {string}
 */
const getHeading = (dirName) => {
  const converted = dirName.split('-').map(word => (word.charAt(0).toUpperCase() + word.slice(1)))
  return converted.join(' ')
}

/**
 * @method intersectionObserveHeadings
 * @see {@link https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/} for a thorough overview of how the IntersectionObserver works
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
      } else {
        const index = sections.value.findIndex(section => section.id === entryId)
        if (index !== 0) {
          const current = sections.value[index - 1]
          history.replaceState({}, null, `${route.path}#${current.id}`)
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
    }
  }
  scroll.value = useThrottle(scrollHandler, 100)
  window.addEventListener('scroll', scroll.value)
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// Content
.content,
.preview {
  padding: $bodyOffsetTop 2rem 0 2rem;
  @include gridMaxMQ {
    padding-left: 0;
  }
}

.content {
  padding-bottom: 5rem;
}

.preview {
  @include gridMaxMQ {
    padding-right: 0;
  }
}

.heading {
  margin-bottom: 2rem;
}
</style>
