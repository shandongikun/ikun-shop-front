const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack'); // 新增：引入 webpack

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 8081,
    open: true,
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,

  // 新增：配置特性标志
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // 关闭生产环境的 hydration 不匹配详细警告（必填）
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        // 其他可选标志（根据需要添加）
        __VUE_OPTIONS_API__: JSON.stringify(true), // 启用选项式 API（默认启用，可省略）
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false) // 禁用生产环境 devtools（默认禁用，可省略）
      })
    ]
  }
});