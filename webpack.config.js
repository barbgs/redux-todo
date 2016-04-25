const path = require('path');
const webpack = require('webpack');
const config = {
  bundle: 'bundle.js',
  src: 'app',
  dist: 'build',
  script: 'main.js',
  port: 3000,
  host: 'http://localhost'
};

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?'+ config.host + ':' + config.port,
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, config.src + '/' + config.script)
  ],
  output: {
    path: path.join(__dirname, config.dist),
    filename: config.bundle,
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, config.src)
    }, {
      test: /\.scss$/,
      loader: 'style-loader!css-loader!sass',
      include: path.join(__dirname, config.src)
    }]
  }
};
