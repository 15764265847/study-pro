单页首屏渲染慢的原因
    1、



nuxt动态路由即   student/:id这种形式的路由


nuxt 中asyncData钩子函数只能在页面组件中使用，而且其内部没有this
    asyncData钩子函数可以传一个参数，这个参数上下文对象，内部保存了很多数据，例如可以获取到路由信息

### pm2进程守护 配置文件
    {
        "apps": [
            {
            "name": "RealWorld",
            "script": "npm",
            "args": "start"
            }
        ]
    }
    name表示任务名字
    script表示要执行的命令 此处就是执行npm
    args表示执行命令的参数 此处就是start
    即此处最后是pm2帮我们执行 npm start 命令，是我们在package.json中配置好的执行打包后文件的命令


### 可以使用 github actions 发布
    1、右上角个人有个settings按钮，点击
    2、侧边栏中有个Developer settings按钮，点击
    3、然后点击侧边栏的Personal access tokens按钮
    4、右侧有一个Generate new token按钮点击
    5、填写Note选项起名字
    6、选择权限，默认选择第一个所有的就可以，有其他需求自选下面的

    13bfe743f12b05dc82de4ad0b1e139d8a35edac8这是我生成的第一个token

    7、进入到你的远程仓库中，在code、issues那一行导航栏的最后有一个settings按钮，点击
    8、侧边栏点击Secrets按钮
    9、此时展示的页面右侧有一个New Secrects按钮，点击 
    10、输入name，这个name建议和token的姓名一致，比如前面输入的是TOKEN，这里建议也是TOKEN
    11、输入value，这里的value就是前面生成的token，此时我们生成的是13bfe743f12b05dc82de4ad0b1e139d8a35edac8
    12、添加完成后点击Add secret按钮

    配置github actions的执行脚本
    1、项目根目录下创建 .github/workflows 的工作目录，添加main.yml脚本，这里已经放了一份已配好的脚本工作流脚本文件，可以直接使用，也可是当修改

        main.yml中
            name: Publish And Deploy Demo
            on:
            push:
                tags:
                - 'v*'
            这里表示当我们提交带有以 v 开头的tag的代码的时候，这里的发布脚本就会自动执行，普通的提交不会执行发布脚本
                例 git tag v1.0.0
                   git push origin v1.0.0
                   将打的tag推送到远程仓库就会触发我们的发布脚本的执行
                在code、issues那一行导航栏中有一个按钮叫actions，打开就可以看到构建部署测试的面板

    2、配置连接远程数据库使用地址，用户名，密码及端口号，每一个都是一个键值对，添加同添加TOKEN方式
        1、进入到你的远程仓库中，在code、issues那一行导航栏的最后有一个settings按钮，点击
        2、侧边栏点击Secrets按钮
        3、此时展示的页面右侧有一个New Secrects按钮，点击 
        4、输入name，这个name建议和token的姓名一致，比如前面输入的是TOKEN，这里建议也是TOKEN
        5、输入value，这里的value就是前面生成的token，此时我们生成的是13bfe743f12b05dc82de4ad0b1e139d8a35edac8
        6、添加完成后点击A dd secret按钮