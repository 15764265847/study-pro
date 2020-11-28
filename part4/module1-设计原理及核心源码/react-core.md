### react 处理流程
	1、所有的react 组件最后都会被转译为 react.createElement 来创建虚拟dom
	2、react.createElement 做了哪些事情
		1、处理传入 props 属性，分类特殊的 props 属性，比如 key ref 等
		2、挂载子元素到 props.children
		3、判断是否有 defaultProps 属性，如果有就为 props 赋值
		4、为 key 和 ref 添加 getter，在开发环境下不能通过 props 获取 key 和 ref 属性
		5、返回创建的虚拟dom
	3、使用首屏动画来提高首屏渲染的用户体验
		这个时候我们需要把首屏动画的节点包裹在一个元素当中，因为首屏动画是不能reactElement同时显示的，这个时候react内部会清除container下的
		子元素然后再加载reactElement，如果节点很多遍历清除就会比较慢，但是只有一个元素就只用清除一次就可以了
### 1、react 16 版本的初始渲染流程
  1、编译后成为 React.createElement 生成对应的虚拟dom
  2、调用 render 函数
    传参：
      element ： ReactElement
      container ： 容器
      callback ： 渲染完成后执行的回调函数
    1、检测传入的 container 是否符合要求，可以是元素可以是domfragment可以是注释节点
    2、在开发环境下做一些操作
    3、最后 return legacyRenderSubtreeIntoContainer 的调用结果
    4、legacyRenderSubtreeIntoContainer 方法 用于初始化Fiber数据结构以及创建 FiberRoot 和 rootFiber 对象
      参数：
        parentComponent ： 首次渲染是null
        children ： 要渲染的 Reactelement
        container ： 渲染的容器
        forceHytrate ： 是否是服务端渲染
        callback ： 组件渲染完成要执行的回调
      1、获取 container._ReactRootContainer 用是否存在这个属性来判断是否是初次渲染，进行不同的操作，这个就是初次渲染，所以 _ReactRootContainer 没有这个值
      2、初次渲染 创建了 FiberRoot 和 rootFiber 对象
        1、调用 legacyCreateRootFromDOMContainer ，该发放用来判断是否是服务器端渲染，不是服务器端渲染就清空 container 中的元素
          原因是因为我们可能会使用动画来提高首屏渲染的体验，这个时候 container 可能会包含一些相关的元素
          这些相关元素是不能和 reactElement 同时显示的，这个时候react内部会使用 while 循环清除container下的子元素然后再加载reactElement，如果节点很多遍历清除就会比较慢，但是只有一个元素就只用清除一次就可以了
        2、在 legacyCreateRootFromDOMContainer 方法的最后会 return createLegacyRoot(container, ...)
        3、createLegacyRoot 方法内部会 return new ReactDOMBlockingRoot()
        4、 ReactDOMBlockingRoot 是用来给 container 添加 _ReactRootContainer 属性，该属性是一个对象，表现形式为
          { _internalRoot: {} }
          _internalRoot  属性最终由 createRootImpl 方法返回
        6、createRootImpl 该方法中返回了 createContainer 方法的调用结果
        7、createContainer 方法中返回 createFiberRoot 方法的调用结果
        8、createFiberRoot 中创建了 FiberRoot 和 rootFiber 
          1、并 FiberRoot.current = rootFiber 和 rootFiber.stateNode = FiberRoot 使之相互引用
          2、initializeUpdateQueue(FiberRoot)
          3、return FiberRoot
        9、initializeUpdateQueue
      3、对传入的 callback 做了 this 指向的修改 ，指向的是render的第一个参数，即在开发项目时，我们一般会传入的 <App /> 组件
      4、使用非批量更新的方式执行更新操作，调用 updateContainer 方法
        首次渲染是无法打断的
      5、updateContainer 核心就是创建任务对象，将任务对象放在任务队列中
        参数：
          element ： 要渲染的 ReactElement
          container ： FiberRoot 对象
          parentComponent ： 父组件 当前为null
          callback ： 渲染完成后执行的回调
        1、计算过期时间，同步任务过期时间是一个固定的数值
        2、调用 createUpdate 方法创建一个待执行任务
        3、调用 enqueueUpdate 方法将任务放到执行队列中
        4、调用 scheduleWork 进行调度更新
        5、返回过期时间
      6、最后 return getPublicRootInstance(fiberRoot) 返回 render 函数的第一个参数对应的真实dom
  3、任务执行前的准备工作
    调用 scheduleUpdateOnFiber 方法，核心就是判断任务是否是同步任务，是就调用同步任务入口 
    1、这里会检测任务是否是无限循环，是就报错
    2、判断任务是否是同步的，是就调用同步任务入口点 performSyncWorkOnRoot 方法
  4、调用 performSyncWorkOnRoot 方法说明进入了 render 阶段，这里会构建 workInProgress Fiber
    1、先构建 rootFiber
    2、然后构建每一个ReactElement 对应的fiber对象
    3、构建 workInProgress Fiber 使用 prepareFreshStack 方法
    4、prepareFreshStack 中会调用 createWorkInProgress 构建 workInProgress Fiber 树的 rootFiber
    5、调用 workLoopSync 方法构建其子元素的 Fiber 对象
    6、workLoopSync 内部会循环调用 performUnitOfWork 方法构建 fiber 对象
      子级对象可能有多个 所以要用循环
    7、performUnitOfWork 接受一个参数，此时该参数就是 rootFiber 对象
      模拟递归方式来构建所有的fiber对象
      1、beginWork 递阶段，从父到子构建fiber对象
        1、核心代码 switch 那段代码，用来判断 fiber.tag 属性是什么类型来分别获取其子级，因为 tag 不同，获取子级的方式也不同
        2、在开发项目时，我们一般会传入的 <App /> 组件，组件可能是函数组件，函数组件在第一次渲染的时候，tag属性是2，走的  Indeterninatecomponent 方法，后面在渲染则为 0 表示函数组件
        3、但是这里首先进来是 3 表示是 rootFiber 对象，调用 updateHostRoot 方法，获取子级，然后在判断子级的类型，这里是 <App /> 组件
        4、updateHostRoot 中调用 reconcileChildren 方法构建子元素的fiber对象
          1、reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime)
            current ： 表示旧fiber对象，在非初次渲染的时候使用，更新时新旧对比
            workInProgress ： 父级fiber对象
            nextChildren ： 子级的虚拟dom对象
            1、 reconcileChildren 判断是否是首次渲染，首次渲染的话会调用 mountChildrenFibers 来构建子元素对应的fiber对象，然后挂载到 workInProgress.child 属性上
            2、 mountChildrenFibers 方法是调用 ChildReconciler 方法调用后返回的函数
            3、 ChildReconciler 的参数是一个布尔值，表示否为fiber对象添加effectTag属性，true 表示添加，false 表示不添加
              传true返回的方法用于更新操作
              传false返回的方法用于初次渲染操作
              ChildReconciler 方法最终返回一个 reconcilerChildFiber 方法 最终调用 reconcilerChildFiber 来构建fiber对象
            4、 reconcilerChildFiber 方法中会判断 子级是对象还是数组，是对象表示只有一个子元素，是数组表示有多个子元素
              处理对象直接调用 createFiberFromElement 方法
              处理数组调用 reconcilerChildrenArray，会在父fiber下添加 child 属性，指向第一个子元素fiber，然后第一个子元素fiber会有sibling属性，指向第二个子元素属性，第二个子元素fiber有sibling指向第三个，以此类推
        5、返回子节点 fiber对象
      2、completeUnitOfWork 归阶段，从子到父构建fiber对象
        计算过程：先判断有没有子级，如果有子级，返回子级构建构建子级的fiber对象，如果没有，怎看有没有兄弟fiber，如果有兄弟fiber，怎构建的兄弟fiber的子级fiber，如果没有兄弟fiber，则返回其父级，看父级有没有兄弟fiber，如果有则构建兄弟fiber的子级，以此类推向上查找运算
        1、在创建fiber对象的过程中会创建每个fiber对象对应的真是dom元素，挂载到 fiber.stateNode 属性上并收集子级dom元素挂载到父级的child属性上
    8、创建完 fiber 对象，将上面创建好的 workInProgress Fiber 树挂载到 root.finishedWork 中，会调用 finishSyncRender 方法
    9、 finishSyncRender 中会销毁之前存储 workInProgress Fiber 树的变量，并调用 commitRoot 方法开始 commit 阶段
      1、commit阶段无法被打断，因为渲染页面，所以这里先修改任务优先级，及最高级别的任务优先级执行
  5、执行 commitRootImpl 方法，此时进入commit阶段，该方法核心为三个do while循环，也即是commit阶段，分为三个子阶段，每个阶段都是一个 do while 循环
    1、第一个子阶段 before mutation 阶段（执行dom操作前） ，实际上执行的方法为 commitBeforeMutationEffects 方法处理组件 getSnapshotBeforeUpdate 生命周期函数
      1、在 commitBeforeMutationEffects 中执行 getSnapshotBeforeUpdate 生命周期函数
    2、第二个子阶段 mutation 阶段（执行dom操作），执行的方法为 commitMutationEffects
      1、根据 effectTag 执行dom操作，更新删除插入等等操作
      2、因为我们这里是首次渲染所以是针对该节点及其子节点进行插入操作
    3、第三个子阶段 layout 阶段（执行dom操作后），执行的方法为 commitLayout Effects
      1、进入此阶段说明dom操作已经完成了，调用类组件生命周期函数和函数组件的 钩子函数
