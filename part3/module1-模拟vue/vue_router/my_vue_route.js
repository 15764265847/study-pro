let _Vue = null

export default class MyRouter {
  static install (Vue) {
    // 判断当前插件是否已被安装
    if (MyRouter.install.installed) {
      return
    }
    MyRouter.install.installed = true
    // 将Vue的构造函数注册到全局变量
    _Vue = Vue
    // 在创建Vue实例的时候我们传入了router对象，我们需要把这个对象挂载到所有的Vue实例上
    // 使用mixin的方式，即混入
    _Vue.mixin({
      beforeCreate () {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    // 记录实例化时传入的路由配置
    this.options = options
    // 记录路由路径与组件的对应 key路由地址，即路径 value路由对应的组件
    this.routerMap = {}
    // data是一个响应式的对象，其中记录了我们当前的路由地址，默认是跟路由，即‘/’
    // 这里使用Vue的observable方法将对象设置为一个响应式的对象
    this.data = _Vue.observable({
      // current属性记录当前路由
      current: '/'
    })
  }

  init () {
    this.createRouterMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  // 用来初始化routerMap对象，以路由路径为key，以组件为value
  createRouterMap () {
    const { routes } = this.options
    routes.forEach(route => {
      const { path, component } = route
      this.routerMap[path] = component
    })
  }

  // 生成router-link组件
  initComponents (Vue) {
    Vue.component('router-link', {
      props: {
        to: [String, Object]
      },
      // 因为这里使用的是运行时版本的vue而不是完整版的vue，运行时的vue是不带编译器的
      // 所以无法使用template
      // template: '<a :href="to"><slot></slot></a>'
      render (h) {
        // 第一个参数直接写标签就行
        // 第二个参数attr设置标签属性
        // 第三个参数设置元素的子元素，是个数组，
        // 这里我们需要传入默认的slot组件
        return h('a', {
          attr: {
            href: this.to
          },
          // 添加事件阻止a标签的默认事件
          on: {
            click: this.handleClick
          }
        }, [this.$slots.default])
      },
      methods: {
        handleClick (e) {
          history.pushState(null, '', this.to)
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
    })

    const self = this
    Vue.component('router-view', {
      render (h) {
        const { current } = self.data
        const component = self.routerMap[current]
        // h函数可以直接将一个组件转成虚拟DOM进行渲染
        // 这里我们需要拿到路由对应的组件然后使用h函数渲染
        return h(component)
      }
    })
  }

  // 添加popstate事件
  initEvent () {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}
