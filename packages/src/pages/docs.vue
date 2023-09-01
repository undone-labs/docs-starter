<script setup>
// ===================================================================== Imports
import Navigation from '@/docs/data/sidebar.json'

// ======================================================================= Setup
await navigateTo(`/docs${Navigation[0].children[0].href}`)
</script>
