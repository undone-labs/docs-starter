import Path from 'path'

export default {
  components: [
    { path: Path.resolve(__dirname, 'components/search-button.vue'), name: 'ZeroAlgoliaSearchButton' },
    { path: Path.resolve(__dirname, 'components/modal.vue'), name: 'ZeroAlgoliaModal' },
    { path: Path.resolve(__dirname, 'components/results.vue'), name: 'ZeroAlgoliaResults' }
  ],
  stores: [
    { path: Path.resolve(__dirname, 'stores/index.js'), name: 'useZeroAlgoliaStore' }
  ]
}
