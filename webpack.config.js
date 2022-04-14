const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './app/app.js',
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'var',
      name: 'chatbot'
    },
    publicPath: ''
  },
  optimization: {
    runtimeChunk: 'single',
  },
  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    },
    fallback: {
      "stream": false,
      "crypto": false,
      "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
    }
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        exclude: /fonts/,
        use: 'html-loader'
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'app/assets/fonts/'
            }
          }
        ]
      },
      {
        test: /\.script\.js$/,
        use: [
          {
            loader: 'script-loader',
            options: {
              sourceMap: true,
            },
          },
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              "@babel/preset-env"
            ],
            "plugins": ['angularjs-annotate']
          }
        }
      }
    ],
  },
  target: ['web', 'es5'],
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: './index.html' }),
    new CopyPlugin({
      patterns: [
        { from: "app/assets/images", to: "app/assets/images" },
        { from: "app/assets/public", to: "app/assets/public" },
        { from: "app/assets/fonts", to: "app/assets/fonts" },
        { from: "app/assets/audio", to: "app/assets/audio" }
      ],
    }),
    new webpack.library.EnableLibraryPlugin("var")
  ],
  mode: 'production',
};