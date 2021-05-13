const path = require('path')
const nodeExternals = require('webpack-node-externals')
// const merge = require('webpack-merge')
const { merge } = require('webpack-merge')

const config = require('./webpack.base')

module.exports = merge(config, {
  target: 'node',
  entry: './src/server/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  externals: [
    nodeExternals()
  ],
})