### 2. 为什么 React 16 版本中 render 阶段放弃了使用递归
  因为递归不可中断，这样的话就会导致如果页面组件数量比较胖大的情况下会一直占用主线程，导致页面出现卡顿的情况
  为了解决上述问题修改为 Fiber 算法，使用 requestIdleCallback Api 在浏览器空闲时间进行dom更新及渲染
### 3. 请简述 React 16 版本中 commit 阶段的三个子阶段分别做了什么事情
  1、第一个子阶段 before mutation 阶段（执行dom操作前） ，实际上执行的方法为 commitBeforeMutationEffects 方法处理组件 getSnapshotBeforeUpdate 生命周期函数
    1、在 commitBeforeMutationEffects 中执行 getSnapshotBeforeUpdate 生命周期函数
  2、第二个子阶段 mutation 阶段（执行dom操作），执行的方法为 commitMutationEffects
    1、根据 effectTag 执行dom操作，更新删除插入等等操作
    2、因为我们这里是首次渲染所以是针对该节点及其子节点进行插入操作
  3、第三个子阶段 layout 阶段（执行dom操作后），执行的方法为 commitLayout Effects
    1、进入此阶段说明dom操作已经完成了，调用类组件生命周期函数和函数组件的 钩子函数
### 4. 请简述 workInProgress Fiber 树存在的意义是什么
  双缓存技术，react中会最多存在两颗Fiber树， currentFiber 树是当前已经渲染在页面内的Fiber树，当我们更新时，会重新创建一个Fiber树，这个
  Fiber树叫做 workInProgress Fiber 树，这棵树构建完成之后会直接替换 currentFiber ，已达到Dom快速更新的目的，因为 workInProgress Fiber树是在缓存中创建的，速度非常快