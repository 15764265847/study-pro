基于vue生成静态网站
这块使用 Gridsome 这个框架来做的，所以需要安装

1、yarn global add @gridsome/cli

2、gridsome create my-gridsome-site 使用该命令创建项目的时候可能不成功
    1、网络问题：因为他会使用一个叫做 sharp 的第三方包，依赖的包比较大，不好下载
    这里可以使用
        npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"
        npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"
    2、c++文件编译问题：该包中有一些c++文件需要编译才能使用
        安装node-gyp，包的git中有对应的环境的依赖的说明
            此时这个node-gyp还不能使用，需要配置对应的环境
            比如 macOS 需要安装
                Python  v2.7 | v3.5 | v3.6 | v3.7 | v3.8
                Xcode

3、然后执行gridsome create my-gridsome-site进行创建项目
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

 
                             