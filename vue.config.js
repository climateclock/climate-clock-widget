module.exports = {
  chainWebpack: config => {
    // Don't split vendor and app js
    config.optimization.splitChunks(false)
    // Inline SVGs
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
        .loader('vue-svg-inline-loader')
        .options({})
  },
  configureWebpack: {
    output: {
      // Don't place chunks in a js folder
      chunkFilename: '[name].js?id=[hash]',
      filename: 'widget-v2jw.js?id=[hash]'
    }
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
  //filenameHashing: false
}
