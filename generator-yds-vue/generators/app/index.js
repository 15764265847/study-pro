const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    prompting() {
        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'your project name ?',
                default: this.appname
            }
        ])
        .then(answers => {
            this.answers = answers;
        });
    }
    writing() {
        // 需要先把对应的目录结构拷贝到templates下，这里我随便写了一下，因为没有现成的目录结构
        // 我们还需要把随时会变的数据（比如html中title标签一般会使用我们的项目名，这里就可以是ejs模板语法修改）修改成ejs语法
        // 这里我们就需要一个数组来按照templates中的目录结构来生成对应的项目中的目录结构
        // 这个数组存的是每个文件的相对路径
        const templates = [
            'public',
            'src',
            '.gitnore',
            'public/index.html',
            'src/main.js',
            'src/app.vue'
        ]; 

        templates.forEach(item => {
            this.fs.copyTpl(
                this.templatePath(item), // 模板文件地址
                this.destinationPath(item), // 目标文件地址
                this.answers // 获取到的数据
            )
        })
    }
}