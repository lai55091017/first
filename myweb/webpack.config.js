const path = require('path');
const HtmlWebpackPlugins = require('html-webpack-plugin')

module.exports = {

  //開發模式 development 生產模式 production
  mode: 'development',

  entry: './src/index.js',

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './public'),
  },

  watch:true,

  // 開發伺服器devServer
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    //啟動gzip壓縮
    compress: true,
    //端口號
    port: 9000,
    hot: true,
  },

  //外掛
  plugins: [
    new HtmlWebpackPlugins({
      template: './src/index.html',
      filename: 'index.html' // 输出的 HTML 文件名
      //chunks: ['main'] // 可以指定只注入單個( main.js )文件 預設是全部文件
    }),
    new HtmlWebpackPlugins({
      template: './src/sign_up.html',
      filename: 'sign_up.html'
    }),
    new HtmlWebpackPlugins({
      template: './src/forget_the_password.html',
      filename: 'forget_the_password.html'
    }),
    new HtmlWebpackPlugins({
      template: './src/Functional_interface.html',
      filename: 'Functional_interface.html'
    })
  ]

};