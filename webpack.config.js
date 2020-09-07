const { resolve, join } = require('path');
const { url } = require('inspector');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

// 自定义plugin
// 自定义plugin必须是一个函数，或者是一个具有apply方法的对象
// 一般是定义一个class，这个class中具有apply方法
// 该自定义plugin是为了删除打包后的js中的注释
// 那么我们可以使用emit钩子，这个钩子的执行时机就是打包后的结果即将输出到目标目录中时
// 即，已经产生了打包结果，但是还没有生成bundle.js时
// 这里的钩子需要时去webpack官网看下其执行时机来确定需要哪个钩子
class Myplugin {
    // compiler是webpack工作过程中的核心对象，它具有本次构建的所有配置信息，并使用该对象来注册钩子函数
    apply(compiler) {
        // 通过hooks属性访问钩子，通过钩子下的tap方法注册一个钩子函数
        // 两个参数，第一个参数就是插件名称，即此处的Myplugin
        // 第二个是我们要注册的钩子函数
        compiler.hooks.emit.tap('Myplugin', compilation => {
            // compilation可以理解为此次打包过程中的上下文 ，打包过程中产生的结果都在这个对象中
            // 这是一个对象，这个对象包含每个文件的打包后的内容，以文件名称为key
            // compilation.assets
            for (const [key, value] of Object.entries(compilation.assets)) {
                // 内容需要通过value的source方法访问
                // console.log(key, value.source());
                // console.log('__________________')
                if (key.endsWith('.js')) {
                    const content = value.source();
                    const withoutComments = content.replace(/\/\*\*+\*\//g, '')
                    compilation.assets[key] = {
                        // 定义一个函数将原本的source方法覆盖掉，该函数返回我们处理后的结果
                        source: () => withoutComments,
                        // size函数返回处理后的结果的大小，该方法是webpack要求必须要有的方法
                        size: () => withoutComments.length
                    }
                }
            }
        });
    }
}

const config = {
    // webpack打包模式
    // development，开发模式，会自动优化打包速度以及一些调试的代码
    // production，生产模式，会帮我们做很多优化，比如说代码压缩，摇树优化等
    // none模式， 运行最原始的模式
    mode: 'none',
    entry: './webpackPro/src/index.js',
    // 必须是对象，非对象会报错
    output: {
        filename: 'bundle.js',
        // 指定输出路径必须是一个绝对路径
        path: join(__dirname, './webpackPro/dist'),
        // webpack打包时会默认所有文件打包在dist目录下，但是如果我们有些不打包的页面并不会在dist下
        // 所以需要制定一个目录，就是该属性，dist后的斜线不能删除
        // publicPath: 'webpackPro/dist/'
    },
    optimization: {
        // 配置只有使用到的导出才会打包
        useExports: true,
        // 开启模块合并
        concatenateModules: true,
        // 开启压缩
        minimize: true
    },
    // 该属性就是用来配置开发过程中的一些辅助工具的
    devtool: 'source-map',
    // webpack的devserver的配置
    devServer: {
        // 开启热更新
        // 开启热更新还需要使用webpack内置的插件webpack.HotModuleReplacementPlugin
        hot: true,
        // 静态资源路径，有些文件开发阶段不需要被拷贝到打包的目录中
        // 所以这里需要添加能够在开发环境中查找到不需要打包的文件的目录
        // 会和CopyWebpackPlugin作用冲突，所以开发环境中不会使用CopyWebpackPlugin这个插件
        contentBase: ['public'],
        // 代理
        proxy: {
            'git': {
                target: 'https://api.github.com',
                pathRewrite: {
                    '^/api': ''
                },
                // 这里我们需要使用https://api.github.com ，这个主机名
                // 但是实际上这里默认是我们在浏览器打开的地址的主机名
                // 该属性为true就会以我们添加的实际的主机名进行请求
                changeOrigin: true
            }
        }
    },
    // webpack的插件绝大多数都是导出一个类（class），所以需要new 一下，创建一个实例
    plugins: [
        // 开启热更新使用webpack内置插件
        new webpack.HotModuleReplacementPlugin(),
        // 为啥要使用clean-webpack-plugin
        // 因为每一次打包，webpack输出的结果都会覆盖掉之前的结果，但是当我们某次打包删掉了目中的某个文件
        // 那么该文件就会一直存在打包目录中，那么后面再有删除的，又会有一个无用文件存在于打包目录中，这样是不合理的
        new CleanWebpackPlugin(),
        // 使用该插件可以将index.html文件输出至dist目录下
        // 帮我们自动修改文件引用，比如自动按照js的打包路径输出至index.html中，而不是每次都需要我们修改
        // 如果有大量自定义内容，我们就需要模板
        // 创建多个页面需要创建多个html-webpack-plugin实例，一个实例负责生成一个html
        new HtmlWebpackPlugin({
            // 设置HTML中的title标签元素内容
            title: 'webpack-plugin-simple',
            // 设置meta标签
            meta: {
                viewport: 'width=device-width'
            },
            // 根据模板来创建html文件
            template: './webpackPro/index.html'
        }),
        // 用于拷贝不需要模块化的文件导输出目录
        // 该插件只有在上线的打包的时候才会用到
        // 因为该插件一直在拷贝文件操作磁盘，但是在开发环境中，我们的文件时经常变动的
        // webpack的自动编译就会频繁开启，这样就会重复的进行磁盘拷贝，开销比较大
        // 所以开发过程中一般是使用devServer的contentBase属性配置静态资源路径
        // 这样开发过程中就不会频繁操作磁盘拷贝文件
        // new CopyWebpackPlugin([
        //     // 'public/**',
        //     'public'
        // ])
        new Myplugin(),
    ],
    // webpack默认只会打包js文件，其他类型的文件需要进行单独配置打包时用的模块 
    // 配置打包出js之外的其他类型的文件的属性
    module: {
        rules: [
            // 添加js加载器，babel-loader
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            // 强制开启ES module转换，将ES module转换为commonjs
                            // 开启强制转换之后 摇树优化就会失效
                            ['@babel/preset-env', { modules: 'commomjs' }]
                        ]
                    }
                }
            },
            {
                // 正则表达式表示匹配什么类型的文件
                test: /\.css$/,
                // 表示匹配到的文件使用什么加载器（loader）
                // css-loader只会转换css为一个模块，但并不会将他注入到页面
                // 所以需要另外的loader配合css-loader才行，即style-loader
                // style-loader的作用就是将css-loader转换后的结果使用style标签注入到页面中 
                // use属性如果配置了多个loader，那么loader是从后往前开始执行的
                use: ['style-loader', 'css-loader']
            },
            // 将导入的文件拷贝到输出的目录，然后将拷贝到的路径当做当前模块的模块返回
            {
                test: /\.png|\.jpg$/,
                use: 'file-loader '
            },
            // DATA url的方式打包文件，即将文件打包成一段浏览器可识别的字符串，直接使用，不用进行请求
            // 例：data:text/html;chartset=UTF-8,<h1>content</h1>，此段代码可以直接放到浏览器的地址输出栏中访问
            // 浏览器就会根据这段代码解析出这时段html内容，编码是utf-8
            // data:img/png;base64,xxxxxxxxx 图片等无法通过文本表示的二进制文件需要使用base64编码
            // ','后面即是base64编码后的图片内容
            // 可以使用url-loader将图片进行base64编码，转换成DATA url的格式
            // 最佳实践：小文件使用data url减少请求次数 大文件以单个文件的方式，提高加载速度 
            {
                test: /\.png|\.jpg$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 只将小于10kb的图片进行base64转换，大于10kb的使用file-loader处理
                        limit: 10 *1024
                    }
                }
            },
            // 用来处理入口文件中使用import等导入方式导入的html文件
            // {
            //     test: /\.html$/,
            //     use: {
            //         loader: 'html-loader',
            //         // html-loader默认只处理img的src，想要处理其他的需要在options中配置，如下配置
            //         options: {
            //             attrs: ['img:src', 'a:href']
            //         }
            //     }
            // }, 
            // {
            //     test: /\.md$/,
            //     // use除了使用loader名称也可以使用模块的路径，这里就是使用我们的自定义loader的相对路径
            //     use: ['html-loader', './webpackPro/markdown-loader.js']
            // }
        ]
    }
}

// webpack配置文件还可以导出一个函数，该函数需要接受两个参数
// env表示运行环境，argv表示我们是webpack-cli时传递的所有参数
module.exports = (env, argv) => {
    if (env === 'production') {
        config.mode = 'production';
        config.devtool = false;
        config.plugins = [
            ...config.plugins,
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin(['public'])
        ]
    }
    return config;
}