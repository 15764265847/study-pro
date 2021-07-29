## fiber算法出现的目的 
  1. 减少性能消耗，避免深层dom嵌套的情况下重新渲染带来的卡顿，提升流畅度

## fiber出现前react存在的问题
  1. 虚拟dom比对使用递归操作，递归操作不可被打断，会长时间占用js主线程

## fiber如何解决性能问题
  1. 使用循环代替递归，循环可中断
  2. 使用 requestIdleCallback 执行函数 该API中传入的函数会在浏览器的空闲时间调用
  - PS：这样一旦中间有任务 循环便可中断，然后在空闲的时候继续进行循环

## fiber对象即核心属性
  - type Fiber {
      type: any 组件类型 dev、span、组件构造函数
      stateNode: any 存储当前Fiber对象对应的DOM对象 
      return : Fiber | null 指向自己的父级Fiber对象
      child: Fiber | null 指向自己的子级Fiber对象
      sibling: Fiber | null 指向自己的兄弟Fiber对象
      nextEffect: Fiber | null 指向下一个要执行Fiber对象
    }

## Fiber 的工作方式
  1. render阶段 
    - 构建Fiber对象 构建链表 在链表中标记要执行的DOM操作，可中断
  2. commit阶段 根据构建好的链表进行DOM操作，不可中断

## Fiber构建
  1. Fiber是从整个项目的根节点开始构建，即我们 React.render 中传入的根节点，一般来说是 id 为 root 的DOM节点
