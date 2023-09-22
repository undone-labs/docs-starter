import Path from 'path'

export default {
  components: [
    { path: Path.resolve(__dirname, 'components/button.vue'), name: 'ZeroButton' }
  ],
  plugins: [
    { path: Path.resolve(__dirname, 'plugins/button.js'), name: 'zero-button' }
  ],
  stores: [
    { path: Path.resolve(__dirname, 'stores/index.js'), name: 'useZeroButtonStore' }
  ]
}
