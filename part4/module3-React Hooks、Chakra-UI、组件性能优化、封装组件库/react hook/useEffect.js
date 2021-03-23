import ReactDom from 'react-dom'


// 还有一步就是 在 render 的时候 将 effectIndex 重置为0
function render () {
  effectIndex = 0
  ReactDom.render(<App />, document.getElementById('root'))
}
