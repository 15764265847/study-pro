// 基础版订阅发布模式

const { set } = require("grunt");

// const { default: MyRouter } = require("../vue_router/my_vue_route");

// class EventEmitter {
//     constructor() {
//         this.eventList = {};
//     }
//     $on(event, callback) {
//         this.eventList[event] = this.eventList[event] || [];
//         this.eventList[event].push(callback);
//     }
//     $emit(event) {
//         if (this.eventList[event] && this.eventList[event].length) {
//             for (let i = 0; i < this.eventList[event].length; i++) {
//                 this.eventList[event][i]();
//             }
//         }
//     }
// }

// 基础版观察者模式

// 发布者
// class Dep {
//     constructor() {
//         this.subs = [];
//     }
//     addSub(sub) {
//         sub && sub.update && this.subs.push(sub);
//     }
//     notify() {
//         this.subs.forEach(sub => {
//             sub.update();
//         });
//     }
// }

// class Watcher{
//     update() {

//     }
// }

// MyVue

// 收集某一个key的所有Watcher
class Dep {
    constructor() {
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}

class Watcher {
    constructor(vm, key, callback) {
        this.vm = vm;
        this.key = key;
        this.callback = callback;
        // 添加当前watcher实例到Dep的静态属性target上
        Dep.target = this;
        // 访问属性，调用属性getter，Dep.target && dep.subs.push(Dep.target);走这一行代码添加依赖
        this.oldValue = this.vm[key];
        // 添加完依赖以后重置Dep.target静态属性，用来继续添加下一个watcher
        Dep.target = null;
    }
    update() {
        const newValue = this.vm[key];
        if (newValue === this.oldValue) return ;
        this.callback(newValue);
    }
}

class Compiler {
    constructor(vm) {
        this.el = vm.el;
        this.vm = vm;
        this.compile(this.el);
    }
    // 编译模板，处理文本节点和元素节点
    compile(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            // 处理文本节点
            if (this.isTextNode(node)) {
                this.compileText(node);
            }
            // 处理元素节点
            if (this.isElementNode(node)) {
                this.compileElement(node);
            }
            // 如果元素有子节点，需要递归 处理子节点
            if (node.childNodes && node.childNodes.length) {
                this.compile(node);
            }   
        })
    }
    // 处理指令
    compileElement(node) {
        const attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
            const attrName = attr.name;
            if (this.isDirective(attrName)) {
                const attrRealName = attrName.substr(2);
                const key = attr.value;
                this.update(node, key, attrRealName);
            }
        })
    }
    update(node, key, attrRealName) {
        this[attrRealName + 'Updater'](node, this.vm[key]);
    }
    // 处理v-text指令
    textUpdater(node, key, value) {
        node.textContent = value;
        new Watcher(this.vm, key, newValue => {
            node.textContent = newValue;
        });
    }
    // 处理v-model指令
    modelUpdater(node, key, value) {
        node.value = value;
        new Watcher(this.vm, key, newValue => {
            node.value = newValue;
        });
        // 注册input事件，更新输入框的值的时候更新数据
        node.addEventListener(input, () => {
            this.vm[key] = node.value;
        });
    }
    // 处理插值表达式
    compileText(node) {
        const reg = /\{\{(.+?)\}\}/;
        const text = node.textContent;
        if (reg.test(text)) {
            let key = RegExp.$1.trim();
            node.textContent = text.replace(reg, this.vm[key]);
            // 创建watcher对象，当数据改变，更新视图
            new Watcher(this.vm, key, newVal => {
                node.textContent = newVal;
            })
        }
    }
    // 判断元素的属性是都否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    // 判断传入的节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3;
    }
    // 判断传入的节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1;
    }
}

class Observer {
    constructor(data) {
        this.walk(data);
    }
    walk(data) {
        if (Object.prototype.toString.call(data) !== '[object object]') {
            return;
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]);
        })
    }
    defineReactive(obj, key, val) {
        const that = this;
        // 收集依赖并发送通知
        const dep = new Dep();
        // 如果值是对象，那么我们需要递归调用this.walk方法
        this.walk(val);
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.subs.push(Dep.target);
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                that.walk(newVal);
                dep.notify();
            }
        })
    }
}

class MyVue {
    constructor(options = {}) {
        // 保存传入的options数据
        this.$options = options;
        this.$data = options.data || {}; 
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el; 
        // 把data中的数据使用getter和setter重定义一下并注入到Vue实例中，即是使用vue代理data的属性
        this._proxyData(this.$data);
        // 调用observer，监听数据的变化 
        new Observer(this.$data);
        // 调用compiler解析指令和{{  }}（插值）表达式
        new Compiler(this);
    }
    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key];  
                },
                set(newVal) {
                    if (newVal === data[key]) {
                        return;
                    }
                    data[key] = newVal;
                }
            })
        })
    }
}

