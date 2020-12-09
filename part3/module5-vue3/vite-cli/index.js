#!/usr/bin/env node

const path = require('path');
const Koa = require('koa');
const send = require('koa-send');
const compilerSFC = require('@vue/compiler-sfc');
const { Readable } = require('stream');

const app = new Koa();

const streamToString = stream => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    stream.on('error', reject);
});

const stringToStream = string => {
    const stream = new Readable();
    stream.push(string);
    // 这里 push 一个 null 告诉当前的流已经读取完了
    stream.push(null);
    return stream;
}

// 3、加载第三方模块
// 这里由于在第二步中修改了返回的文件内容的第三方包导入的路径
// 所以在浏览器接收到文件内容时，会对新的路径进行请求，然而新的路径也是不存在的
// 所以需要在处理一遍，将请求路径修改为 node_modules 下的模块的 package.json 中配置的 module 选项，这个选项就是第三方包的入口文件
// 当我们修改完请求路径之后，再将请求交给第一步中的静态文件中间件处理，返回对应的文件内容
app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/@modules/')) {
        const moduleName = ctx.path.substr(10);
        const pkgPath = path.join(process.cwd(), 'node_modules', moduleName, 'package.json');
        const pkg = require(pkgPath);
        ctx.path = path.join('/node_modules', moduleName, pkg.module);
    }
    await next();
});

// 1、开启静态文件服务器
app.use(async (ctx, next) => {
    await send(ctx, ctx.path, { root: process.cwd(), index: 'index.html' });
    await next();
});

// 4、处理单文件组件
app.use(async (ctx, next) => {
    if (ctx.path.endsWith('.vue')) {
        const contents = streamToString(ctx.body);
        // 这里需要使用 vue 的 @vue/compiler-sfc 来解析单文件组件
        const { descriptor } = compilerSFC(contents);
        let code;
        // 这里vite会将单文件组件处理成以下形式，以App.vue为例
        // import HelloWorld from 'HelloWorld.vue';    
        // const __script = {
        //     name: 'App',
        //     components: {
        //         HelloWorld
        //     }
        // }
        // import { render as __render } from '/src/App.vue?type=template'
        // __script.render = __render
        // __script.__hmrId = '/src/App.vue'
        // __script.__file = '此处是App.vue在文件系统中的绝对路径'
        // export default __script
        // 然后进行二次请求 '/src/App.vue?type=template'，请求编译好的模板，所以这里要按照有没有传type参数进行分别处理

        if (!ctx.query.type) {
            // 处理第一次请求单文件组件
            // 使用 @vue/compiler-sfc 处理后的内通过 descriptor.script.content 来获取
            // 以App.vue为例，内容如下
            // import HelloWorld from 'HelloWorld.vue'; 

            // export default {
            //     name: 'App',
            //     components: {
            //         HelloWorld
            //     }
            // }
            code = descriptor.script.content;
            code = code.replace(/export\s+default\s+/g, 'const __script = ');
            // __script.__hmrId = '/src/App.vue'
            // __script.__file = '此处是App.vue在文件系统中的绝对路径'
            // 这两个属性我们在这里并不实现，所以不加
            code += `
                import { render as __render } from '/src/App.vue?type=template'
                __script.render = __render
                export default __script
            `;
            ctx.type = 'application/javascript';
            // 这里要将字符串处理成流的形式，因为后续中间件中读取的是流
            ctx.body = stringToStream(code);
        } else if (ctx.query.type === 'template') {
            // @vue/compiler-sfc 中提供了 compileTemplate 方法来将模板编译成 render 函数
            const templateRender = compilerSFC.compileTemplate({
                // 要编译的模板， 通过 descriptor.template.content 获取
                source: descriptor.template.content
            });
            // templateRender.code 就是我们编译好的render函数的代码
            code = templateRender.code;
        }
    }
    await next();
})

// 2、修改第三方模块的中间件
// 因为浏览器不识别在构建工具中使用的导入第三方包的形式
// 即浏览器不支持 import Vue from 'vue' 这种形式导入第三方包
// 所以我们需要对依赖进行处理
// vite 当中是先把 import Vue from 'vue' 处理成 import Vue from '/@modules/vue'
// 然后在对 import Vue from '/@modules/vue' 的请求在进行处理
app.use(async (ctx, next) => {
    if (ctx.type === 'application/javascript') {
        const contents = await streamToString(ctx.body);
        // 这里正则表达式的意思是匹配 from ' 或者 from " ，对 from './ 、 from '/ 、 from "./ 、 from "/ 跳过不处理
        // 即跳过非第三方包的导入，只处理第三方包的导入方式
        ctx.body = contents
            .replace(/(from\s+['"](?![\.\\]))/g, '$1/@modules/')
            // 这里处理是因为返回的代码中包含给打包工具使用的 process.env.NODE_ENV ，这条语句在浏览器中并不识别，所以要处理一下
            .replace(/process\.env\.NODE_ENV/g, '"development"')
    }
})

app.listen(3000);
console.log('服务器已开启')