### 不使用其他框架的情况下对react进行 ssr 改造

  - 这里比较简单，只需要简单配置即可
    1. 这里运行的时候可能会出现一个问题就是 需要在任何使用 jsx 语法的地方引入 react，不然就会报错
  
  - 需要对元素进行二次渲染来添加事件，因为renderToString 只是将 jsx 转为 html 字符串并不附加任何js代码，所以我们添加的时间是无法被添加到元素上的，所以需要我们重新对组件跑一遍 react 添加事件
    1. 使用 ReactDOM.hydrate 方法重新渲染组件
      - 为啥不用 react 的 render 方法
        1. 因为 render 方法不会复用已有的dom元素，但是 ReactDOM.hydrate 会复用
    
  - 当我们这样直接打包服务端代码的时候会出现一个问题就是，会把第三方包全部给打到一起，所以就需要 webpack-node-externals 这个包来解决这个问题
    代码入下
      module.exports = merge(config, {
        target: 'node',
        entry: './src/server/index.js',
        output: {
          path: path.join(__dirname, 'build'),
          filename: 'bundle.js'
        },
        externals: [
          nodeExternals()
        ],
      })

  - 当服务端渲染完成之后，在客户端需要给 store 添加初始数据，不然 ReactDOM.hydrate 会报出警告，因为服务端渲染的是带有数据的，即比客户端多选了带有数据的 dom ，此时客户端渲染的和服务端渲染的dom不一致，就会报出警告，所以需要对客户端store添加初始数据
    1. 解决方式和 vue 类似，在 window 对象上添加全局变量，在客户端创建 store 的 createStore 方法的第二个参数中传入即可