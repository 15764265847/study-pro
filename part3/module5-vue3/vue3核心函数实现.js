// 判断变量类型
const isObj = val => Object.prototype.toString.call(val) === '[object Object]'
// 判断变量是否是对象，如果是对象，调用reactive转换成代理对象，不是则直接返回
const convert = target => isObj() ? reactive(target) : target
// 判断tagret是否具有传入的key
const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (target, key) => hasOwnProperty.call(target, key)

// 将对象转换为响应式对象
export function reactive (target) {
  if (!isObj(target)) return target

  const handler = {
    get (target, key, receiver) {
      // 收集依赖
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      // console.log('get', key);
      return convert(result)
    },
    set (target, key, value, receiver) {
      const oldVal = Reflect.get(target, key, receiver)
      let result = true
      if (oldVal !== value) {
        // 触发更新
        trigger(target, key)
        result = Reflect.set(target, key, value, receiver)
        console.log('set', key, value)
      }
      return result
    },
    deleteProperty (target, key) {
      const has = hasOwn(target, key)
      const result = Reflect.deleteProperty(target, key)
      if (has && result) {
        // 触发更新
        trigger(target, key)
      }
      return result
    }
  }

  return new Proxy(target, handler)
}

// 收集依赖
let activeEffectCallback = null
export function effect (callback) {
  activeEffectCallback = callback
  callback()
  activeEffectCallback = null
}

// targetMap 以target对象为key，value是对应的 depsMap
// depsMap是以对象属性的 key 为键，value是一个类型为 Set 的 dep
// dep 的value是对应的更新函数
const targetMap = new WeakMap()
export function track (target, key) {
  if (!activeEffectCallback) return

  // 从 targetMap 中取出 target 对应的 depsMap
  // 如果没有则创建
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  // 从 depsMap 中取出 key 对应的 dep
  // 如果没有则创建一个
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  // 在 key 对应的 dep 中添加当前的活动函数，也就是更新函数
  dep.add(activeEffectCallback)
}

// 触发更新
export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  if (!dep) return
  dep.forEach(effect => {
    effect()
  })
}

export function ref (val) {
  // 判断val是否是ref函数创建的对象，如果是直接返回
  if (isObj(val) && val.__v_isRef) return val

  let value = convert(val)

  const r = {
    __v_isRef: true,
    get value () {
      track(r, 'value')
      return value
    },
    set value (newVal) {
      if (newVal !== value) {
        val = newVal
        value = convert(val)
        trigger(r, 'value')
      }
    }
  }

  return r
}

export function toRefs (proxy) {
  // 这里要先判断 proxy 是否是 reactive 函数转换后的代理对象
  // 但我们现在并没有在 reactive 函数中添加对应的标识，所以先跳过这一步

  // 判断是是否是数组，因为 toRefs 不能改变原代理对象，所以这里要重新返回一个
  // 数组和对象要进行不同的赋值
  const ret = proxy instanceof Array ? new Array(proxy.length) : {}

  for (const key in proxy) {
    ret[key] = toProxyRef(proxy, key)
  }
  return ret
}

function toProxyRef (proxy, key) {
  const r = {
    __v_isRef: true,
    get value () {
      // 注意这里不需要添加依赖，因为 proxy 已经是一个响应式对象了
      return proxy[key]
    },
    set value (newVal) {
      proxy[key] = newVal
    }
  }
  return r
}

export function computed (getter) {
  const result = ref()

  effect(() => {
    result.value = getter()
    return result.value
  })

  return result
}
