<script setup>
// ===================================================================== Imports
import Sidebar from '@/data/sidebar.json'

// ======================================================================= Setup
await navigateTo(`/docs${Sidebar[0].children[0].href}`)
</script>
