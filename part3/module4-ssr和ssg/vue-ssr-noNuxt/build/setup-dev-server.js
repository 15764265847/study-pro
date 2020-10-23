const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const devMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const hotMiddleware = require('webpack-hot-middleware');

module.exports = (server, callback) => {
    let ready;
    const onReady = new Promise((resolve) => {
        ready = resolve;
    });
    // 监听构建 =》更新renderer
    let template;
    let serverBundle;
    let clientManifest;
    
    const update = () => {
        if (template && serverBundle && clientManifest) {
            ready();
            callback(serverBundle, template, clientManifest);
        }
    }

    // 监听构建 template 调用 update 更新 renderer 渲染器
    const tempplatePath = path.resolve(__dirname, '../index.template.html');
    template = fs.readFileSync(tempplatePath, 'utf-8');
    // 这里需要间厅文件 使用 fs.watch  fs.watchFile
    // 但是这两个原生方法都不太好用，所以这里使用第三方包  chokidar ，他是封装了原生方法并作了一些其他处理 
    update();
    chokidar.watch(tempplatePath).on('change', () => {
        template = fs.readFileSync(tempplatePath, 'utf-8');
        update()
    });

    // 监听构建 serverBundle 调用 update 更新 renderer 渲染器
    const serverConfig = require('./webpack.server.config.js');
    const serverCompiler = webpack(serverConfig);
    const serverDevMiddleware = devMiddleware(serverCompiler, {
        logLevel: 'silent' // 关闭日志输出 由 FriendlyErrorsWebpackPlugin 统一管理输出
    });
    // 这里实际相当于注册了一个webpack插件，这个插件在编译完成后执行
    serverCompiler.hooks.done.tap('server', () => {
        // 因为 devMiddleware 内部默认使用的是 memfs 第三方模块来读取文件到内存中
        // 所以这里我们使用了 serverDevMiddleware.fileSystem 
        // serverDevMiddleware.fileSystem 保存了 memfs 模块导出的对象
        serverBundle = JSON.parse(
            serverDevMiddleware.fileSystem.readFileSync(path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'))
        );
        update();
    });

    // 监听构建 clientManifest 调用 update 更新 renderer 渲染器
    const clientConfig = require('./webpack.client.config');
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    clientConfig.entry.app = [
        // 这里问号后面的参数表示干掉热更新的日志
        // 以及在热更新卡住的时候进行刷新页面
        'webpack-hot-middleware/client?quiet=true&reload=true', // 和服务端交互处理热更新的一个客户端脚本
        clientConfig.entry.app
    ];
    // 热更新模式下确保名字一样，如果不一样，hot-middleware会报错
    clientConfig.output.filename = '[name].js';
    const clientCompiler = webpack(clientConfig);
    const clientDevMiddleware = devMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        logLevel: 'silent' // 关闭日志输出 由 FriendlyErrorsWebpackPlugin 统一管理输出
    });
    // 这里实际相当于注册了一个webpack插件，这个插件在编译完成后执行
    clientCompiler.hooks.done.tap('client', () => {
        // 因为 devMiddleware 内部默认使用的是 memfs 第三方模块来读取文件到内存中
        // 所以这里我们使用了 clientDevMiddleware.fileSystem 
        // clientDevMiddleware.fileSystem 保存了 memfs 模块导出的对象
        clientManifest = JSON.parse(
            clientDevMiddleware.fileSystem.readFileSync(path.resolve(__dirname, '../dist/vue-ssr-client-manifest.json'))
        );
        update();
    });

    // 挂载热更新
    server.use(hotMiddleware(clientCompiler, {
        log: false
    }))

    // 重要！！！由于这里是将文件读取到了内存中，express.static无法访问，所以需要挂载到 express 中
    // devMiddleware 内部提供了对内存数据的访问
    server.use(clientDevMiddleware);

    
    return onReady;
}