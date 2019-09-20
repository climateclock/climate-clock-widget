module.exports = {
  chainWebpack: config => {
    // Don't split vendor and app js
    config.optimization.splitChunks(false)
    // Don't generate an index.html
    //config.plugins.delete('html')
    //config.plugins.delete('preload')
    //config.plugins.delete('prefetch')
    // Import ArchieML files with .aml suffixes at build time
    config.module
      .rule('archieml')
      .test(/.+\.aml$/)
      .use('@newsdev/archieml-loader')
        .loader('@newsdev/archieml-loader')
        .end()
  },
  configureWebpack: {
    output: {filename: 'widget.js'}
  },
  // Don't produce a separate css file
  css: {extract: false},
  // Use one static name
  filenameHashing: false
}
