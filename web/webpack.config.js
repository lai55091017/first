const path = require('path');
const HtmlWebpackPlugins = require('html-webpack-plugin')

module.exports = {

  //開發模式 development 生產模式 production
  mode: 'development',

  entry: {
    Functional_interface: './src/Functional_interface.js',
    index: './src/index.js',
    sign_up: './src/sign_up.js',
    information: './src/information.js',
  },

  output: {
    filename: '[name].bundle.js',
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

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },

  //外掛
  plugins: [
    new HtmlWebpackPlugins({
      template: './src/index.html',
      filename: 'index.html', // 输出的 HTML 文件名
      chunks: ['index'] // 可以指定只注入單個( index.js )文件 預設是全部文件
      
    }),
    new HtmlWebpackPlugins({
      template: './src/sign_up.html',
      filename: 'sign_up.html',
      chunks: ['sign_up']
    }),
    new HtmlWebpackPlugins({
      template: './src/forget_the_password.html',
      filename: 'forget_the_password.html',
      chunks: ['sign_up']
    }),
    new HtmlWebpackPlugins({
      template: './src/Functional_interface.html',
      filename: 'Functional_interface.html',
      chunks: ['Functional_interface']
    }),
    new HtmlWebpackPlugins({
      template: './src/information.html',
      filename: 'information.html',
      chunks: ['information']
    }),
    new HtmlWebpackPlugins({
      filename: 'menu.html',  // 指定要生成的文件名稱
      template: './src/menu.html',  // 來源 HTML 模板
      inject: false,  // 不自動注入腳本
    })
  ]

};