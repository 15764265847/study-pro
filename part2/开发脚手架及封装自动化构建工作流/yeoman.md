面临的问题
1、新特性兼容性问题
2、less、scss、postcss无法支持
3、模块化不支持
4、重复性工作，压缩，上传等等
5、协同开发时的代码风格不统一，质量无法保证
6、许多功能我们需要等待后端Api

create-react-app、vue-cli、angular-cli
准确释义是 针对某一个类型的项目官方给出的集成式工程化方案，约定了特定的目录结构以及其他的工具库

脚手架的作用是针对某一个类型的项目给开发者约定了某个规范，就是项目目录结构，项目该长什么样，那些文件改放到哪些文件目录下

Yeoman  通用性脚手架工具，根据某些特定的模板，生成特定的结构
Plop  用于在项目开发过程中创建某些特性类型文件，比如react组件，一个组建一个文件夹，文件夹内部是一个js，一个css，一个测试用的js文件，
      我们就可以使用plop来生成这样一个特定的react组件文件夹


Yeoman的优点也是缺点，即过于通用，不够专注 
一、Yeoman基础使用
安装  yarn global add yo
    单独安装完成yeoman并不能使用，还需要安装对应的generator模块不同的generator帮我们生成不同的项目，例如要生成node项目，需先安装generator-node这个模块

yarn global add generator-node
然后可以执行 
yo node [项目名]
命令中node即generator-node中的node，切记使用这个创建项目时需先创建一个项目文件夹

二、sub generator   有时候我们不是创建一个完整的项目，只是在当前项目下创建一个某一个文件，比如babel的配置文件，我们手动配置可能会配置出错，我们就可以使用yeoman提供的sub generator的提醒来实现
    还是以generator-node为例，该模块中提供了node:cli命令来将我们的项目变成一个cli应用
1、yo node:cli
   即在原有的generator的后面跟上':'以及sub generator的名字，此处是cli
2、然后yarn安装依赖
3、然后
   yarn link
   将该项目作为一个全局的命令行模块去使用
PS：此处的sub generator并不是每一个generator模块都提供，我们需要去官方文档查看generator下有没有对应的sub generator
4、此时运行我们全局化的命令是不行的，因为MAC下有权限问题

三、创建自己的generator
1、创建一个文件夹generator-simple（名字必须是generator-[名字]），即项目并进入该目录下
2、yarn init 创建package.json
3、安装yeoman-generator，该模块提供了自建generator的一些基类和一些工具函数
   yarn add yeoman-generator
4、1>然后该项目下创建一个generators文件夹，generators文件夹下创建app文件夹，app文件夹下创建index.js
   2>该index.js文件将作为generator的核心入口
   3>index.js中需要导出一个继承自yeoman generator的类
   4>yeoman generator在工作时会自动调用此类中定义的一些生命周期方法
   5>我们在这些生命周期方法中可以使用父类提供的一个工具方法类实现一些功能，比如文件写入
        const Generator = require('yeoman-generator');

        module.exports.myGenerator = class extends Generator {
            writing() {
                // yeoman在自动生成文件阶段会调用该方法
                // 我们这里可以常识网项目目录中写入文件
                // this.fs.write方法不同于node的fs模块
                // this.fs.write方法第一个参数是绝对路径，我们可以通过this.destinationPath()获取
                // this.destinationPath('temp.txt')方法传入一个要生成的文件名
                // this.fs.write方法第二个参数是文件内容
                this.fs.write(this.destinationPath('temp.txt'), Math.random().toString());
            }
        }
5、然后我们就可以使用yarn link使之全局化我们就可以创建目录并在目录中使用yo simple来创建名字了
6、使用模板文件
   1>app目录下创建一个templates目录，在该目录中创建模板文件，例此处创建一个foot.txt文件，内容如下：
        这是一个模板文件
        内不可以使用ejs规范输出数据
        例如 <%= title %>

        ejs其他语法也支持
        <% if (success) {%>
        哈哈哈
        <% } %>
   2>然后index.js中敲代码
        const Generator = require('yeoman-generator');
        
        module.exports.myGenerator = class extends Generator {
            writing() {
                // 使用模板文件时我们不再使用写入文件的方式
                // 而是使用copyTemplate的方式
                // 第一个参数是模板文件的路径，第二个是输出文件的路径，第三个是模板数据的上下文

                // 模板文件路径
                const teml = this.templatePath('foot.txt');
            }
        }
7、在使用过程中我们会一些动态的数据都是通过命令行交互的方式获取到的比如我们的项目名称等
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
8、然后直接使用yo simple即可，因为simple命令我们在步骤5中已经实现过了 
9、generator-yds-vue vue的通用脚手架代码示例
   如果html中有需要有需要原封不动的输出的ejs模板需要<%% BASE_URL %>，在第一个%后加一个%进行转义
   然后使用yarn link全局化
   yo yds-vue 生成文件
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
10、generator发布，因为它本身就是一个npm包，所以走npm的发布就可以
    echo node_modules > .gitnore 添加不需要提交的文件，windows走这个命令，MAC不知道
    git init
    git add .
    git commit -m "提交信息"
    git官网自己账户下创建一个仓库
    git remote add origin 仓库地址
    git push origin master
    yarn publish --rehistry=https://regitry.yarnpkg.com 
    PS：这里无法使用淘宝源，因为淘宝源的只读的，也可以使用npm的地址，yarn的官方镜像和npm的是保持一致的


    

