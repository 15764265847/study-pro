const Generator = require('yeoman-generator');

module.exports.myGenerator = class extends Generator {
    prompting() {
        // yeoman会砸询问用户的时候调用该方法
        // 我们就可以通过父类的peompt()方法来发出对用户的命令行询问
        // this.prompt方法返回一个promise，传入一个数组，该数组就是我们的问题
        return this.prompt([
            {
                type: 'input', // 是用什么方式节后用户提交的信息，input，即，使用用户输入的方式来获取用户提交的信息
                name: 'name', // 我们获得的结果的key
                message: 'your project name', // 提示，即我们的问题
                default: this.appname // appname是父类中帮我们拿到的当前生成项目的目录的文件夹的名字，会作为问题的默认值
            }
        ])
        .then(answers => {
            // answers => { name: '[用户的输入]' }
            // 挂载到this上，以便在writing中使用
            this.answers = answers;
        })
    }
    writing() {
        // yeoman在自动生成文件阶段会调用该方法
        // 我们这里可以常识网项目目录中写入文件
        // this.fs.write方法不同于node的fs模块
        // this.fs.write方法第一个参数是绝对路径，我们可以通过this.destinationPath()获取
        // this.destinationPath('temp.txt')方法传入一个要生成的文件名
        // this.fs.write方法第二个参数是文件内容
        // this.fs.write(this.destinationPath('temp.txt'), Math.random().toString());

        // 使用模板文件时我们不再使用写入文件的方式
        // 而是使用copyTpl的方式
        // 第一个参数是模板文件的路径，第二个是输出文件的路径，第三个是模板数据的上下文

        // 模板文件路径
        const teml = this.templatePath('foot.txt');
        // 输出路径
        const output = this.destinationPath('foot.txt');
        // 模板数据上下文
        // 使用prompting()中获取到的answers来当做我们的上下文（即我们传入的数据）
        const context = this.answers;

        this.fs.copyTpl(teml, output, context);
    }
}