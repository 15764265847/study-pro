// 简答题
// 一、
// 认识：工程化可以让我们更加关注业务的开发，而减少对于非业务之外的所有机械化程式化的操作的关注
// 解决问题：
// 1、代码风格不统一
// 2、模块化不支持
// 3、编译打包构建等重复性机械性的操作比较多
// 4、不支持es6新特性
// 5、less、sass等不支持
// 6、开发依赖后端的完成

// 二、
// 1、约定规范化的目录结构
// 2、可以集成大量工具的支持，less，sass，babel等等
// 3、可以提供一些工具的通用配置项，像vue-cli3提供的webpack配置
// 4、自带开发服务器

// 三、
// 脚手架实现步骤
// 1、mkdir new-project && cd new-project
// 2、yarn init
// 3、package.json添加"bin": "index.js"
// 4、bin目录下添加index.js，头部添加 #!/usr/bin/env node ，指定使用node去解释该脚本，即该脚本是用node跑的
// 5、index.js里随便加点可执行的js代码
// 6、yarn link一下
// 7、Mac os需要改文件权限 chmod 755 index.js
// 8、yarn new-project就可以在本地运行
// 9、yarn publish --registry https://registry.yarnpkg.com/ 发布即可
// 添加templates/index.html
// 在index.js添加以下代码即可运行
let inquirer = require('inquirer');
let ejs = require('ejs');
let { join } = require('path');
let { readdirSync, writeFileSync } = require('fs');

inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'your project name'
}])
.then(answers => {
    const readDir = join(__dirname, 'templates');
    readdirSync(readDir).forEach(file => {
        ejs.renderFile(join(readDir, file), answers, (err, result) => {
            if (err) return;
            writeFileSync(join(process.cwd(), file), result);
        })
    })
});

// gulp自动化构建代码
// 实现这个项目的构建任务
const { src, dest, series,parallel } = require('gulp');
const plugins = require('gulp-load-plugins')();
const { sass, babel, htmlmin, imagemin, swig, watch, uglify, cleanCss, useref } = plugins;
const devServer = require('browser-sync').create();
const del = require('del');

let baseSrc = {
    base: 'src'
}
const data = {
    menus: [
      {
        name: 'Home',
        icon: 'aperture',
        link: 'index.html'
      },
      {
        name: 'Features',
        link: 'features.html'
      },
      {
        name: 'About',
        link: 'about.html'
      },
      {
        name: 'Contact',
        link: '#',
        children: [
          {
            name: 'Twitter',
            link: 'https://twitter.com/w_zce'
          },
          {
            name: 'About',
            link: 'https://weibo.com/zceme'
          },
          {
            name: 'divider'
          },
          {
            name: 'About',
            link: 'https://github.com/zce'
          }
        ]
      }
    ],
    pkg: require('./package.json'),
    date: new Date()
}
const streamTo = {
    stream: true
};
const assets = 'src/assets';
const temp = 'temp';
const dist = 'dist';

const style = () => {
    return src(`${ assets }/styles/*.scss`, baseSrc)
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(dest(temp))
        .pipe(devServer.reload(streamTo));
}

const script = () => {
    return src(`${ assets }/scripts/*.js`, baseSrc)
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest(temp))
        .pipe(devServer.reload(streamTo));
}

const page = () => {
    return src(`src/*.html`, baseSrc)
        .pipe(swig({ data, defaults: { cache: false } }))
        .pipe(dest(temp))
        .pipe(devServer.reload(streamTo));
}

const image = () => {
    return src(`${ assets }/images/**`, baseSrc)
        .pipe(imagemin())
        .pipe(dest(dist));
}

const font  = () => {
    return src(`${ assets }/fonts/**`, baseSrc)
        .pipe(imagemin())
        .pipe(dest(dist));
}

const public  = () => {
    return src(`public/**`, baseSrc)
        .pipe(imagemin())
        .pipe(dest(dist));
}

const serve = () => {
    watch(`${ assets }/styles/*.scss`, style);
    watch(`${ assets }/scripts/*.js`, style);
    watch(`src/*.html`, style);

    watch([
        `${ assets }/images/**`,
        `${ assets }/fonts/**`,
        `public/**`
    ], devServer.reload);

    devServer.init({
        port: 9000,
        notify: false,
        server: {
            // file: 'temp/**',
            baseDir: [temp, 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

const changeDepend = () => {
    return src(`${ temp }/*.html`, baseSrc)
        .pipe(useref({ searchPath: [temp, '.'] }))
        .pipe(plugins.if(/\.js$/, uglify()))
        .pipe(plugins.if(/\.css$/, cleanCss()))
        .pipe(plugins.if(/\.html$/, htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        })))
        .pipe(dest(dist));
}

const clean = () => {
    return del([dist, temp]);
}

const compile = parallel(style, script, page);

const uglifyOther = parallel(image, font, public);

const buildDev = series(compile, serve);

const build = series(clean, parallel(series(compile, changeDepend), uglifyOther))

module.exports = {
    buildDev,
    build,
    // compile,
    // uglifyOther,
    // changeDepend
}
