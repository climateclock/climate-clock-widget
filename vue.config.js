module.exports = {
  chainWebpack: config => {
    // Don't split vendor and app js
    config.optimization.splitChunks(false)
    // Don't generate an index.html in production
    if (process.env.NODE_ENV == 'production') {
      config.plugins.delete('html')
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      config.plugins.delete('copy')
    }
  },
  configureWebpack: {
    output: {filename: 'widget-v1.js'}
  },
  // Don't produce a separate css file
  css: {extract: false},
  // Don't produce a sourcemap
  productionSourceMap: false,
  // Use one static name
  filenameHashing: false
}
