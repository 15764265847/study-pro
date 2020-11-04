// 一、Vue3.0性能提升主要是通过哪几个方面
//    1、响应式系统的优化
//        这里使用了 proxy 来替代 Object.defineProperty 
//            1、可以不再对数组做针对性处理，数组的索引以及length也可监听的到
//            2、可以监听得到删除属性以及动态添加的属性
//    2、编译优化
//        1、优化了diff算法对静态根节点处理，标记元素动态更新
//        2、按需引入
//        3、缓存事件函数
//    3、源码体积优化
//        1、tree-shaking
//        2、删除一些不常用的api
//        3、按需引入

import { track } from "./part3/module5-vue3/vue3核心函数实现";


// 二、composition api 和 options api 有啥区别
//     1、composition api 使用 monorepo 方式管理
//         1、可以按需引入
//         2、可以单独引入
//     2、composition api 函数组合，可以是单一功能的逻辑集中在一个函数内，从而使得功能组件的逻辑组合更灵活
//        而 options api 的功能逻辑会分散在 data methods 等当中   

// 三、Proxy 相对于 Object.defineProperty 有什么优点
//     1、可以监听到 Array 类型的变化从而不再对原生数组方法进行重写
//     2、可以监听到 Array 类型的索引的变化，以及 length 属性的变化
//     3、可以监听到属性的删除
//     4、可以监听到动态添加的属性

// 四、Vue3.0在编译方面做了那些优化
//     通过优化编译过程和重写虚拟dom提升了首次渲染和更新的性能
//     1、标记和提升静态根节点，只对比动态节点
//     2、使用fragements
//     3、标记节点的动态修改内容，在进行对比的时候，只对比动态内容的变化
//     4、对事件处理函数进行了缓存

// 五、Vue3.0 响应式系统的实现原理

const isObj = val => Object.prototype.toString.call(val) === '[object Object]';
const convert = target => isObj ? reactive(target) : target;
const hasOwn = (terget, key) => Object.prototype.hasOwnProperty.call(target, key);

const activeEffectCallback = null;

export function reactive(target) {
    if (!isObj) return target;
    const handler = {
        get(target, key, receiver) {
            track(target, key);
            const result = Reflect.get(target, key, receiver);
            return convert(result);
        },
        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            let result = true;
            if (oldValue !== value) {
                trigger(target, key);
                result = Reflect.set(target, key, value, receiver);
            }
            return result;
        },
        deleteProperty(target, key) {
            const has = hasOwn(target, key);
            const result = Reflect.deleteProperty(target, key)；
            if (has && result) {
                trigger(target, key);
            }
            return result;
        }
    }
    return new Proxy(target, handler);
}

export function effect(callback) {
    activeEffectCallback = callback;
    callback();
    activeEffectCallback = null;
}

const targetMap = new weakMap();
export function track(target, key) {
    if (!activeEffectCallback) return; 

    const depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    const dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    dep.add(activeEffectCallback);
}

export function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    const dep = depsMap.get(key);
    if (!dep) return;
    dep.forEach(cb => {
        cb();
    });
}

export function ref(raw) {
    if (isObj(raw) && raw.__v_isRef) return raw; 
    const value = convert(raw);
    const r = {
        __v_isRef: true,
        get value() {
            track(r, 'value');
            return value;
        },
        set value(newVal) {
            if (newVal !== value) {
                raw = newVal;
                value = convert(raw);
                trigger(r, 'value');
            }
        }
    }
    return r;
}

function toProxyRef(proxy, key) {
    const r = {
        get value() {
            return proxy[key];
        },
        set value(newVal) {
            proxy[key] = newVal;
        }
    }
    return r;
}

export function toRefs(proxy) {
    const ret = proxy instanceof Array ? new Array(proxy.length) : {};

    for (const key in proxy) {
        ret[key] = toProxyRef(proxy, key);
    }

    return ret;
}

export function computed(getter) {
    const result = ref();

    effect(() => {
        result.value = getter();
        return result.value;
    });

    return result;
}

