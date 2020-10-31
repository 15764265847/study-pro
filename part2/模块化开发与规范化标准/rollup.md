### rollup/webpack选用原则
    rollup： 开发类库或者框架的时候使用rollup做微模块打包
        优点：
            1、输出后的代码更加扁平
            2、自动使用摇树优化
            3、打包结果可以正常阅读
        缺点：
            1、使用非ES module的第三方模块需要格外使用额外的插件
            2、无法使用热更新
            3、浏览器环境代码拆分依赖实现amd的库
    webpack：开发应用程序时使用，因为开发应用程序的体验webpack更好

### webpack大而全，rollup小而美 


### 一、仅仅是一款ES module的打包器，充分利用ES module的各项特性  

    rollup的配置文件可以使用ES module的方式导出一个对象，如下
        export default {
            input: './rollupPro/src/index.js',
            // output必须是一个对象 
            output: {
                // 指定输出文件
                file: './rollupPro/dist/bundle.js',
                // 指定输出的格式，iife指的就是以自执行函数的方式输出
                format: 'iife'
            }
        }

### 二、rollup使用时必须指定配置文件，因为rollup默认是不使用配置文件的
    yarn rollup --config 不指定文件就使用rollup.config.js
    yarn rollup --config roll.config.prod.js 指定使用roll.config.prod.js为打包的配置文件

### 三、插件是rollup的唯一扩展方式，而webpack则有loader plugins minimizer三种扩展方式 
    PS： rollup的插件都是导出一个函数，使用直接在plugins中调用该函数，即plugins使用的是导出函数的调用结果，如下
        // 该插件导出一个函数
        import json from 'rollup-plugin-json';
        import resolve from 'rollup-plugin-node-resolve';

        export default {
            ...,
            plugins: [
                // 该插件是用来帮助我们指出使用import的方式导入json文件
                // 这里plugins数组中是函数调用的结果而不是函数
                json(),
                resolve()
            ]
        }

### 四、rollup加载NPM模块
    rollup的需打包文件不允许直接使用模块名的方式加载模块，必须是模块路径
    例如在rollupPro/src/index.js中直接使用模块名的方式导入模块是不允许的
        import _ from 'lodash-es';
    为此需要安装一个插件来解决这个问题，rollup-plugin-node-resolve这个插件使用后就可以使用以上方式导入模块

### 五、rollup的设计就是只处理的ES module的模块的打包，rollup不支持Commonjs模块的打包，所以需要插件来解决这个问题
    rollup-plugin-commonjs就是官方提供的用来兼容Commonjs模块的打包的

### 六、多入口打包
    1、可以使用和webpack类似的方式
        export default {
            input: {
                index: './rollupPro/src/index.js',
                other: './rollupPro/src/other.js'
            },
            ...
        }
    2、使用数组的方式
        export default {
            input: ['./rollupPro/src/index.js', './rollupPro/src/other.js'],
            ...
        }
    3、rollup多入口打包会自动提取公共文件，也就是会拆包，所以其format不能是iife，另外需要使用dir属性指定输出目录
        PS：因为这里示例是用来在浏览器中使用所以format属性可以是amd，使用amd规范的话不能直接在页面中引入，必须使用实现了amd规范的库才可以
            比如使用require.js
                <script src="https://unpkg.com/requirejs@2.3.6/require.js" data-main="index.js"></scrtipt>
                    PS: requirejs可以使用自定义属性方式指定我们模块的入口文件