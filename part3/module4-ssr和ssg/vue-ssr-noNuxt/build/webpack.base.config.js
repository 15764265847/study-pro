const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const resolve = file => path.resolve(__dirname, file);

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProd ? 'production' : 'development',
    // entry: {
    //     app: '../src/main.js'
    // },
    output: {
        path: resolve('../dist/'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        // 路径别名，@指向src目录
        alias: {
            '@': resolve('../src')
        },
        // 加载资源时可以省略的扩展名
        // 此处意思就是加载js vue json的资源时可以省略后缀
        extensions: ['.js', '.vue', '.json']
    },
    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
    module: {
        rules: [
            // 处理图片
            {
                test: /\.(png|jpg|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            },
            // 处理字体
            {
                test: /\.(woff|woff2|eto|ttf|otf)$/,
                use: ['file-loader']
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin()
    ]
}