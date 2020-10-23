webpack打包后的入口文件的执行流程
    1、webpack打包后会把代码放到自执行函数
    2、该自执行函数的传参为一个对象，key为入口文件路径，value是一个函数，函数内部内部是入口文件的代码
    3、value的函数接收两个参数 module和exports（即为commonjs导出时的module和module.exports）
    4、webpack会把esmodule和require转换成webpack定义的__webpack_require__方法
        PS：webpack定义了很多其他的工具方法

以单模块打包为例
    1、将所有的内容都放到自执行函数中，然后将被打包模块先关信息进行传参
        相关信息就是就是一个对象
            {
                [模块路径]: function (module, exports) {
                    模块代码
                }
            }
    2、自定义__webpack_require__函数，接收一个moduleId
        moduleId就是入口模块的ID
    3、自执行函数内部逻辑
        1、判断 moduleId是否缓存了对应的模块
        2、不存在就将其声明为一个{}
        3、同时还将这个对象存储在了installModule[moduleId]中
        4、该对象有三个属性 i l  exports:{}
        5、调用步骤一中的对应的模块的函数
        6、传入module、exports、__webpack_require__，__webpack_require__为了将来还有其他模块的导入而使用
    4、打包后文件中的工具方法
        1、o:判断当前对象中是否存在某个属性
        2、d:给对象的某个属性添加一个getter
        3、r:将对象标记为__esmodule
        4、
    

webpack.config.js导出的数据可以是一个配置对象
    也可以是一个数组，数组中包含多个配置对象，这样webpack就会运行多个打包任务，生成不同的文件
        PS：我们可以配合导出一个数组的模式来做许多东西，例如vue中的多页面应用，多页面应用中多个main.js就可以通过该模式进行打包
        此次的案例是用来实验多种sourceMap模式的区别
        module.exports = [
            {
                entry: './webpackPro/src/index.js',
                devtool: 'eval',
                mode: 'none',
                output: {
                    filename: 'a.js',
                    path: join(__dirname, './webpackPro/dist'),
                },
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env']
                                }
                            }
                        }
                    ]
                },
                plugins: [
                    new HtmlWebpackPlugin()
                ]
            },
            {
                entry: './webpackPro/src/index.js',
                devtool: 'source-map',
                mode: 'none',
                output: {
                    filename: 'b.js',
                    path: join(__dirname, './webpackPro/dist'),
                },
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env']
                                }
                            }
                        }
                    ]
                },
                plugins: [
                    new HtmlWebpackPlugin()
                ]
            },
            ...其他模式
        ]

loader和plugin的区别
    1、loader专注于模块资源加载，从而实现项目的整体打包
    2、解决出资源加载之外的自动化工作
        例如：插件可以帮我们在打包之前自动清除上一次的打包的结果
            还可以拷贝静态文件（不需要打包的文件）至输出目录
            压缩打包输出的代码

一、加载器（loader）工厂的流水线车间，将我们的东西一样一样的分类打包，最后整体组合成我们的项目
    加载器分类
        1、编译转换，例如babel或者sass等将我们的js或者css进行编译
        2、文件操作类型，拷贝文件到对应目录，并将文件的路径到处，例如file-loader或者url-loader的处理
        3、代码检测，统一代码风格，提高代码质量
    PS：webpack会对我们的项目进行打包操作，所以会对ES module的import和export 进行编译，但是其他代码不会
    即，webpack并不会帮我们进行项目的编译工作，我们需要另外的插件进行编译

二、webpack支持多种模块加载
    1、ES module
    2、CMD规范的的require
    3、AMD规范的define和require
        即define(['xx.js','xx.js'],function () {})
    4、css中的url函数加载以及@import url(xx.css)导入的样式
    5、html的src属性的 加载
    这些会触发webpack的模块加载，将对应的文件进行打包，例如css中的url函数中的路径
    webpack会按照我们的配置对我们所使用的资源使用不同的loader处理，并将处理的结果输出到打包目录 

