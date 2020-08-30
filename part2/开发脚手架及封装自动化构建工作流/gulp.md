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