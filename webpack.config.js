const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const banner = require('./build/banner.ts')

module.exports = {
  mode: 'production',
  devtool: 'eval',
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'PopNotify.min.js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false
      })
    ]
  },
  resolve: {
    extensions: ['.ts', '...']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: () => banner
    }),
    new HtmlWebpackPlugin({
      template: './build/TEMPLATE.html'
    })
  ]
}
