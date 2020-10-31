基于vue生成静态网站  
这块使用 Gridsome 这个框架来做的，所以需要安装  
gridsome会把loadSource方法或者page-query标签内的数据直接填充到页面内，生成静态网站  
所以当数据库中数据发生变化的时候，开发时需要重启项目，线上的需要重新发布  

# 1、yarn global add @gridsome/cli

# 2、gridsome create my-gridsome-site 使用该命令创建项目的时候可能不成功  
    ## 1、网络问题：因为他会使用一个叫做 sharp 的第三方包，依赖的包比较大，不好下载  
    这里需要在安装gridsome之前预先设置sharp的安装请求地址 可以使用  
        npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"  
        npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"  
    ## 2、c++文件编译问题：该包中有一些c++文件需要编译才能使用  
        安装node-gyp，包的git中有对应的环境的依赖的说明  
            此时这个 node-gyp 还不能使用，需要配置对应的环境  
            比如 macOS 需要安装  
                Python  v2.7 | v3.5 | v3.6 | v3.7 | v3.8  
                Xcode  
            其他系统下查看 node-gyp 的 github 地址  
    ## 3、这里还可能会出现一个问题 第三方包 pngquant-bin 安装包错  
        PS：这个包是用来压缩图片的，这安装的时候会提示缺少另外一个包  

3、然后执行gridsome create my-gridsome-site进行创建项目  
    PS：！！！这里我创建的时候一直不成功，直到我运行了 python -v 才行，考虑到我安装后可能python一直没有运行过，可能这句命令跑了一个 python ？   
    1、这里会帮我们自动安装依赖，但是没有进度条，看不到安装的具体安装到哪了，所以当执行到安装依赖的这一步的时候我们直接 crtl + c断掉
    自己进行手动安装  
    2、删掉已经创建好的node_modules文件目录，重新安装   

4、看下package.json中配置的命令  
    npm run develop 启动dev环境的项目  
    npm run build 打包构建  

5、打包构建后的dist就可以部署在任何支持静态网页的地方  

6、可以测试一下就是使用 serve 第三方包，这个是基于node实现的一个静态服务器  

7、直接执行 serve dist

8、目录结构  
    src  
        1、main.js项目入口  
            1、这里加载了一个组件layouts/Default.vue  
                这里有一个标签 static-query 这个是专门用来查询 GraghQl 的数据给组件使用的  
    .cache 打包过程中缓存的内容  
    dist 打包编译生成的结果  
    static 不需要打包编译的文件放到这里  
    gridsome.config.js  gridsome的配置文件  
    gridsome.server.js  针对服务端配置，是定制 gridsome的一个内部服务功能的配置文件  
        api.createPages(({ createPage }) => {}) 用来创建的页面的方法  
        api.loadSource(({ addCollection }) => {}) 提前注入一些数据   
        其他可参考https://gridsome.org/docs/server-api  

9、项目配置参考 https://gridsome.org/docs/config 官方文档  


gridsome 数据管理    
    1、可以使用 md 文件，具体查看文档  
    2、通用的CMS管理系统  strapi  官网 https://strapi.io  
    3、插件 @gridsome/source-strapi 集成strapi到gridsome中  
 
    部分配置
        1、使用 strapi 时配置 gridsome 的 templates 选项的时候，templates 的属性名字为配置 @gridsome/source-strapi 的属性时配置的 typeName 属性 + contentTypes 属性组合的，例 
            {
                ...,
                plugins: [
                    {
                        use: '@gridsome/source-strapi',
                        options: {
                            apiURL: 'localhost:1337',
                            queryLimit: 100,
                            contentTypes: ['posts', 'postDetail'],
                            typeName: 'strapi', // 这里默认就是 strapi ，因为这是使用集成的 strapi 的插件
                        }
                    }
                ],
                template: {
                    strapiPosts: {
                        path: '/post/:id',
                        components: '组件'
                    }
                }
            }


部署strapi  
    1、strapi默认使用 sqlite 数据库，是基于文件的一种数据库，部署的话不推荐使用这个，可以使用mySQL或者MongoDB  
        1、进入我们创建的strapi项目，找到config下的database.js   
            文档地址 https://strapi.io/documentation/v3.x/concepts/configurations.html#database 直接复制配置示例即可
            粘贴之后还需要修改 settings 中的一些配置  
                host: env('DATABASE_HOST', 'localhost'),  
                port: env.int('DATABASE_PORT', 27017),  
                database: env('DATABASE_NAME', 'strapi'),  
                username: env('DATABASE_USERNAME', 'strapi'),  
                password: env('DATABASE_PASSWORD', 'strapi'),  

            host：数据库地址，如果数据库和服务器在同一地址那么可以配置成 localhost ，如果不是那么需要配置成数据库地址  
            port：数据库访问端口，27017是MongoDB默认地址  
            database：服务器嗦创建的 数据库名字   
            username：数据库访问的用户名  
            password：数据库访问的密码  

    2、然后直接登录购买的服务期，拉取代码，然后 npm run build ,然后安装pm2，运行 pm2 start npm -- run start -- name xxxx  
        我们也可以在项目中添加 pm2.config.json  
            {
                "apps": [
                    {
                    "name": "xxxx",
                    "script": "npm",
                    "args": "run start"
                    }
                ]
            }

部署gridsome应用，视频推荐使用vercel托管静态网站 ， http://vercel.com  
    1、点解 Import Project  按钮  
    2、点击 Import Git Register （导入git仓库）下的 continue 按钮  
    3、输入 git 仓库地址，这里不是使用 git clone 的地址，仓库所属的页面地址  
    4、点击continue 按钮  
    5、FRAMEWORK PRESET ，该选项用来设置生成静态网站所使用的框架，这里会自动识别，如果识别错误的话在修改  
    6、Build And Output Settings 这里是用来重写打包构建命令和重写输出目录的  
    7、Environment Variables 这里用来配置环境变量，视频中的示例没有这个需求  
    8、点击 deploy 按钮  

在数据更新的时候，这里也要自动进行部署  
    1、点击项目，进到项目的详情页面  
    2、点击Settings  
    3、左侧侧边栏有一个 Git Intergration按钮，点击一哈  
    4、找到 Deploy Hook ，然写内容  
    5、名字随便写，部署的分支 一般来说是master  
    6、点击 create hook 按钮   
    7、创建成功后会得到一个地址  ，在 deploy and master 下，复制该 地址  
    8、在 strapi 的页面中，点击设置按钮  
    9、点击 Webhooks 按钮  
    10、点击 添加一个新的 webhook 按钮  
    11、请求地址即前面复制的地址   
    12、事件 表示在什么时候出发，这里全部选择了   
    13、Entry 表示数据在发生什么变化时触发构建，分别是 创建 删除 编辑  
    14、Media 表示图片等在发生什么变化时进行构建，分别是 创建 删除 编辑  
    15、点击保存按钮  



 
                             