三、webpack打包流程，loader是webpackd的核心，根据不同的文件类型进行处理
    1、从入口文件开始，通过import等模块引入方式分析出相应的依赖，然后分别解析模块对应的依赖形成一个依赖树
    2、然后递归这个依赖树，根据每个文件的类型使用不同的loader进行打包，从而实现整个项目的打包

四、开发自己的loader，开发一个markdown加载器
    1、新建一个js文件，改文件导出一个函数，该函数就是对于文件内容的处理过程，该文件的输入就是需要处理的文件的内容，输出是我们处理后的结果
    2、然后直接在webpack.config.js中使用，在module.rules中添加如下代码，直接打包即可
            {
                test: /\.md$/,
                // use除了使用loader名称也可以使用模块的路径，这里就是使用我们的自定义loader的相对路径
                use: './webpackPro/markdown-loader.js'
            }
        PS：如果你想打包某个文件，必须先添加依赖（在入口文件或者入口文件以来的文件中import一下），如果没有添加依赖，意味着webpack的依赖书中没有该文件，那么该文件就不会被打包
    3、loader就像是一个系列的处理管道，一个接一个进行处理，但是有一点，最后处理的loader一定要返回一段标准的javascript代码
        即自定义的loader如下返回字符串时会爆出错误的
        module.exports = source => {
            console.log(source);
            return 'Hello ~'
        }
        处理方法有两个：要么返回一段js代码，要么使用其他的loader进行后续处理 
        PS：这里为什么要必须返回js代码
            因为处理的模块的结果需要拼接到我们打包后的结果文件中的，也就是我们处理后的结果是需要能够执行的，如果不是js代码拼接到我们的执行代码中就会报错
    4、如下代码可以使用
        // marked是专门用来解析markdown文件的工具，转换后返回一个html
        const marked = require('marked');

        module.exports = source => {
            // console.log(source);
            // return 'console.log("Hello ~")';
            const html = marked(source);
            // 这里为甚么不是这样 module.exports = html
            // 因为这样直接使用换行符之类的可能会导致语法错误
            // 所以这里使用了JSON.stringify处理一下，换行符之类的就会被转义
            return `module.exports = ${ JSON.stringify(html) }`;
        }
    5、使用第二种loader进行处理,自定义loader中直接返回html
            // marked是专门用来解析markdown文件的工具，转换后返回一个html
            const marked = require('marked');

            module.exports = source => {
                // console.log(source);
                // return 'console.log("Hello ~")';
                const html = marked(source);
                // 这里为甚么不是这样 module.exports = html
                // 因为这样直接使用换行符之类的可能会导致语法错误
                // 所以这里使用了JSON.stringify处理一下，换行符之类的就会被转义
                // return `module.exports = ${ JSON.stringify(html) }`;
                return html;
            }
        然后在webpack.config.js的module.rules修改
            {
                test: /.md$/,
                // use除了使用loader名称也可以使用模块的路径，这里就是使用我们的自定义loader的相对路径
                use: ['html-loader', './webpackPro/markdown-loader.js']
            }
            PS: laoder的执行顺序是从数组的后面开始执行，即从数组的最后一个开始执行，然后依次往前，所以需要把先执行的放到数组后面

五、自定义plugin，通过网webpack的生命周期的钩子上挂载钩子函数实现的
以下代码在webpack的plugins中配置使用即可
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

