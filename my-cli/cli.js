#!/usr/bin/env node

// console.log('wangbadan')

const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'component'
}])
.then(answer => {
    // console.log(answer);
    // 获取模板目录
    const tplPath = path.join(__dirname, 'templates');
    // 获取目标目录，命令行在哪个文件夹下执行就是哪个目录，我们可以通过process.cwd()获取
    const outputPath = process.cwd();
    // 通过fs模块读取模板目录下有哪些文件
    fs.readdir(tplPath, (err, files) => {
        if (err) {
            throw err;
        }
        files.forEach(file => {
            // 通过模板引擎渲染
            ejs.renderFile(path.join(tplPath, file), answer, (err, result) => {
                if (err) throw err;
                // 将结果写入到目标目录
                fs.writeFileSync(path.join(outputPath, file), result);
            });
        });
    })
})