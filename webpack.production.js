const path = require('path');
const webpack = require('webpack');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: [path.resolve(__dirname, 'app/main.ts')]
  },

  output: {
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js',
    path: path.resolve(__dirname, 'build')
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
      chunksSortMode: 'manual'
    }),

    new ImageminPlugin({
      test: /\.(jpe?g|gif|svg)$/i
    }),

    new ImageminPlugin({
      test: /\.png$/i,
      pngquant: {
        quality: '78-98',
        verbose: true
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
