const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-source-map',

  entry: {
    app: ['webpack-dev-server/client?http://0.0.0.0:3000', path.resolve(__dirname, 'app/main.ts')]
  },

  output: {
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, 'build')
  },

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    inline: true,
    host: '0.0.0.0',
    port: '3000',
    disableHostCheck: true
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['babel-loader', 'awesome-typescript-loader'],
        include: path.join(__dirname, 'app'),
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|mp4|tsv)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[hash:base64:5].[ext]'
            }
          }
        ]
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      }
    })
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
