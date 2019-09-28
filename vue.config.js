module.exports = {
  chainWebpack: config => {
    // Don't split vendor and app js
    config.optimization.splitChunks(false)
  },
  configureWebpack: {
    output: {filename: 'widget-v1.js'}
  },
  css: {
    // Don't produce a separate css file
    extract: false,
    loaderOptions: {
      // Expose NODE_ENV to scss
      sass: {data: '$NODE_ENV: ' + process.env.NODE_ENV + ';'}
    }
  },
  // Don't produce a sourcemap
  productionSourceMap: false,
  // Use one static name
  filenameHashing: false
}
