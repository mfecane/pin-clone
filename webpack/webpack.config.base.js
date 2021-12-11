'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const root = path.resolve(__dirname, '..')

var rules = []

rules.push({
  test: /\.(js|ts|tsx)$/,
  exclude: /node_modules/,
  use: ['babel-loader'],
})

rules.push({
  test: /\.html$/i,
  use: {
    loader: 'html-loader',
  },
})

rules.push({
  test: /\.(jpe?g|png|gif|svg)$/i,
  type: 'asset/resource',
  exclude: /\.(inline)\.(svg)$/i,
})

rules.push({
  test: /\.(scss|css)$/,
  exclude: /\.module\.scss$/i,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: { sourceMap: true },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [
            require('autoprefixer'),
            require('css-mqpacker'),
            require('cssnano')({
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true,
                  },
                },
              ],
            }),
          ],
        },
      },
    },
    {
      loader: 'sass-loader',
      options: { sourceMap: true },
    },
  ],
})

rules.push({
  test: /\.module\.(scss|css)$/,
  use: [
    {
      loader: 'style-loader',
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 2,
        modules: {
          mode: 'local',
          localIdentName: '[local]--[hash:base64:5]',
          // localsConvention: "camelCase"
        },
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [
            require('autoprefixer'),
            require('css-mqpacker'),
            require('cssnano')({
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true,
                  },
                },
              ],
            }),
          ],
        },
      },
    },
    {
      loader: 'sass-loader',
    },
  ],
})

var plugins = []

plugins.push(
  new HtmlWebpackPlugin({
    template: path.resolve(root, 'src/templates/index.html'),
  })
)

plugins.push(new MiniCssExtractPlugin())

plugins.push(new CleanWebpackPlugin())

module.exports = {
  mode: 'development',
  entry: path.resolve(root, 'src/ts/index.tsx'),
  output: {
    path: path.resolve(root, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ['node_modules', 'src'],
    alias: {
      shaders: path.resolve(root, 'src/shaders'),
      js: path.resolve(root, 'src/js'),
      ts: path.resolve(root, 'src/ts'),
      css: path.resolve(root, 'src/css'),
      templates: path.resolve(root, 'src/templates'),
      assets: path.resolve(root, 'assets'),
    },
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
  },
  plugins: plugins,
}
