eslint只是用来检测我们的代码是否符合我们配置的规范，不代表我们某个具体成员是否能够使用
    比如我们在env中配置es6为false，如下
        env: {
            node: true,
            browser: true，
            es6: false
        }
    那么此时我们在代码中使用const，let，promise这些eslint就是抛出错误，告诉我们这些不能使用，但是实际上只要浏览器支持我们这个成员就可以使用，只是eslint检测到我们的配置项中es6为false，就会认为在该项目中不会使用es6的新特性，但是当我们实际使用了，在支持es6的浏览器中我们的代码会死hi能够运行的

    即，eslint只是监测规范，具体代码是否能够执行还要看具体运行环境 

stylelint的使用和eslint类似，配置文件类似'.stylelintrc'，其中配置项也类似，可以使用extends继承某个通用配置项，视频示例中使用的是style-config-standard，并且extends: 'style-config-standard'需要配置为完整模块名  
    1、sass需要安装style-config-sass-guidelines
    如下配置
        module.exports = {
            extends: ['style-config-standard', 'style-config-sass-guidelines'] 
        }

一、.eslintrc.js中的配置项
    1、env 表示是否能够使用不同环境的api
        比如这里可以配置
            env: {
                node: true,
                browser: true
            }
        表示在eslint检测过程中不管是使用require还是es module还是fs模块等eslint都不会报错，只是eslint检测的时候不会报错

    2、extends表示继承自哪个标准
        比如我们在使用eslint init生成eslint配置文件时我们选择了standard，eslint就会继承standard的配置项，这里也可以是一个数组，继承多个配置模块的配置项
        配置模开可以在node_modules中找到一个eslint-config-standard的配置模块，也就是我们当前许多没有配置的配置项都是使用的standard配置模块的配置项
        extends是一个数组，即可以传入多个可用来继承的配置模块，我们也可以把自定义的配置模块放到这里使用
            extends: ['standard']

    3、perserOptions指的是是否允许该版本的新特性的使用，比如配置为5，那么使用了const和let这些新特性在eslint在检测的时候就会报出错误
        perserOptions：5
        此时直接运行eslint会爆出另外一个错误，即在standard中的配置中将sourceType（该属性为模块引入方式）配置为module，意思是将我们的模块引入方式配置为es module，而我们这里的配置版本是5，是无法使用es module的，所以这里需要修改，或者perserOptions配置为更高版本

    4、rules为配置具体规则的启用或关闭，如下
            rules: {
                'no-alert': 'warn'
            }
        意思是我们的代码中不能使用alert，否则eslint检测就会发出警告
        其他值
            off： 表示关闭代码中是否存在alert的检测，就是表示我们在代码中可以使用alert
            warn： 表示出现alert时发出警告
            error： 表示出现alert时报错
    
    5、globals，配置检测全局变量
        在某个模块中我们直接使用某个已有的某个全局变量的时候eslint会给我们报出一个错误，就是该变量没有定义，那么eslint中配置了globals的时候就不会在爆出这个错误，例
            globals: {
                "jQuery": "readonly"
            }
            此时我们就可以直接使用全局的jQuery了，eslint不会再对该变量报出错误

二、eslint的配置注释，在写代码的过程中会发生我们的代码会违反配置的规范，但是我们又不能推翻整个规范，所以我们就可以在代码中使用配置注释

    具体使用就是在某一行代码后添加   //eslint-disable-line [某个eslint功能]，会让eslint在检测某项规范的时候忽略这行代码例
        PS：如果只是//eslint-disable-line不添加需要禁用的规范项，那么所有的配置的规范都不会检测这行是都符合

        alert('1'); //eslint-disable-line no-alert
        上述意思就是在检测no-alert这个规范项的时候跳过该行，其他的配置项不会调过这一行

    其他配置注释的使用都可以查看官方网站

三、webpack + eslint 
    react需要安装eslint-plugin-react该插件来配合校验react的jsx语法，.eslintrc文件配置如下

        方式一：
            module.exports = {
                env: ...,
                extends: ...,
                rules: {
                    // 这里error也可以使用数字2来替代
                    // 'react/jsx-uses-react': 'error'
                    'react/jsx-uses-react': 2,
                    'react/jsx-uses-vars': 2
                },
                // react就表示eslint-plugin-react插件，因为该插件的名字就叫做react，eslint-plugins表示这是个eslint的插件
                plugins: [ 'react' ]
            }
        方式二：
            module.exports = {
                env: ...,
                extends: {
                    'standard',
                    'plugin:react/recommended'
                },
            }     

    先安装一下eslint eslint-loader两个模块并配置’.eslintrc‘文件，然后在rules的js的相关配置中添加eslint-loader的使用，如下，eslint-loader放在use数组的后面，因为loader是从右往左执行的

    方式一：
        module.exports = {
            entry: 'index.js',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        excludes: /node_modules/,
                        use: [ 'babel-loader', 'eslint-loader' ]
                    }
                ]
            }
        }
    方式二：enforce: 'pre'表示在执行js的loader的时候当前这个loader优于其他的loader执行
        推荐使用该方式配置eslint-loader

        module.exports = {
            entry: 'index.js',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        excludes: /node_modules/,
                        use: 'babel-loader'
                    },
                    {
                        test: /\.js$/,
                        excludes: /node_modules/, 
                        use: 'eslint-loader',
                        enforce: 'pre'
                    }
                ]
            }
        }

四、eslint + TypeScript
    因为TS使用但单独的解析器，所以这里需要配置一下TS的解析器，即配置parser字段为'@typescript-eslint/parser'

        module.exports = {
            env: ...,
            extends: ...,
            rules: ...,
            // react就表示eslint-plugin-react插件，因为该插件的名字就叫做react，eslint-plugins表示这是个eslint的插件
            plugins: ...,
            parser: '@typescript-eslint/parser'
        }

五、eslint + git hooks
    项目的.git文件夹下有一个hooks文件夹，这里面是.simple后缀名结尾的文件，这些文件就是在git的执行的所写的钩子的目标文件
    
    这里我们主要使用的是pre-commit这个钩子，我们可以先把pre-commit.simple复制一份，然后重命名为pre-commit并去掉后缀名这个文件就可以使用了

    husky模块可以帮助我们在不写shell脚本的情况下使用git hooks，因为并不是所有人都会写shell脚本 
        "pre-commit": "npm run lint" 的内容就是我们在script中配置的命令
        使用
            1、在package.json中添加一个配置项husky，让爱配置项下添加hooks
                {
                    ...,
                    "husky": {
                        "hooks": {
                            "pre-commit": "npm run lint" 
                        }
                    }
                }
    eslint-staged模块可以配合husky模块对我们的文件进行格式化并添加到暂存区