const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge(baseConfig, {
    entry: {
        app: './src/entry-client.js'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        cacheDirectory: true,
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ]
    },
    // 将 webpack 运行时分离到一个引到 chunk 中，
    // 以便在之后正确注入异步chunk
    optimization: {
        splitChunks: {
            name: 'manifest',
            minChunks: Infinity
        }
    },
    plugins: [
        // 此插件将在输出目录中生成 vue-ssr-client-manifest.json 文件
        new VueSSRClientPlugin()
    ]
});
