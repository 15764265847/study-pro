const path = require('path')
const { merge } = require('webpack-merge')

const config = require('./webpack.base')

module.exports = merge(config, {
  entry: './src/client/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
})
