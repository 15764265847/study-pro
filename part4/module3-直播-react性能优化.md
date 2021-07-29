# React 性能优化
  - 核心就是减少渲染真实DOM的频率，减少虚拟DOM比对的频率

  ## 组件卸载钱进行卸载操作
    - 组件内注册的全局事件和定时器，及的组件卸载前清理掉，useEffect中的回调函数的返回的函数会在组件卸载的时候自动执行
      useEffect(() => {
        let timer = setInterval(() => {
          console.log('111111111111')
        }. 1000)
        return () => clearInterval(timer)
      }, [])

  ## PureComponent 纯组件
    1. 更新数据时，会对输入的数据进行浅层比较，如果数据相同，则组件不会更新
    2. 浅层比较
      - 引用类型的地址，基本数据类型的值
    3. 类组件继承 PureComponent ，函数组件使用 memo
    4. 单纯的数据的对比 比 diff算法遍历整个DOM的比对性能消耗要小很多
  
  ## shouldComponentUpdate
    - 纯组件只会进行浅比较，类组件中可以使用该方法编写自己的比较逻辑，进行更深层的比较
  
  ## React.memo 
    - 将函数组件变成纯组件，将当前props和上一次的props进行浅比较，如果相同就不重新渲染组件

    - const memoCom = React.memo(某组件) 使用该方法包裹组件就可以得到纯组件
      1. 第二个参数是 比较函数
        - 比较函数的第一个参数是当前的props，第二个参数是即将更新的props，该函数返回boolean，为true时不进行重新渲染，false时重新渲染
        const memoCom = React.memo(某组件, (previous, current) => {
          if (previous.xxx === current.xxx) {
            return true
          }
          return false
        })
  
  ## 组件懒加载
    - 示例,要求必须使用 Suspense 组件包裹 Route 组件
      import { lazy, Suspense } from 'react
      const Home = lazy(() => import (/* webpackChunkName: "Home"*/'Home'))
      
      <Suspense fallback={<div>loading</div>}>
        <Route path="/" component={Home} exact>
      </Suspense>
    
    - Suspense 组件的 fallback 参数表示加载时的状态，即可以传入一个 loading组件，在路由加载时会自动使用

## 使用 Fragment 避免额外标记
  - react 每个组件必须拥有一个根元素，不允许返回多个元素，Fragment作为一个根元素的占位符
  - 使用 <Fragment></Fragment> 或者 <></> 都可

## 不要使用内联函数定义，即不要在元素上直接绑定匿名函数  <input onChange={() => {}} />
  - 因为每当数据有修改的时候，组件就会渲染，元素的内联函数会被重新创建并对元素进行重新绑定，因为前一次的函数和当前的函数引用地址不同，所以每次都重新常见函数，旧的函数会被销毁，这样会增加性能开销

## 类组件的this的指向问题
  - 这里没啥实际内容，在使用类组件的时候需要在 class 的 constructor 中对类组件的普通函数进行this更正，不然this会一直undefined
  - 绑定后的this即指向当前组件实例
  class App extends Component {
    constructor () {
      super()
      this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
      console.log(this)
    }
    render() {
      return <button onClick={this.handleClick}></button>
    }
  }

## 类组件中的箭头函数
  - 当使用箭头函数定义 class 的函数时，他会作为一个实例属性，而不是原型属性，即每次当组件被重用时，每个组件实例上都会有一个该箭头函数，原型链上不会生成该函数
    class App extends Component {
      handleClick = () => {}
      constructor () {
        super()
      }
    }
  
## 避免使用内联样式
  - 因为jsx 中 的 style 会被解析为 js 代码，然后再重新映射成对应的样式规则加到元素上面，这样会花费更多的时间来执行脚本和渲染
  - 能使用 css 直接做到的事情不要使用js来做，因为js操作DOM比较消耗性能，比较慢
  - 使用 className 或者直接将 css 文件import 进组件

## 优化条件渲染
  - 频繁的挂载和卸载组件是一件消耗性能的事情，为了减少性能消耗，所以需要减少组件的挂载卸载
  
## 避免重复无限渲染
  render应该是一个纯函数，不要在其中使用类似 setState 这样的修改状态的方法或者以其他的手段修改原生DOM，以及其他更改应用程序的任何操作。这样可以保证组件的行为和渲染方式一致

## 为组件创建错误的边界
  1. 创建一个类组件，里面使用特定的函数，来捕获其子组件的错误，并展示创建的错误页面
  2. 当发生错误的时候会调用两个生命周期 componentDidCatch 和 getDerivedStateFromError
    - componentDidCatch 用来记录错误的
    - getDerivedStateFromError 是静态方法 当子组件放生错误的时候，会把返回的值合并到state中
      class ErrorBoundaries extend Component {
        constructor () {
          super()
          this.state = {
            hasError: false
          }
        }
        componentDidCatch(error) {
          console.log(error)
        }
        static getDerivedStateFromError () {
          return {
            hasError: true
          }
        }
        render() {
          if (this.state.hasError) {
            return <div>发生错误了</div>
          }
          return (
            <div></div>
          )
        }
      }

## 避免数据结构突变

## 为列表数据添加唯一标识，即遍历加 key

## 依赖优化
  1. 使用 react-app-rewired + customize-cra 创建
    - react-app-rewired 允许我们覆盖 create-react-app 创建的项目的默认配置
    - customize-cra 导出一些方法方便我们修改配置
 
## 高阶组件 简称 HOC   Higner Order Component
  - 高阶函数由一个函数返回，函数接收组件作为参数，返回一个新的组件，参数组件即是复用逻辑的组件
  - 抽取公共逻辑，复用组件
  - 类似高阶函数
  - 类组件中使用较多

## 渲染属性
  - 同高阶组件，用来共享部分逻辑
  - 类组件中使用较多

## Portal
  - 将元素或者组件渲染到其他元素当中
  - 代码示例，主要是 ReactDOM.createPortal 方法
    ReactDOM.createPortal(
      <div>protal demo</div>,
      document.getElementById('portal-root')
    )
  - 使用： 直接在组件中使用即可，会自动渲染到对应的元素当中


