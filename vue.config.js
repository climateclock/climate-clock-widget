module.exports = {
  chainWebpack: config => {
    // Don't split vendor and app js
    config.optimization.splitChunks(false)
    // Don't generate an index.html
    //config.plugins.delete('html')
    //config.plugins.delete('preload')
    //config.plugins.delete('prefetch')
  },
  configureWebpack: {
    output: {filename: 'widget-v1.js'}
  },
  // Don't produce a separate css file
  css: {extract: false},
  // Use one static name
  filenameHashing: false
}
