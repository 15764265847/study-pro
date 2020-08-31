开发一个小型的脚手架工具
1、新建一个文件夹叫做my-cli
2、yarn init一下，生成package.json
3、添加"bin": "cli.js"，以cli.js为入口文件
    初始化并添加“bin”后的package.json内容如下
        {
            "name": "my-cli",
            "version": "1.0.0",
            "bin": "cli.js",
            "main": "index.js",
            "license": "MIT"
        }
4、安装inquirer模块，该模块是用来做命令行交互的
    yarn add inquirer
5、因为我们可能会根据本模板来生成文件，所以我们需要安装模板引擎，该实例中使用的是ejs
    yarn add ejs
6、我们需要一个文件夹来存放我们的模板文件，新建一个templates文件夹，并且新建一个index.html，内容如下
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title><%= name %></title>
        </head>
        <body>
            
        </body>
        </html>
7、创建一个cli.js，内容如下
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
8、node cli的入口文件必须要有一个特定的文件头
   #!/usr/bin/env node
9、如果是linux或者MAC os的系统该文件还需要修改cli.js的读写权限，改为755
    chmod 755 cli.js
10、通过yarn link命令全局化就可以使用了，我们自定义cli的命令就是我们的项目名，此刻我们这是my-cli
11、yarn publish --rehistry=https://regitry.yarnpkg.com 
    PS：这里无法使用淘宝源，因为淘宝源的只读的，也可以使用npm的地址，yarn的官方镜像和npm的是保持一致的
