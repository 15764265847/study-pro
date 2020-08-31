gulp

** 表示该文件夹下的所有的文件，包括目录以及目录下的子文件或子目录以及其他文件

基础使用
    1、安装 yarn add gulp --dev
    2、创建gulpfile.js ，内容如下
        exports.foo = (done) => {
            console.log('oleilei olala');
            done();
        }
        exports.default = (done) => {
            console.log('default');
            done();
        }
    3、执行yarn gulp foo
    PS：1、gulp也是使用任务这个概念，与grunt定义任务不同的是，gulp的每个任务都是一个函数
        2、gulp最新版本取消了同步模式，即gulp认为每个任务函数中都是一个异步任务，所以需要进行标识任务完成
        3、gulp标识任务完成的方式不同于grunt需要调用this.async()方法获取到标识完成的函数，gulp是通过对每个任务函数进行传参的方式，即如上示例中，任务函数接受一个done形参，gulp运行的时候回传入一个函数，还函数就是用来标识任务完成的函数，在任务函数完成时调用一下即可
        4、default同grunt中都是用来表示默认任务，即运行yarn gulp的时候会自动执行default任务
        5、如上写法是gulp4.0之后的写法也是最推荐的写法，4.0之前的写法如下
            const gulp = require('gulp');
            gulp.task('foo', done => {
                console.log('foo');
                done();
            })
            该写法，在4.0之后的版本也可以使用，因为gulp4.0保存了该Api以保证兼容性，但是该写法不推荐使用
    4、gulp组合任务，series创建串行任务，parallel创建并行任务，示例如下
        const { series, parallel } = require('gulp');
        const task1 = done => {
            setTimeout(() => {
                console.log('task1111111111111111111');
                done();
            }, 1000);
        }
        const task2 = done => {
            setTimeout(() => {
                console.log('task2222222222222222222');
                done();
            }, 1000);
        }
        const task3 = done => {
            setTimeout(() => {
                console.log('task3333333333333333333');
                done();
            }, 1000);
        }
        // series会依次执行每一个任务，即前一个任务执行完才会执行第二个任务
        // series可以接受无限个数的参数
        // 使用yarn gulp foo ，即将上述三个函数导出一个依次执行的任务函数foo
        exports.foo = series(task1, task2, task3);
        // 并行任务
        // 同样可以接受不限个数的参数
        // 使用yarn gulp bar，即将上述三个函数导出一个并行执行的任务函数bar
        exports.bar = parallel(task1, task2, task3);
    5、异步任务完成时通知gulp该异步任务完成了的方式有三种
        1）done函数，上面都有用到过，就是定义任务函数时，使用形参接收这个参数，然后在任务完成时调用即可
        done函数可以接受一个错误参数，一旦发生错误gulp会直接抛出一个错误，后续任务就不会执行了
            exports.foo = (done) => {
                console.log('oleilei olala');
                done();
            }
            exports.errorCallback = done => {
                console.log('error callback');
                done(new Error('fail'));
            }
        2）Promise也可以用来确认任务已经完成，成功直接调用Promise.resolve()方法，不需要传入任何值，因为gulp会忽略掉
        失败时直接使用Promise.reject()方法，同样会结束后续任务 的执行
            exports.pormise_resolve = () => {
                console.log('pormise_resolve');
                return Promise.resolve();
            }
            exports.pormise_reject = () => {
                console.log('pormise_resolve');
                return Promise.reject(new Error('task fail'));
            }
        3）使用async/awaitde方式
            // 使用async/await的方式
            const settime = time => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, time);
                });
            }
            exports.async = async () => {
                await settime(1000);
                console.log('async complete');
            }
        4）使用stream的方式，该方式的结束相当于是给stream注册了end事件，触发end事件后调用done
            // stream的方式
            const {createReadStream, createWriteStream} = require('fs');
            exports.stream_pipe = () => {
                const readStream = createReadStream('package.json');
                const writeStream = createWriteStream('temp.txt');
                readStream.pipe(writeStream);
                return readStream;
            }
            等同于下面的写法
            exports.stream_pipe = (done) => {
                const readStream = createReadStream('package.json');
                const writeStream = createWriteStream('temp.txt');
                readStream.pipe(writeStream);
                readStream.on('end', () => {
                    done();
                });
            }
    6、构建过程核心工作原理，示例
        // 工作过程示例
        const {createReadStream, createWriteStream} = require('fs');
        const { Transform } = require('stream');

        exports.stream_example = () => {
            const read = createReadStream('package.json');
            const write = createWriteStream('package_ugly.json');
            const transform = new Transform({
                transform: (chunk, encoding, callback) => {
                    const input = chunk.toString().replace(/\s+/g, '').replace(/\/\*.+?\*\//g, '');
                    callback(null, input);
                }
            });
            read.pipe(transform).pipe(write);
            return read;
        }
    7、文件操作Api+插件使用，src()会创建一个读取流，dest会创建一个写入流
        1）gulp给我们提供了文件操作的Api，基于node封装，比node的Api更强大更易使用 
        2）文件的编译压缩等操作使用插件来操作
        这里我们使用到两个插件，gulp-clean-css用来压缩css文件，gulp-rename用来变更生成的文件名
        简单示例如下 
            const { src, dest } = require('gulp');
            const cleanCss = require('gulp-clean-css');
            const rename = require('gulp-rename');
            exports.dealCss = () => {
                return src('gulpSrc/*.css').pipe(cleanCss()).pipe(rename({ extname: '.min.css' })).pipe(dest('gulpDist'))
            }


将gulpfile.js和gulp开发成一个单独的npm模块，以供我们其他项目使用该模块，此处以我们开发的gulp-stream-yds模块为例
一、开发过程中如何使用gulp-stream-yds：
    1、在gulp-stream-yds项目中，yarn link一下全局化gulp-stream-yds命令
    2、在使用的项目中yarn link 'gulp-stream-yds'
二、在我们直接使用gulpfile.js的项目中我们安装许多gulp工作流的开发依赖，但是当我们把这些东西集成到gulp-stream-yds项目中时，这些开发依赖就会成为工作依赖，即在gulp-stream-yds项目中这些依赖应该安装到dependencies中
三、数据，在gulpfile.js中我们使用data作为我们使用模板引擎填充到需要编译的文件中的，即这些数据都应该属于我们使用gulp-stream-yds的项目的，这些数据应该是作为我们配置传入到gulp-stream-yds中的，我们需要一个配置文件，定义配置文件为gsy.config.js，意思是gulp-stream-yds的配置文件
四、关于@babel/preset-env使用的问题，在gulpfile.js中我们使用的字符串，此时使用就会直接从我们当前项目中寻找，而不是从gulp-stream-yds寻找，此时如果当前项目没有安装@babel/preset-env就会报错，所以在gulp-stream-yds模块中我们需要使用require的方式载入模块进行使用，这样他就会直接从gulp-stream-yds的依赖中寻找
五、文件路径
    我们要把gulp-stream-yds中使用的路径抽出来作为配置项使用，gulp-stream-yds中的路径是以使用项目的根目录来作为使用路径的，以当前项目study-pro为例，在gulp-stream-yds中使用gulpSrc/assets/scripts/*.js，则是从study-pro直接开始查找，即他的寻找路径最终为study-pro/gulpSrc/assets/scripts/*.js
六、假设当前目录没有gulpfile.js我们该怎么使用
    PS：一般来讲我们开发的模块的代码的主入口应该放到lib目录下，cli的文件放到bin目录下
    1>创建一个bin目录，然后创建一个gulp-stream-yds.js文件，作为cli的执行入口
    2>在package.json中添加"bin": "bin/gulp-stream-yds.js"
        PS："bin"也可以配置为一个对象"bin": {yds: "bin/gulp-stream-yds.js"}，该对象中的key将作为执行的命令，此示例中yds将作为改模跨跌执行命令，不指定的话应该是我们的模块的名称！！！
    3>我们在my-cli中提到过，cli入口文件必须需要添加一个头信息 #!/usr/bin/env node，然后需要将入口的文件的权限使用chmod 755 bin/gulp-stream-yds.js修改755才可以
    4>yarn link一下
    5>gulp-stream-yds.js如下
        // 添加命令行参数，因为我们执行yarn gulp [任务名称]的时候可以在后面添加--cwd和--gulpfile两个参数
        // --cwd [路径] 指定的是我们命令行的执行目录
        // --gulpfile 指定的就是gulpfile.js所在的目录
        // 添加命令行执行目录
        process.argv.push('--cwd');
        process.argv.push(process.cwd());
        // 添加hulpfile.js所在目录
        process.argv.push('--gulpfile');
        // require.resolve方法是用来找到模块对应的路径
        // 此处可以直接传'..'，因为直接传..是找到上册目录，这里上层目录就是根目录，此时就会自动查找package.json中配置的main属性对应的文件
        process.argv.push(require.resolve('../lib/index'));

        // gulp/bin/gulp中是使用require('gulp-cli')()进行执行的
        // 我们这里直接require一下'gulp/bin/gulp'，就会直接执行require('gulp-cli')()
        require('gulp/bin/gulp');
    6>yarn publish --rehistry=https://regitry.yarnpkg.com 发布
        PS:这里注意一个问题就是此时只会发布根目录下的文件（不包含目录），以及package.json中配置的files下的目录及其中的文件，但是我们这里有bin目录所以需要配置files为["bin", "lib"]，files默认只有"lib"
        files: ["bin", "lib"]
        PS：这里无法使用淘宝源，因为淘宝源的只读的，也可以使用npm的地址，yarn的官方镜像和npm的是保持一致的
            另外npm源同步到淘宝源会有时间差，所以我们刚publish后可能使用淘宝源安装不了当前的gulp-stream-yds
                解决：去淘宝源同步一下
