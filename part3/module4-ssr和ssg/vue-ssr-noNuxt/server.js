const Vue = require('vue');
const fs = require('fs');
const { createBundleRenderer } = require('vue-server-renderer');

const express = require('express');
const server = express();
const setUpDevServer = require('./build/setup-dev-server'); 

const isProd = process.env.NODE_ENV === 'production'; 
let renderer;
let onReady;
if (isProd) {
    const serverBundle = require('./dist/vue-ssr-server-bundle.json');
    const template = fs.readFileSync('./index.template.html', 'utf-8');
    const clientManifest = require('./dist/vue-ssr-client-manifest.json');
    renderer = createBundleRenderer(serverBundle, {
        template,
        clientManifest
    });
} else {
    // 监听打包构建=》重新生成 renderer 渲染器
    onReady = setUpDevServer(server, (serverBundle, template, clientManifest) => {
        renderer = createBundleRenderer(serverBundle, {
            template,
            clientManifest
        });
    });
}

server.use('/dist', express.static('./dist'));

const render = async (req, res) => {
    try {
        const html = await renderer.renderToString({
            title: '拉钩教育',
            meta: `
                <meta name="description" content="拉钩教育">
            `,
            // 这里是为了处理entry-server.j s中传入的context参数，那个参数实际就是这里renderToString传入的第一个参数
            url: req.url
        });
        res.setHeader('Content-Type', 'text/html; charset=utf8');
        res.end(html);
    } catch (error) {
        res.status(500).end(error);
    }
};

// 服务端路由设置为*，所有的路由都会往这里走
server.get('*', isProd ? render : async (req, res) => {
    await onReady;
    render(req, res);
});

server.listen(3000, () => {
    console.log('server running at port 3000');
})