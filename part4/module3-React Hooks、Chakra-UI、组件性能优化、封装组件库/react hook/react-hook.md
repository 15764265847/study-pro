### react hook 
  1. 用来增强函数型组件，是函数型组件可以存储状态，可以处理副作用。是开发者在不使用类组件的情况下可以用函数组件实现相同的功能
  2. 类组件的不足
    - 缺少逻辑复用机制
      1. 为了实现逻辑服用，类组件需要在外层在包裹一层，增加了组件层级，，显得十分臃肿
      2. 增加了调试难度以及降低了执行效率
    - 复杂且难以维护
      1. 需要拆分不同的逻辑到生命周期中
      2. 同一个生命周期中存在大量不相干的业务逻辑
    - 类成员方法不能保证内部 this 指向的正确性
  
  3. 钩子函数
    - useState 保存状态
      1. 参数可以是函数，函数返回啥，初始状态就是啥，函数只调用一次，用于初始值是动态值的情况，即初始值是不确认的需要计算的
    - useEffect 让函数组件拥有处理副作用的能力
      1. 该钩子可以看作是 componentDidMount componentDidUpdate componentWillUnmount 三个生命周期的组合
        即 useEffect 会在 组件挂在之后 组件更新之后 组件即将卸载 的时候执行
      2. useEffect(() => {}) 在 componentDidMount 和 componentDidUpdate 的时候执行
      3. useEffect(() => {}, []) 在 componentDidMount 的时候执行一次
      4. useEffect(() => () => {}) 在 componentWillUnmount 的时候执行
        - 使用 ReactDom.unmountComponentAtNode(元素) 下载组件 ，卸载哪个元素下的组件
      5. useEffect 第二个参数传入变量的时候，useEffect会在对应变量发生变化的时候以及 componentDidMount 的时候执行
      6. useEffect 传入的函数第一个参数不能是一个 async 函数 ，因为 useEffect 传入的函数如果有返回值那就必须是一个普通函数 ，如果传入async函数的话那么这个函数的返回值就是 promise 了，这是不允许的
        - useEffect 的第一个参数 要么没有返回值 要么返回一个普通函数
        - 但是我们可以如下使用 
          useEffect(() => {
            (async () => {
              await aaa()
            })()
          }, [])
    - useMemo 类似于 Vue 中的 computed 计算属性
      1. 可以检测某个值得变化来计算新值
      2. 会缓存计算好的结果，即是组件重新渲染，只要监听值没有发生变化就不会重新计算，避免每次组件更新时的重新计算
      3. 使用如下，计算结果可以通过 useMemo 的返回值拿到
        const result = useMemo(() => {
          return count + 1
        }, [count])

    - memo 方法 ，缓存组件 ，在组件数据没有变化时不进行重新渲染组件
      1. 此处的Foo组件内部是死数据，没必要进行重新渲染
        import { memo } from 'react'
        const Foo = memo(function () {
          return (
            <div>
              这里是Foo
            </div>
          )
        })

    - useCallback 缓存函数，使组件重新渲染是获取到同一个函数
      1. 解释：当数据发生变化时，组件会重新渲染，同时函数组件内部创建的方法也会重新创建。即当重新渲染之后的组件内部创建的方法虽然和之前执行逻辑是一样的，但是已经不是同一个函数实例了，所以使用这个方法的子组件都会重新渲染，这个时候我们需要将这个方法实例缓存起来，在数据改变时保证拿到的是同一个函数实例，这样子组件就不会重新渲染了

    - useRef 获取DOM元素对象
      1. 
        const username = useRef()
        return (
          <input ref={username} />
        )
      2. 保存数据 跨组件周期 ，即是组件重新渲染 ，保存的数据仍然还在 ，保存的数据被更改不会触发组件的重新渲染
      3. 

    - 自定义 hook

  4. react 路由 hook ，用来获取对应的 对象的数据
    - useHistory 获取 history 对象
    - useLocation 获取 location 对象
    - useRouteMatch 获取 match 对象
    - useParams  获取路由参数