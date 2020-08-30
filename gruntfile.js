// 本文件是grunt的入口文件
// 用于定义一些grunt自动执行的任务
// 该文件需要导出一个函数
// 函数接收一个形参grunt，这个参数是grunt传入的一个对象，内部定义了一些Api用于我们的构建操作
const loadGruntTasks = require('load-grunt-tasks');

module.exports = grunt => {
    // registerTask用于注册任务
    // 第一个参数接受一个字符串，表示任务名字
    // 第二个参数可以是一个函数，即当该任务发生时自动执行的函数
    // 也可以是一个字符串，此时表示对该任务的描述
    // 使用字符串作为第二个参数时，任务函数为第三个参数
    grunt.registerTask('foo', () => {
        console.log('hello grunt');
    });

    grunt.registerTask('bar', '任务描述', () => {
        console.log('get bar');
    });
    
    // 任务名称为default的时候，则为默认任务，即grunt会自动执行，不需要在命令行中使用任务名称
    // grunt.registerTask('default', '任务描述', () => {
    //     console.log('default task');
    // });

    // registerTask的第一个参数是default，第二个参数是数组（此时内容应该是其他几项任务的任务名称）时，则会一次执行该数组中的任务
    grunt.registerTask('defalut', ['foo', 'bar']);

    // grunt 默认只支持同步模式，即在任务函数中使用异步代码是不会执行的
    // 异步任务时我们需要在任务函数中调用this.async()来得到一个done方法，表示异步函数的执行完成
    // 如果done没有执行会一直等待，知道done执行
    grunt.registerTask('async-task', function () {
        const done = this.async();
        setTimeout(() => {
            console.log('async task complete');
            done();
        })
    });

    // 任务执行失败，任务函数中 return false 即表示任务函数失败
    grunt.registerTask('foo2', () => {
        console.log('hello grunt');
        return false;
    });

    // 异步任务标示失败，需在done函数执行时传入false即可
    grunt.registerTask('async-task2', function () {
        const done = this.async();
        setTimeout(() => {
            console.log('async task complete');
            done(false);
        })
    });

    // 使用initConfig添加配置项
    grunt.initConfig({
        first: 'this is the first',
        second: {
            msg: 'this is the second'
        }
    });
    // 使用config获取添加的配置项
    // 某配置项为对象时此处是second，我们可以在config方法中直接还是用second.msg来获取second中的某个成员的值
    grunt.registerTask('first', () => {
        let msg = grunt.config('first');
        console.log(msg);
    });
    grunt.registerTask('second', () => {
        let msgSecond = grunt.config('second.msg');
        console.log(msgSecond);
    });

    // 多目标模式，可以让人物根据配置形成多个子任务
    // 多目标模式使用registerMultiTask方法，传参和registerTask一样
    // 设置多目标任务时，必须设置任务目标，任务目标在initConfig中设置
    // yarn grunt build运行时会依次运行build:html, build:css, build:js
    // 多任务目标也可以单独执行
    // 运行yarn grunt build:css或yarn grunt build:js可单独运行其中一个
    // 单独运行其中某一个时，我们可以通过 this.target或者到目标，this.data获取到目标对应的数据
    grunt.initConfig({
        build: {
            // options并不会作为一个单独的目标执行，因为options是对于build的一个配置选项
            // 在任务函数中可以通过this.options()方法获取到
            optios: {
                foo: 'bar'
            },
            // 目标当中也可以单独配置任务项
            // 在目标（此处是html），也即是在html这个目标中配置的options会覆盖掉build配置的options
            // 即可以再单独的目标中在进行配置options，目标的单独配置的options会覆盖build配置的options
            html: {
                options: {
                    foo: 'taz'
                }
            },
            css: '1',
            js: '2'
        }
    })
    grunt.registerMultiTask('build', function() {
        // 如果我们运行 yarn grunt build:css，则输出target: css, data: 1
        console.log(`target: ${this.target}, data: ${this.data}`);
        // 如果我们运行 yarn grunt build:html，则输出options: { foo: 'taz' }
        console.log(`options：${ this.options() }`);
        console.log('build');
    });

    //由于grunt-contrib-clean使用的多目标模式，所以需要先设置目标
    grunt.initConfig({
        clean: {
            // 指定目录文件，该任务运行后将删除这里配置的app.js
            // temp: 'temp/app.js'
            // 使用通配符（*）,运行此处配置则会删除temp目录下的后缀名为txt文件
            // temp: 'temp/*.txt'
            // 也可以使用**
            // 此处运行后则会删除temp目录下的所有文件包括目录
            temp: 'temp/**'
        }
    })
    grunt.loadNpmTasks('grunt-contrib-clean');

    // 常用插件
    // 一、grunt-sass，没错就是grunt-sass，它是由sass官方提供的，不是grunt官方提供的
    // 他也是多目标模式
    // grunt-sass有许多配置项，这里只写了两个，更多的需要去官方文档查看
    let sass = require('sass');
    grunt.initConfig({
        sass: {
            // 该插件需要我们传入配置项options，
            options: {
                // 该属性表示我们要用什么模块来处理scss文件
                // 此处就是我们需要使用sass来处理我们的scss文件
                implementation: sass,
                // 设置sourceMap，会自动生成对应的sourceMap文件，用来调试
                sourceMap: true
            },
            main: {
                files: {
                    // grunt-sass的配置项，需要配置在sass下的main下的files下
                    // files是一个对象，key为输出路径，value为输入路径，即我们要编译的sass文件的路径 
                    'dist/css/main.css': 'src/scss/main.scss'
                }
            }
        }
    });
    // 二、grunt-babel，用来编译es6的，使用grunt-babel需要先安装babel的核心文件和预设文件，即@babel/core、@babel/preset-env
    grunt.initConfig({
        babel: {
            options: {
                presets: ['@babel/preset-env'],
                sourceMap: true
            },
            // 目标规则同grunt-sass使用
            main: {
                files: {
                    'src/js/app.js': 'dist/js/app.js'
                }
            }
        }
    });
    // 三、grunt-contrib-watch修改后自动编译
    grunt.initConfig({
        watch: {
            js: {
                // files表示我们要监听哪些文件的变动，此处就是监听js目下的所有js文件，一旦有变动会帮我们执行babel任务进行编译
                files: ['src/js/*.js'],
                // tasks表示当我们监听的文件修改后，需要自动执行那些任务，此处就是执行babel任务去帮我们编译
                // tasks是一个数组因为我们肯能会使用多个任务去处理文件
                tasks: ['babel']
            },
            css: {
                files: ['src/scss/*.scss'],
                tasks: ['sass']
            },
        }
    });
    loadGruntTasks(gtrunt);
    // watch大多属配合，默认任务使用，保证watch任务执行之前进行了一次编译
    grunt.registerTask('default', ['sass', 'babel', 'watch'])
}