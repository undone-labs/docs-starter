<template>
  <div class="api-explorer">
    <div
      v-for="(slider, i) in props.sliders"
      :key="`slider-${i}`"
      class="api-slider">

      <div class="slider-heading">
        <div v-if="slider.title" class="title">
          {{ slider.title }}
        </div>
        <div v-if="slider.rest" class="rest">
          <span class="monospace method">{{ slider.rest.method }}</span>
          <span class="monospace endpoint">{{ slider.rest.endpoint }}</span>
        </div>
        <div v-if="slider.response" class="response">
          <span class="monospace text">{{ slider.response.text }}</span>
          <span class="monospace response-code"> {{ slider.response.code }}</span>
        </div>
      </div>

      <div class="slider">

        <div
          v-if="activeSlideContent[i]"
          class="slider-tabs">
          <div
            v-for="(slide, j) in slider.slides"
            :key="`slide-${i}-${j}`"
            :class="['tab', { active: `slide-${i}-${j}` === activeSlideContent[i].key }]"
            @click="setActiveSlideContent(i, slide, `slide-${i}-${j}`)">
            {{ slide.tab }}
          </div>
        </div>

        <div class="slide-content">
          <pre>
            <code
              v-if="activeSlideContent[i]"
              :class="['code-block', `language-${activeSlideContent[i].language}`]"
              v-html="activeSlideContent[i].highlighted"></code>
          </pre>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
// ===================================================================== Imports
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import hljsCurl from 'highlightjs-curl'

// ======================================================================= Props
const props = defineProps({
  sliders: {
    type: Array,
    required: true,
    default: () => []
  }
})

// ==================================================================== Computed
const activeSlideContent = ref([])

// ======================================================================= Hooks
onMounted(() => {
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('curl', hljsCurl)
  hljs.highlightAll()
  props.sliders.forEach((slider, i) => {
    setActiveSlideContent(i, slider.slides[0], `slide-${i}-0`)
  })
})

// ===================================================================== Methods
const setActiveSlideContent = (index, slide, key) => {
  const content = typeof slide.content === 'object' ?
    JSON.stringify(slide.content, undefined, 2).trim() :
    slide.content
  activeSlideContent.value[index] = {
    language: slide.language,
    highlighted: hljs.highlight(content, { language: slide.language }).value,
    key
  }
}

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.slider-heading {
  display: flex;
  padding: 0 toRem(18);
  margin-bottom: toRem(9);
  .monospace {
    font-family: $fontPFDinMono;
    font-size: toRem(14);
    font-weight: 500;
    line-height: leading(21, 14);
    color: var(--theme-color);
    &:not(:last-child) {
      margin-right: toRem(7);
    }
  }
  .method,
  .response-code {
    color: var(--code-text-color);
    padding: toRem(3) toRem(7);
    padding-bottom: toRem(1);
    background-color: var(--background-color__secondary);
    border-radius: toRem(2);
  }
}

.rest,
.response {
  display: flex;
  align-items: center;
  font-family: $fontPFDinMono;
}

.slider {
  border: solid 2px var(--divider);
  border-radius: toRem(5);
  margin-bottom: toRem(18);
}

.slider-tabs {
  display: flex;
  border-bottom: solid 2px var(--divider);
  background-color: var(--background-color__secondary);
}

.slide-content {
  padding: toRem(12) toRem(24);
  background-color: var(--background-color);
  pre {
    display: flex;
    margin: 0;
  }
}

.tab {
  position: relative;
  padding: toRem(7) toRem(24);
  cursor: pointer;
  @include h5;
  color: var(--theme-color);
  &:after {
    content: '';
    position: absolute;
    top: calc(100% - 0.5px);
    left: toRem(24);
    width: calc(100% - toRem(48));
  }
  &.active {
    &:after {
      border-bottom: solid 3px var(--link-color);
    }
  }
  &:not(:last-child) {
    margin-right: toRem(5);
  }
}

.code-block {
  font-family: $fontPFDinMono;
  @include codeBlock;
  white-space: break-spaces;
}

</style>
