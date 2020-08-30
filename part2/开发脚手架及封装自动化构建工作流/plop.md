一、plop使用步骤
1、安装  yarn add plop --div
2、新建一个plopfile.js，plopfile.js为plop执行时的入口文件，需要导出一个函数
3、创建一个plop-templates文件夹，该文件夹下是我们的模板文件
4、在该文件夹下创建一个component.hbs即可，css文件则需要component.css.hbs，html文件需要component.html.hbs，只有js文件不需要在中间添加后缀
    示例如下
    // 返回的函数接收一个参数，该参数为plop传入的一个对象，定义了一些我们在创建文件时会用的工具方法
    module.exports = plop => {
        // setGenerator函数，即创建建造器，接受两个参数
        // 第一个参数这里是component 即我们命令的名字
        // 第二个参数是我们的配置项
        // 配置项有三项
        // description 描述，即我们的构造器是做什么用的
        // prompts 命令行交互的问题
        // actions 命令行交互后我们需要做什么
        plop.setGenerator('component', {
            description: 'create a component',
            // 接受一个数组，数组中对象的形式和yeoman中的配置相类似，这例应该都是使用inquirer工具实现的
            prompts: [{
                type: 'input',
                name: 'name',
                message: 'component name',
                default: 'myComponent'
            }],
            // actions可以是一个数组，也可以是一个函数，如果是函数则该函数返回一个数组，该数组和直接传入数组的形式一样
            // 数组中的对象有三个成员
            // type 表示我们要做的操作，add表示新创建文件
            // templateFile 表示模板文件路径
            // path 表示目标文件，即创建到哪里
            actions: [{
                type: 'add',
                templateFile: 'plop-templates/component.hbs',
                path: 'dist/{{name}}/{{name}}.js'
            }, {
                type: 'add',
                templateFile: 'plop-templates/component.css.hbs',
                path: 'dist/{{name}}/{{name}}.css'
            }, {
                type: 'add',
                templateFile: 'plop-templates/component.html.hbs',
                path: 'dist/{{name}}/{{name}}.html'
            }]
        })
    }
5、使用yarn plop component命令，然后进行命令行交互输入