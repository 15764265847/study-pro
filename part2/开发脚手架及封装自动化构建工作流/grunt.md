grunt 构建工具的使用

课程中是新建了一个空文件然后才开始使用的，需要yarn init 和 yarn add grunt
grunt会在构建过程中使用大量临时文件，即我们在编译sass文件时，他会先生成一个临时文件保存，然后在生成对应的文件，并写入，所以grunt的构建过程会比较慢
1、新建一个gruntfile.js，这个文件时grunt的入口文件，改文件需要导出一个函数，函数接收一个grunt的参数，定义了一些工具Api
    内容如下
        // 本文件是grunt的入口文件
        // 用于定义一些grunt自动执行的任务
        // 该文件需要导出一个函数
        // 函数接收一个形参grunt，这个参数是grunt传入的一个对象，内部定义了一些Api用于我们的构建操作

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
            grunt.registerTask('default', '任务描述', () => {
                console.log('default task');
            });

            // registerTask的第一个参数是default，第二个参数是数组（此时内容应该是其他几项任务的任务名称）时，则会依次执行该数组中的任务
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
            grunt.registerTask('foo', () => {
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
        }
    PS：1、任务名称可以为default，任务名称为default的时候，则为默认任务，即grunt会自动执行，不需要在命令行中使用任务名称
        2、registerTask的第一个参数是default，第二个参数是数组（此时内容应该是其他几项任务的任务名称）时，则会依次执行该数组中的任务。
           该方式可以将多项任务串联到一块依次执行
        3、1> grunt 默认只支持同步模式，即在任务函数中使用异步代码是不会执行的
           2> 这是想要支持异步代码需要调用this.async()方法获取到一个done方法，done方法执行表示该异步任务的完成
           3> 如果done一直没有执行，grunt则会等待，知道done执行完毕
        4、任务失败，只需要在任务函数中 return false
        5、使用default执行任务列表时，当其中一个任务失败时（return false）时，失败任务之后的任务都不会执行
        6、使用default执行任务列表时可以再命令行中添加 --force，即 yarn grunt default --force，会强制执行任务列表中的所有任务，即使中间有任务运行失败  
        7、异步任务无法直接使用return false来表示失败，但是可以在表示任务结束的done函数调用时传入false即表示该异步任务失败
2、然后执行yarn grunt foo ，这里的foo就是我们在registerTask中的第一个参数，即任务名称
3、在grunt中添加配置项，使用grunt.initConfig，参数是一个对象，传入的配置我们可以通过grunt.config方法来获取；示例如下
        module.exports = grunt => {
            // 使用initConfig添加配置项
            // 属性名必须和我们的任务名称相同
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
        }
4、多目标模式，使用如下
    1>使用多目标模式需要先使用initConfig方法配置目标
    2>initConfig中的对象属性必须和我们的任务名相同
    3>默认使用yarn grunt build相当于是依次执行yarn grunt build:css、yarn grunt build:js、yarn grunt build:html三条命令
    4>任务目标和目标对应的值，我们可以在任务函数中使用this.target和this.data分别获取
    5>我们可以在任务下配置其配置项，即此处我们可以在initConfig中build中配置options选项，options不会被当做目标来执行，可以通过this.options方法来获取options中配置的属性
    6>我们也可以在目标中配置单独的options配置项，如下html中配置了options，使用this.options获取时，会获取到目标（当前是html）中的配置项
    而不是配置在build中的配置项
    7>目标的名字没有特定的规则，只是用来帮我们切割成多个子任务，我们可以根据子任务中配置的许多属性来分别执行不同的东西，所以目标的名字相当于是我们对于当前子任务的一个描述
        module.exports = grunt => {
            // 多目标模式，可以让任务根据配置形成多个子任务 
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
                console.log('build');
            });
        }
5、grunt中插件的使用，grunt插件命名规范为 grunt-contrib-[taskname]，示例中为grunt-contrib-clean，clean即为该插件中的任务名称，即我们使用grunt插件时使用yarn grunt [taskname]
    1）安装对应插件
    2）使用grunt.loadNpmTasks加载grunt插件，此处是 grunt.loadNpmTasks('grunt-contrib-clean');
    3）直接使用yarn grunt [taskname]，来运行插件，此处是yarn grunt clean
    此处我们使用grunt-contrib-clean插件，该插件用来清除grunt中的文件，示例如下
        module.exports = grunt => {
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
        }
6、常用插件
    1）load-grunt-tasks，让我们在grunt使用过程中不用每次都调用loadNpmTasks方法来加载grunt插件，使用如下
        let loadGruntTasks = require('load-grunt-tasks);
        module.export = grunt => {
            grunt.initConfig({});
            // 该插件会自动帮我们加载所有的grunt插件
            loadGruntTasks(grunt);
        }
    2）grunt-sass 没错就是grunt-sass，他不是grunt官方提供的，是sass官方提供的对于grunt的支持，使用如下
        const sass = require('sass');
        const loadGruntTasks = require('load-grunt-tasks');
        module.exports = grunt => {
            grunt.initConfig({
                sass: {
                    // 该插件需要我们传入配置项options，
                    options: {
                        // 该属性表示我们要用什么模块来处理scss文件
                        // 此处就是我们需要使用sass来处理我们的scss文件，grunt会使用sass来进行编译
                        implementation: sass
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
            loadGruntTasks(grunt);
        }
        然后使用yarn grunt sass进行编译就可以了
    3）grunt-babel使用如下，这里我也不知道为啥grunt-babel不需要使用implementation，反正就是不需要
        const loadGruntTasks = require('load-grunt-tasks');
        module.exports = grunt => {
            grunt.initConfig({
                babel: {
                    options: {
                        // @babel/preset-env编译所有的es6特性为es5或更低
                        presets: ['@babel/preset-env'],
                        // 会生成对应的sourceMap文件，表现形式为add.js.map文件
                        sourceMap: true
                    },
                    main: {
                        files: {
                            'src/js/app.js': 'dist/js/app.js'
                        }
                    }
                }
            });
            loadGruntTasks(grunt);
        }
    4）grunt-contrib-watch 修改后需要自动进行重新编译需要该插件，使用如下
        PS：我们的任务配置可以在initConfig中一起配置，不要要拆成单个配置，上面只是为了演示完成代码
        const loadGruntTasks = require('load-grunt-tasks');
        module.exports = grunt => {
            grunt.initConfig({
                babel: '上面配置的babel选项',
                sass: '上面配置的sass选项',
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
            loadGruntTasks(grunt);
            // watch任务大多属配合，默认任务使用，保证watch任务执行之前进行了一次编译
            grunt.registerTask('default', ['sass', 'babel', 'watch'])
        }

其他插件可以是去官方查看

