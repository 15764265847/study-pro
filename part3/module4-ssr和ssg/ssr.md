自己搭建vue的SSR，不使用已有的框架nuxtjs

需要先安装 vue-server-rebderer 这个包

    const fs = require('fs');
    const renderer = require('vue-server-renderer').createRenderer({
        // 该参数表示可以使用一个html模板
        // 不适用模板的情况下这个参数可以不传
        // 如果使用模板，则需要在html文件中加入  <!--vue-ssr-outlet-->  该行注释
        template: fs.readFileSync('./index.template.html', 'utf-8')
    });
    const app = new Vue({
        template: `
            <div id="app">
                <h1>{{ message }}</h1>
            </div>
                
        `,
        data: {
            message: '拉钩教育'
        }
    });

    // renderToString这个方法第二个参数可以是一个对象，表示要在模板中写入的数据
    // 也可以不传
    // renderer.renderToString(app, (err, html) => {
    //    console.log(html);
    // });
    renderer.renderToString(app, {
        title: '拉钩教育'
        meta: `
            <meta name="description" content="拉钩教育">
        `
    }, (err, html) => {
        console.log(html);
    });

    // 如果需要在模板中写入标签，需要使用三对大括号，这样vue就会不将数据中的标签进行转义输出
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {{{ meta }}}
    <title>{{ title }}</title>
</head>
<body>
    <!--vue-ssr-outlet-->
</body>
</html>



基本实现流程
    1.安装依赖
        生产依赖
            vue
            vue-server-renderer
            express
            cross-env

        开发依赖
            webpack
            webpack-cli
            webpack-merge
            webpack-node-externals  排除webpack的node模块
            rimraf  基于node的跨平台的的 rm -rf工具
            friendly-errors-webpack-plugin  友好的webpack的错误提示
            @babel/core
            @babel/plugin-transform-runtime 
            @babel/preset-env
            babel-loader
            vue-loader    处理.vue文件
            vue-template-compiler 同上
            file-loader 处理字体
            css-loader 处理css
            url-loader 处理图片
    
    2、目录结构
        可以查看文档，文档中为基础代码
        https://ssr.vuejs.org/zh/guide/structure.html#%E4%BD%BF%E7%94%A8-webpack-%E7%9A%84%E6%BA%90%E7%A0%81%E7%BB%93%E6%9E%84

    3、webpack配置，根目录下创建build文件，配置如当前目录中的build下的文件
        这里碰到一个问题就是webpack从4升到了5，我这里用的是最新的5，所以有一个问题没有解决，一直在报错
        [vue-server-renderer-webpack-plugin] webpack config output.libraryTarget should be "commonjs2".
        所以最后退回了4的版本，即使用了课程导师使用的版本

SSR渲染流程
    服务端渲染流程
    客户端接管激活

HTML中head内标签的管理，可以参考vue-ssr的官方文档使用
    推荐使用第三方包 vue-meta 来管理

### ！！！数据预取 官方推荐使用store，vue中存在一个生命周期专门是用来服务端渲染与取数据的，叫做 serverPrefetch
    所以我们需要现在单文件组件中添加 serverPrefetch 的钩子，他会在服务端渲染的时候自动调用

    发起 actions ，返回 promise

    entry-server.js 中添加 
        context.rendered = () => {
            // renderer渲染器会把 context.state 数据对象内联页面模板中
            // 最终发送给客户端的页面中包含一段脚本 window.__INITIAL_STATE__ = 【对应数据】
            // 在客户端把 window.__INITIAL_STATE__ 的数据拿出来填充到客户端的 store
            // 需要我们在客户端入口自行替换 即在 entry-client.js中 
            // if (window.__INITAIL_STATE__) {
            //     store.replaceState(window.__INITAIL_STATE__);
            // }
            context.state = store.state;
        }
    entry-client.js 中 添加
        if (window.__INITAIL_STATE__) {
            store.replaceState(window.__INITAIL_STATE__);
        }


### Vue3 服务端渲染 
	1. index.html 中 <div id="app"><!--app-html--></div> 根元素以及其中的注释的占位一定不要换行
		因为换行之后会出现服务端解析的虚拟dom是元素，而客户端即系的虚拟dom是 ‘’ 空字符串，这就出现了客户端和服务端虚拟dom不一致的问题，会渲染两份视图并展示