六、使用yarn webpack --watch启用watch模式，监听文件变化自动打包
七、webpack dev server，集成自动编译，自动刷新浏览器
八、sourceMap ，解决了开发阶段的代码和运行代码不一致时调试困难的问题
    描述我们打包前与打包后的代码的映射关系，一般这种映射关系需要一个.map后缀名的文件描述，其中.map文件有四个属性
        1、version
        2、sources，一个数组，内部是文件名，表示最后打包出来的文件由哪几个文件合并而成
        3、names，也是一个数组，由于我们在打包的时候会进行压缩文件，其中会把我们原本定义的变量名压缩成为单个字符来压缩文件的部分大小，names这个属性描述的就是没有压缩成单个字符的变量名称
        4、mappings，sourceMap文件的核心属性，是一串base64编码字符串，记录了我们转换后的字符与转换前的字符的映射关系

    sourceMap文件的使用，需要在使用js最后添加一行注释  //# sourceMappingURL=xxxxx.map

    例如，jq的压缩文件jQuery.min.js的末尾添加这行注释  //# sourceMappingURL=jQuery.min.map，在浏览器打开的时候就会自动加载该文件，根据文件内容逆向解析源代码来帮助我们调试

    webpack为我们提供了12种不同的生成sourceMap文件的方式，其中生成的效率和效果各不相同，效果好的生成的慢，不好的生成的快
        PS：具体可以查看webpack官方文档的devtool的模式表
        1、模式表现
            1、eval模式不会生成的对应的.map文件，只能定位到对应的文件，无法知道代码对应的行列
        2、模式基本分为三类
            1、带有eval  是否使用eval执行模块代码
            2、带有cheap-Source Map  是否包含行信息
            3、带有module  是否能够得到loader处理之前的代码（我们写的未经过处理的代码）
            PS：inline-source-map 将map文件以data url的当时写入到js文件中
                hidden-source-map 在js文件中找不到 //# sourceMappingURL=xxx.map的注释，但是生成了sourceMap文件
                nosources-source-map  提供行列信息，但是看不到源代码，用来在生产环境中保护我们的代码
        3、如何选择：
            开发环境：cheap-module-eval-source-map
                原因：1、单行代码量少
                     2、使用vue，react等框架时，loader转换前和转换后差距较大
                     3、首次启动时的打包较慢，但是再热更新的情况，重写打包相对较快
            生产模式：none 不生成sourceMap，因为会暴露源代码到生产环境
                如果对线上环境没有信心的话可以使用nosources-source-map，会给出错误位置，但不会暴露源代码

九、Hot module replacement 热更新
    1、配置：
        1、devServer中配置hot:true
        2、plugins中添加关于webpack内置插件HotModuleReplacementPlugin的使用即，plugins: [new webpack.HotModuleReplacementPlugin()]
        PS：这里js模块的热更新需要我们自己手动做一些处理
            <!-- 原因：js模块的导出是无规律的，像vue等框架无需手动操作是因为vue-cli帮我们继承了操作的方案，另一个原因是使用了框架后，比如vue，它统一导出一个对象，所以他是有规律的 -->

            入口模块中添加，处理js模块就是在入口文件中添加以下代码
            module.hot.accept('./editor', () => {
                console.log('editor 模块gengxin了，这里做一些手动操作');
            })
            accept函数接收两个参数，一个是模块路径，第二个是一个处理函数

            处理步骤： 假设该模块导出的是一个函数，并且创建一个DOM添加到页面中
                1、保存上一次执行后的状态，即气质型后的内容等
                2、清除上一次该模块执行的结果
                3、重新执行该模块并将之前的状态添加上去
                4、保存执行结果

                视频示例：
                    该示例的处理流程只针对视频中的editor模块，由此可以发现，我们每个模块的作用逻辑都不尽相同，那么热更新的处理方式也就不尽相同，webpack.HotModuleReplacementPlugin无法做到一个普适的方式去处理每一个js模块
                        import createEditor from './editor';
                        const editor = createEditor();
                        let lastEditor = editor;
                        module.hot.accept('./editor', () => {
                            const value = lastEditor.innerHTML;
                            document.removeChild(lastEditor);
                            const newEditor = createEditor();
                            newEditor.innerHTML = value;
                            document.body.append(newEditor);
                            lastEditor = newEditor;
                        })
                视频示例，图片热替换
                    import background from './img.png';
                    const img = new Image();
                    img.src = background;
                    module.hot.accept('./editor', () => {
                        img.src = background;
                    })
    2、注意事项
        1、处理热替换的代码有错误的话很难发现会有错误
            因为热更新处理代码有出现了错误，热更新就会自动退回成刷新页面的方式，这时候可以是用 'hotOnly:true' 来替换devserevr中配置的hot:true，这时候页面不会刷新，就会看到抛出的错误
        2、module.hot.accept这个API是由webpack.HotModuleReplacementPlugin这个插件提供的，所以在使用时，如果没有配置这个插件，那么页面就会报错。所以可以判断是否存在这个API
            if (module.hot && module.hot.accept) {
                module.hot.accept(...); 
            }
        3、热更新的处理代码会在打包后被移除，不会影响生产环境的运行状态

