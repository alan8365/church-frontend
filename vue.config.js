const path = require('path');
// const webpack = require('webpack');

module.exports = {
  publicPath: "",
  // configureWebpack: {
  //   plugins: [
  //     // new webpack.DefinePlugin({
  //     //   'process.env': {
  //     //     API_URL: JSON.stringify('http://163.17.135.152:7465/api')
  //     //   }
  //     // })
  //   ]
  // },
  // 本地跨域設定，VM不需使用
  devServer: {
    proxy: {
      // "/api": {
      //   // target: "http://0.0.0.0:3000/api",
      //   target: "http://163.17.135.152:7465/api",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/api": "",
      //   },
      // },
      // "/cityApi": {
      //   target: "https://restcountries.com/v3.1",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/cityApi": "",
      //   },
      // },
    },
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 在這裡定義主題變數
          'primary-color': '#D48806',
        },
        javascriptEnabled: true,
      },
    },
  },
};