<template>
  <div :class="`page`">
    INTRODUCTION
  </div>
</template>

<script setup>
// ======================================================================= Setup
const store = useGeneralStore()
store.getBaseData('general')
</script>
