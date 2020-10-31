说明文档  
    1、因为这里我没有按照提供的项目的webpack配置文件来，所以这里取巧了一下使用cross-env这个模块来定义是开发环境还是生产环境  
    2、导出一个对象  
    3、entry我们的入口文件就是src下的main.js  
    4、输出目录直接使用dist目录  
    5、配置各种loader的使用  
        vue-laoder解析vue文件  
        css-loader + MiniCssExtractPlugin.loader做css的解析和按需加载，其实我们开发环境不用做按需加载，这里就直接使用style-laoder替代MiniCssExtractPlugin.loader  
        babel-loader + eslint-loader做js的解析和规范校验  
        url-loader生产环境时将较小的图片转为data url的方式加载  
        html-loader用来处理以import等方式载入的html模块
    6、开发环境下我们需要热更新功能，所以这里配置devServer
        开启热更新新功能，以及配置静态文件
    7、开发环境下配置devtool，开启source-map方便我们调试
    8、配置插件
        开发环境：
            我们单独配置了热替换的插件
        生产环境：
            配置CleanWebpackPlugin用来清理之前打包生成的文件
            配置MiniCssExtractPlugin用来做css的按需加载，并将style-laoder替换为MiniCssExtractPlugin.loader
        生产开发公用插件：
            webpack.DefinePlugin配置全局变量
            HtmlWebpackPlugin用来根据模板生成indes.html
            VueLoaderPlugin vue-laoder的使用必须使用该插件