十、区分生产还是开发来对webpack进行不同的配置
    1、判断环境变量，然后分别添加不同的配置。建议小型项目使用该方法
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
    2、使用多个配置文件，在不同的环境下使用不同的配置文件。大型项目建议使用该方法
        1、最少会创建三个文件，一个文件中是生产环境和开发环境都会使用的配置，即公共配置，文件名随便起，只要能明白其意思就好
            公共配置文件名为 webpack.config.base.js
            开发配置文件名为 webpack.config.dev.js
            生产配置文件名为 webpack.config.prod.js，内容如下：
                const baseConfig = require('webpack.config.base.js');
                const { CleanWebpackPlugin } = require('clean-webpack-plugin');
                const CopyWebpackPlugin = require('copy-webpack-plugin'); 
                const merge = require('webpack-merge');
                module.exports = merge(baseConfig, {
                    mode: 'production',
                    devtool: false,
                    plugins: [
                        new CleanWebpackPlugin(),
                        new CopyWebpackPlugin(['public'])
                    ]
                })
            使用webpack --config webpack.config.prod.js命令打包，可以将该命令添加到package.json的scripts中

十一、webpack内置插件DefinePlugin，用来定义全局变量，他会直接将我们定义的变量的值直接替换到打包后的代码中
    传入的值必须是一段可执行的js代码片段
    plugins: [
        new webpack.DefinePlugin({
            在这里定义全局变量
        })
    ]

十二、非生产环境开启摇树优化（tree shaking），生产环境会自动使用，不需要配置
    webpack.config.js中配置如下
        optimization: {
            // 配置只有使用到的导出才会打包
            useExports: true,
            // 开启压缩
            minimize: true
        },
    开启模块合并，尽可能的将所有的模块合并到一起输出
        optimization: {
            // 开启模块合并
            concatenateModules: true,
        },
    
    tree shaking 
        摇树优化是基于ES module的，基于ES module进行静态分析分析出那些导出的东西并没有被使用到，然后进行优化
        当我们使用babel-loader的时候babel-loader会把ES module转换成commonjs规范，此时摇树优化就会不起作用
        但是babel-loader的最新几个版本中对这个进行了优化，它会根据是否开启了摇树优化（useExports）来判断是否要对
        ES module进行转换，也可以添加配置的方式，来进行强制转换ES module为commonjs，开启强制转换之后 摇树优化就会失效
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { modules: 'commomjs' }]
                        ]
                    }
                }
            },
        将modules设置为false就会设置为不转换ES module ，用来确保webpack的摇树优化
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { modules: false }]
                        ]
                    }
                }
            },

十三、sideEffects 表示模块是否有副作用，如果有那么摇树优化就不会将模块代码删除
    开启该功能
        1、webpack配置文件配置sideEffects为true
            optimization: {
                // 开启标识是否有副作用的功能
                sideEffects: true,
            }
        2、在package.json中来表示是否有副作用,两种写法
            1、"sideEffects": false 表示所有文件都没有副作用
            2、"sideEffects": ['./xxx/xxx.js', './xxx/xxx.js']表示数组中的这些文件是有副作用的，不能被优化掉

    是否有副作用举例
        a.js
            Number.prototype.pad = () => {
                do something
            }
        b.js
            import 'a.js'
            let num = 6;
            num.pad();
        这样a.js的代码就会有副作用，因为我们执行了a.js之后Number的原型链上就会有pad方法，该方法可能会在其他模块中使用到
        假如我们将a.js标识为没有副作用，那么在摇树优化的时候会把a.js的内容给优化掉

