<template>
  <div class="magellan-menu sticky ">
    <div class="title">
      On this page
    </div>

    <template
      v-for="(link, index) in links">
      <a
        :key="index"
        class="link"
        v-html="link" />
    </template>

  </div>
</template>

<script>
export default {
  name: 'MagellanMenu',

  props: {
    links: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.magellan-menu {
  align-self: flex-start;
  display: flex;
  flex-flow: column nowrap;
  margin-left: 6rem;
  position: sticky;
  top: calc($siteHeaderHeight + 2rem);
  bottom: 0;
  min-width: 25%;
}
.title {
  @include magellanTitle;
  margin-bottom: toRem(4);
}

.link {
  @include magellan;
}
</style>
