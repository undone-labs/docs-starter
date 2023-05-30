<template>
  <div class="error-page">

    <div class="col-9">
      <h1> oh no </h1>
      <span v-html="message" />
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'ErrorPage',

  components: {
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageData () {
      return this.siteContent.general
    },
    heroButton () {
      return this.pageData['404_hero_button']
    },
    message () {
      return this.pageData['404_error_message']
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.error-page {
  margin-top: $siteHeaderHeight;
}

.inner-container {
  text-align: center;
}

::v-deep #hero {
  .overlay.type__opaque {
    background-color: rgba(15, 31, 26, 0.9);
  }
}
</style>
