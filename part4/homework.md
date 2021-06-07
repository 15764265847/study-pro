## 通过该项目，请简要说明 typescript 比 javascript 的优势在哪？
  1. 静态检查
  2. 类型注释

## 请简述一下支付流程
  1. 调用后端提供的接口，后端会调用阿里支付的API，具体参数不知道，但是必有一个 重定向url，来保证支付成功后跳转的地址
  2. 该地址由前端和后端商量着来
  3. 前端提前实现好这个重定向地址的页面即可

## react-redux 的主要作用是什么，常用的 api 有哪些，什么作用？
  在当前实战项目中使用到了
  1. useDispatch
  2. useSelector
  3. Provider 组件

## redux 中的异步如何处理？
  使用redux-saga