十四、代码分割
    1、多入口打包，适用于多页，以下的other.js和other.html并不存在，要使用就自己创建
        1、配置entry为多个入口，一个key对应一个入口文件
            entry: {
                index: './src/index.js',
                other: './src/other.js'
            }
        2、配置output的filename属性，生成对应的打包文件，name即为entry中配置的key，即此处会输出index.bundle.js和other.bundle.js两个到打包目录
            output: {
                filename: '[name].bundle.js'
            }
        3、配置使用多个HTMLWebpackPlugin实例，生成对应的html文件，并为每个实例添加一个chunks属性用来引入到对应的html中
            这个chunks应该是对应entry中key ！！！？？？
            plugins: [
                new HtmlWebpackPlugin({
                    // 设置HTML中的title标签元素内容
                    title: 'Multi Entry Index',
                    // 设置meta标签
                    filename: 'index.html',
                    // 根据模板来创建html文件
                    template: './webpackPro/index.html',
                    chunks: ['index']
                }),
                new HtmlWebpackPlugin({
                    // 设置HTML中的title标签元素内容
                    title: 'Multi Entry Other',
                    // 设置meta标签
                    filename: 'Other.html',
                    // 根据模板来创建html文件
                    template: './webpackPro/Other.html',
                    chunks: ['other']
                }),
            ]
        4、提取公共模块，chunks: 'all'表示把所有的公共模块都提取到一个js文件中
            optimization: {
                splitChunks: {
                    chunks: 'all'
                }
            }
    
    2、动态加载以及webpack的魔法注释，直接使用ES6 的import()函数，使用import函数就会自动分包
       使用魔法注释会按照注释内的名称生成对应的包的文件名
       相同的webpackChunkName会被打包到一块
        import(/* webpackChunkName: 'index' */'./src/index.js')

    3、css的按需加载，使用mini-css-extract-plugin，使用如下
        建议在css超过150kb时考虑使用css按需加载，因为拆得越多请求也越多，可能会适得其反
            const MiniCssExtractPlugin = require('mini-css-extract-plugin');
            module.export = {
                entry: {
                    ...
                },
                output: {
                    ...
                },
                module: {
                    rules: [
                        test: /\.css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader'
                        ]
                    ]
                },
                plugins: [
                    new MiniCssExtractPlugin()
                ]
            }
        PS: 这里要注意style-loader是使用style标签的方式注入到页面，但是这里的插件是生成对应的css文件，link到页面里
        所以style-loader和mini-css-extract-plugin插件的作用会冲突，所以这里在经过css-loader处理过后使用的是mini-css-extract-plugin提供的MiniCssExtractPlugin.loader加载器来进行后续的处理已达到css的按需加载

    4、css压缩，optimize-css-assets-webpack-plugin 配置如下
        const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
        配置方式1、此种情况下开发环境也会运行
            module.export = {
                ...,
                plugins: [
                    new OptimizeCssAssetsWebpackPlugin()
                ]
            }
        配置方式2、只有在minimizer开启的时候才会运行，但是这里配置了之后会覆盖掉默认配置，即webpack内部这里默认配置了js的压缩，但是我们此处的配置中只配置了css压缩，这样会导致原本的就是压缩会失效，所以这里需要将原本内置的压缩插件重新配置上，这里默认的js压缩插件叫做terser-webpack-plugin
            module.export = {
                ...,
                optimizetion: {
                    minimizer: [
                        new OptimizeCssAssetsWebpackPlugin(),
                        new Terser-webpack-plugin()
                    ]
                } 
            }
    5、文件名hash，使用占位符的方式来制定[name]-[hash].js，通过hash后面加 ’:8‘ 的方式指定hash长度，如下contenhash:6指定hash长度为6
        1、最普通hash，所有的文件的hash都是一样的，并且一旦项目有某处改动hash就会修改
            output: {
                filename: [name]-[hash].js
            }
        2、chunkhash，同一路打包出来的文件，hash相同
            output: {
                filename: [name]-[chunkhash].js
            }
        3、contenthash，文件级别，根据文件内容修改，每个文件的hash都不相同
            output: {
                filename: [name]-[chunkhash:6].js
            }