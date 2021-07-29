const { forEach } = require("lodash")

const jsx = (
  <div id="a1">
    <div id="b1">
      <div id="c1"></div>
      <div id="c1"></div>
    </div>
    <div id="b2"></div>
  </div>
)

const container = document.querySelector('#root')

// 构建根元素的Fiber对象
const workInProgressRoot = {
  stateNode: container,
  props: {
    children: [jsx]
  }
}

// 下一个要执行的任务,默认是根节点的Fiber对象
let nextUnitOfWork = workInProgressRoot

// deadline 该参数是 requestIdleCallback 传给传入的方法的参数
function workLoop (deadline) {
  // 是否有空闲时间
  // 是否有要执行的任务
  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  // 判断当前还有没有任务，如果没有则说明所有的任务都完成了，然后进入第二阶段，执行DOM操作
  if (!nextUnitOfWork) {
    commitRoot()
  }
}

function performUnitOfWork (workInProgressFiber) {
  // 1. 创建DOM对象，并将它存储到stateNode属性中
  // 2. 构建当前Fiber对象的子级Fiber对象
  beginWork(workInProgressFiber)
  // 如果当前Fiber有子级
  if (workInProgressFiber.child) {
    // 那么返回子级，构建子级的子级
    return workInProgressFiber.child
    // 如果当前Fiber有同级
  }
  while (workInProgressFiber) {
    // 构建链表
    complateUnitOfWork(workInProgressFiber)
    // 如果有同级，返回同级，构建同级的子级
    if (workInProgressFiber.sibling) {
      return workInProgressFiber.sibling
    }
    // 如果没有同级 workInProgressFiber 重新赋值为其父级，看父级有没有同级，如果有，构建父级的同级的子级
    workInProgressFiber = workInProgressFiber.return
  }
}

function complateUnitOfWork (workInProgressFiber) {
  // 获取当前Fiber对象的父级
  const returnFiber = workInProgressFiber.return
  if (returnFiber) {
    // Fiber对象中如果存在effectTag属性，则说明需要进行DOM操作
    if (workInProgressFiber.effectTag) {
      if (!returnFiber.lastEffect) {
        returnFiber.lastEffect = workInProgressFiber.lastEffect
      }
      if (!returnFiber.firstEffect) {
        returnFiber.firstEffect = workInProgressFiber.firstEffect
      }
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workInProgressFiber
      } else {
        returnFiber.firstEffect = workInProgressFiber
      }
      returnFiber.lastEffect = workInProgressFiber
    }
  }
}

function beginWork (workInProgressFiber) {
  // 1. 创建DOM对象，并将它存储到stateNode属性中
  if (!workInProgressFiber.stateNode) {
    // 创建DOM，Fiber对象中 的type 属性会存储元素类型，即 他是个div还是个span还是是个react组件
    workInProgressFiber.stateNode = document.createElement(
      workInProgressFiber.type
    )
    // 为DOM添加属性，使用Fiber对象的 props 属性，该属性存储了DOM元素的属性
    for (const attr in workInProgressFiber.props) {
      if (attr !== 'children') {
        workInProgressFiber.stateNode[attr] = workInProgressFiber.props[attr]
      }
    }
  }
  // 2. 构建当前Fiber对象的子级Fiber对象
  if (Array.isArray(workInProgressFiber.props.children)) {
    let previousFiber = null
    workInProgressFiber.props.children.forEach((child, i) => {
      const childFiber = {
        type: child.type,
        props: child.props,
        // 表示当前Fiber要执行DOM操作，当前是渲染操作，要追加到HTML文档中
        effectTag: 'PLACEMENT',
        return: workInProgressFiber
      }
      if (i === 0) {
        workInProgressFiber.child = childFiber
      } else {
        previousFiber.sibling = childFiber
      }
      previousFiber = childFiber
    })
  }
}

function commitRoot () {
  let curretnFiber = workInProgressRoot.firstEffect
  while (curretnFiber) {
    curretnFiber.return.stateNode.appendChild(curretnFiber.stateNode)
    curretnFiber = curretnFiber.nextEffect
  }
}

// 浏览器控件事件执行任务
requestIdleCallback(workLoop)
