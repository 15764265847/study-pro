// 一、webpack构建流程的主要环节？如果可能请尽量详述
//     1、合并我们的配置文件和我们通过命令行输入的参数为一个配置文件
//     2、通过配置文件中entry找到入口文件并分析依赖，然后递归的其中依赖的所有文件并通过loader进行解析
//     3、中间会适时的使用我们配置的plugin来做一些其他的事情
//     4、输出文件

    // 详细介绍：
    //     1、初始化：这个步骤就是将我们通过命令行拿到命令中的参数与我们的配置文件中的配置合并形成一个配置结果
    //     2、实例化compiler对象：调用webpack函数然后返回一个compiler对象，compiler对象继承自tapable类，这个类里面通过plugins的方式
    //         注册了许多插件名称及其回调
    //     3、编译阶段：这里就是调用compiler的run函数开始编译，从配置的entry找到入口文件，使用对应的loader进行编译，然后找出其依赖进行编译
    //         如果依赖中还有依赖，则递归编译。然后根据我们的其他配置，入口，依赖关系组装成对应的chunk并输出成单独的文件加入到输出列表，最后
    //         根据我们配置的文件名等配置输出到对应目录


// 二、loader与plugin有什么不同，详述自定义loader和自定义plugin的过程
//     1、loader主要是用来处理资源模块的加载
//     2、plugin用来做一些除了资源加载之外的事情，比如复制文件，创建html等

//     自定义loader过程
//         1、输出一个函数，该函数有一个参数，这个参数就是需要被处理的资源
//         2、我们这里就可以做一些对资源的操作，比如去掉注释啊，进行一些其他操作
//         3、最后最重要的就是我们在这里需要返回一段可执行的js代码的字符串，例
//             return 'module.exports = "12345678"';
//             因为我们这里但会的数据是要直接添加到js文件中，那么如果返回的东西不是一个可执行的js代码的话，js语法就会报错
//             另外假如我们自定义loader之后还需要使用其他loader进行处理，我们也可以直接返回我们处理之后的结果而不是一段
//             可执行的js代码字符串
//     自定义plugin
//         1、自定义plugin需要返回一个函数或者是带有apply方法的对象，我们这里可以使用参考我们常用的插件的方式进行输出
//         2、常用插件一般都是直接实例化一个对象来进行使用的，所以我们在编写中也可以世界使用class的方式输出一个插件
//             class Myplugin {
//                 apply(compiler) {

//                 }
//             }
//         3、apply方法中接受一个参数compiler，这个compiler就是在第一题中执行webpack函数返回的对象
//         4、调用compiler.hooks.emit.tap进行注册组件，如下
//             class Myplugin {
//                 apply(compiler) {
//                     compiler.hooks.emit.tap('MyPlugin', compilation => {

//                     })
//                 }
//             }
//         5、插件的回调我们会接受一个compilation参数，这个参数的实参中包含我们打包的结果，在compilation.assets下
//         6、compilation.assets是一个以文件名为key的一个对象，可以通过其value的source方法拿到打包的结果
//         7、我们就可以根据对应的文件类型进行处理
//         8、重写compilation.assets对应的文件对象，其中size函数必须要写，他返回我们处理后的内容的长度，如下
//             class MyPlugin {
//                 apply(compiler) {
//                     compiler.hooks.emit.tap('MyPlugin', compilation => {
//                         for (const [key, value] of compilation.assets) {
//                             const content = value.source();
//                             if (key.endsWith('.js')) {
//                                 // do something
//                             }
//                             compilation.assets[key] = {
//                                 source: () => content,
//                                 size: () => withoutComments.length
//                             }
//                         }
//                     });
//                 }
//             }

// 三、webpack配置vue项目打包
    const { join } = require('path');
    const VueloaderPlugin = require('vue-loader/lib/plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const { CleanWebpackPlugin } = require('clean-webpack-plugin');
    const TerserWebpackPlugin = require('terser-webpack-plugin');
    const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const webapck = require('webpack');
    const env = process.env.NODE_ENV;
    module.exports = {
        mode: env,
        entry: '/src/main.js',
        output: {
            filename: 'index.js',
            path: join(__dirname, './dist')
        },
        ...env === 'development' && { devtool: 'source-map' },
        ...env === 'production' && {
            optimization: {
                sideEffects: true,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        vendor: {
                            name: 'vendor', // chunk 名称
                            priority: 1, // 权限更高，优先抽离
                            test: /node_modules/,
                            minSize: 0, // 大小限制
                            minChunks: 1, // 最小复用过几次
                          },
                          common: {
                            name: 'common',
                            priority: 0,
                            minSize: 0,
                            minChunks: 2
                          }
                    }
                },
                minimizer: [
                    new TerserWebpackPlugin(),
                    new OptimizeCssAssetsWebpackPlugin()
                ]
            }
        },
        ...env === 'development' && {
            devServer: {
                hot: true,
                contentBase: ['src'],
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
            }
        },
        module: {
            rules: [
                ...env === 'production' && [
                    {
                        test: /\.html$/,
                        use: {
                            loader: 'html-loader',
                            options: {
                                attributes: {
                                    list: [
                                        {
                                            tag: 'a',
                                            attribute: 'href',
                                            type: 'src'
                                        },
                                        {
                                            tag: 'img',
                                            attribute: 'src',
                                            type: 'src'
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    {
                        test: /\.png|\.jpg$/,
                        use: {
                            loader: 'url-loader',
                            options: {
                                limit: 5 * 1024,
                                output: 'assets/',
                                outputPath: 'assets/'
                            }
                        }
                    },
                ],
                {
                    test: /\.css$/,
                    use: [
                        env === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', 
                        'css-loader'
                    ]
                },
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        '@babel/preset-env', { modules: false }
                                    ]
                                ]
                            }
                        },
                        'eslint-loader'
                    ]
                },
                {
                    test: /\.vue$/,
                    use: 'vue-loader'
                }
            ]
        },
        plugins: [
            new webpack.DifinePlugin({
                env
            }),
            new HtmlWebpackPlugin({
                title: 'part2-2',
                filename: 'index.html',
                template: './public/index.html',
                chunks: ['main', 'vendor', 'common']
            }),
            new VueloaderPlugin(),
            ...env === 'production' && [
                new CleanWebpackPlugin(),
                new MiniCssExtractPlugin(),
            ],
            ...env === 'development' && [
                new webpack.HotModuleReplacementPlugin(),
            ]
        ]
    }