import { Store } from 'vuex';
// entry-server.js
import { createApp } from './app';

// 这是简化后的代码
export default async context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，
    // 就已经准备就绪。
    const { app, router, store } = createApp();

    // 设置服务器端 router 的位置
    router.push(context.url);

    // 等到 router 将可能的异步组件和钩子函数解析完
    await new Promise(router.onReady.bind(router));

    // 预取数据
    // 该方法会在服务端渲染的时候自动调用
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

    return app;
}

// 下面是官方文档提供的写法
// export default context => {
//   // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
//     // 以便服务器能够等待所有的内容在渲染前，
//     // 就已经准备就绪。
//   return new Promise((resolve, reject) => {
//     const { app, router } = createApp()

//     // 设置服务器端 router 的位置
//     router.push(context.url)

//     // 等到 router 将可能的异步组件和钩子函数解析完
//     router.onReady(() => {
       
//     }, reject)
//   })
// }