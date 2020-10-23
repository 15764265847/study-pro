const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
// node的内建模块不需要我们打包，这里使用该插件过滤一下
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = merge(baseConfig, {
    entry: './src/entry-server.js',
    // 告知wabpack使用node风格是处模块
    // 并且在处理vue组件时，告知 vue-loader 输出面向服务器代码
    target: 'node',
    output: {
        // 告知server bundle 使用 node 风格导出模块
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    // 不打包 node_modules 中的第三方包 ，而是保留 require 方式直接加载
    externals: [nodeExternals({
        // 白名单中的资源依然正常打包
        allowlist: [/\.css$/]
    })],
    plugins: [
        // 将服务器的整个输出够建为单个 JSNO 的文件
        // 文件名默认为 vue-ssr-server-bundle.json
        new VueSSRServerPlugin()
    ]
});