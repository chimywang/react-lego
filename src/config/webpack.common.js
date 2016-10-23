const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssnano = require('cssnano');
const IsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

const { SRC, DIST } = require('./paths');
const isomorphicConfig = require('../config/isoConfig.js');

const isomorphicPlugin = new IsomorphicToolsPlugin(isomorphicConfig);
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  devtool: 'source-map',
  context: SRC,
  output: {
    path: DIST,
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    isomorphicPlugin.development(isDevelopment),
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        PORT: JSON.stringify(process.env.PORT),
        DEBUG: JSON.stringify(process.env.DEBUG),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  resolve: {
    modulesDirectories: ['node_modules', SRC],
    extensions: ['', '.js', '.jsx', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [/src/],
        loader: 'babel'
      },
      {
        test: /\.scss$/,
        include: [/src/],
        loader: ExtractTextPlugin.extract('style', [
          'css?sourceMap',
          'postcss',
          'sass?sourceMap&outputStyle=expanded'])
      },
      {
        test: /\.svg$/,
        include: [/src/],
        loaders: ['svg-inline']
      }
    ]
  },
  postcss: [
    cssnano({
      autoprefixer: {
        browsers: [
          'safari 9',
          'ie 10-11',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'edge 13',
          'ios_saf 9.0-9.2',
          'ie_mob 11',
          'Android >= 4'
        ],
        cascade: false,
        add: true,
        remove: true
      },
      safe: true
    })
  ]
};
