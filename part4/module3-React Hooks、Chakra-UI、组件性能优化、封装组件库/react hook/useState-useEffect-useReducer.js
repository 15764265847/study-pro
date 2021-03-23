import ReactDom from 'react-dom'

const value = []
const setValue = []
let index = 0

function getSetValue (index) {
  return function setValue (newValue) {
    value[index] = newValue
    render()
  }
}

function render () {
  index = 0
  effectIndex = 0
  ReactDom.render(<App />, document.getElementById('root'))
}

export const useState = function (initValue) {
  const setValueFunc = getSetValue(index)
  setValue.push(setValueFunc)
  const valueRet = value[index]
  index++
  return [
    valueRet,
    setValueFunc
  ]
}

const prevDeps = []
let effectIndex = 0

export const useEffect = function (callback, depsArr) {
  if (Object.prototype.toString.call(callback) !== '[object Function]') {
    throw new Error('第一个参数必须是函数')
  }
  if (!depsArr) {
    callback()
  } else {
    if (Object.prototype.toString.call(depsArr) !== '[object Array]') {
      throw new Error('第二个参数必须是数组')
    }
    if (JSON.stringify(prevDeps) !== JSON.stringify(depsArr)) {
      callback()
      prevDeps[effectIndex] = JSON.parse(JSON.stringify(depsArr))
    }
    effectIndex++
  }
}

export const useReducer = function (reducer, value) {
  const [state, setState] = useState(value)
  function dispatch(action) {
    const newState = reducer(state, action)
    setState(newState)
  }
  return [state, dispatch]
}
