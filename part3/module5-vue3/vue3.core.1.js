import { track, trigger } from "../../Part3.模块五.作业";

const isObj = val => Object.prototype.toString.call(val) === '[object Object]';
const convert = target => isObj(target) ? reactive(target) : target;
const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);

export function reactive(target) {
    if (!isObj(target)) return;

    const hanfler = {
        get(target, key, receiver) {
            track(target, key);
            const result = Reflect.get(target, key, receiver);
            return convert(target)
        },
        set(target, key, value, receiver) {
            const oldVal = Reflect.get(target, key, receiver);
            let result = true;
            if (oldVal !== value) {
                trigger(target, key);
                result = Reflect.set(target, key, value, receiver);
            }  
            return result;
        },
        deleteProperty(target, key) {
            const has = hasOwn(target, key);
            const result = Reflect.deleteProperty(target, key);
            if (has && result) {
                trigger(target, key);
            }
            return result;
        }
    }

    return new Proxy(target, handler); 
}

let activeEffectCallback = null;
export function effect(callback) {
    activeEffectCallback = callback;
    callback();
    activeEffectCallback = null;
}

const targetMap = new WeakMap();
export function track(target, key) {
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
    let r = {
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

export function toRefs(proxy) {
    const ret = proxy instanceof Array ? new Array(proxy.length) : {};
    for (const key in proxy) {
        ret[key] = toProxyRef(proxy, key);
    }
    return ret;
}

function toProxyRef(proxy, key) {
    let r = {
        __v_isRef: true,
        get value() {
            return proxy[key]
        },
        set value(newVal) {
            proxy[key] = newVal;
        }
    }
    return r;
}

export function computed(getter) {
    const result = ref();

    effect(() => {
        result.value = getter();
        return result.value;
    });

    return result;
}