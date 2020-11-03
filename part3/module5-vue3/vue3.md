###  介绍
    1、TS 重写
    2、monorepo 方式管理项目结构，不同的功能都进行了拆分，模块划分明确，依赖明确，每个单独的包都可以单独下载使用
    3、构建版本
        cjs 版本 
            vue.cjs.js 完整版，未压缩
            vue.cjs.prod.js 完整版，生产模式，已压缩
        global 版本
            vue.global.js 完整版本，可以直接使用 script 导入 ，未压缩
            vue.global.prod.js 同上的压缩版
            vue.global.runtime.js 运行时版本，可以直接使用 script 导入 ，未压缩
            vue.global.runtime.prod.js 同上的压缩版
        brower
            vue.esm-brower.js 浏览器的完整版的 es module 版本，即可以使用 script type="modukle" 的方式导入
            vue.esm-brower.prod.js 同上，压缩版
            vue.runtime.esm-brower.js 浏览器的运行时的 es module 版本，即可以使用 script type="modukle" 的方式导入
            vue.runtime.esm-brower.prod.js 同上，压缩版
        bundler 
            vue.esm-bundler.js 未打包所有代码，完整版，需要配合打包工具使用，内部通过 import 导入了 compiler-core 等模块
            vue.runtime.esm-bundler.js 同上，但是只导入了运行时，vue的最小版本，打包时只会打包使用到的代码，让vue体积更小

    4、composition api 的设计动机
        1、vue2.x 使用 options api ，即我们使用传入一个对象（包含 data methods 等）来描述一个组件。此时我们会将同一个功能的逻辑拆分到 data methods props 等当中，难以提取重用逻辑
        2、基于函数的 api ，更灵活的组织组建的逻辑
    
    5、性能提升
        1、使用 proxy api 重写响应式系统
            1、动态监听添加的属性
            2、可以监听删除
            3、不需要对数组支持，可以监听数组索引以及length的改变 
        2、编译优化，优化编译过程，重写虚拟 dom ，提升了首次渲染以及dom更新的性能 
            1、vue2 通过标记静态根节点，来优化diff过程
            2、vue3 会对所有的静态根节点进行标记和提升，diff 的时候只会对比动态节点
            3、使用 fragment ，即模板当中不再是使用单一的根节点，而是可以直接使用文本，或者是多个同级标签
                PS：vscode 需要升级到最新的 vetur 插件，因为老版的 vetur 插件只会支持模板的唯一根节点，使用vue3时会报错
                1、编译后的 js 代码中，会将静态节点放到最前面单独生成虚拟dom，并通过传参（创建虚拟dom的时候会传入 -1 来表示是静态节点）的方式进行标记，在diff的时候直接重用
                2、在只存在插值表达式的时候，会使用 1 来表示这只是文本动态；在使用 :id="id" 和插值表达式的时候会使用 9 来表示属性和文本都是动态的，这个时候 diff 算法就会只对动态的地方进行 diff 从而大大提高了 diff 的性能
                3、按需引用
                4、对事件绑定函数进行缓存，避免了不必要的更新
            4、 
        3、源码体积的优化
            1、tree-shaking
            2、移除不常用的 api 
            3、按需引入，即我们使用了哪些 api ，才会在打包的时候打包进去，默认会打包核心模块

    6、vite 比基于 webpack 的cli更快

        PS：浏览器中使用es module 的方式
            1、通过在 script 标签上添加 type="module" 的方式
            2、类似于使用 defer 属性，会延迟加载
                1、defer 也是在dom解析完毕， DOMContentLoaded 事件被触发之前执行。即会在 defer 的 js 执行完毕后触发 DOMContentLoaded ，多个defer按顺序执行
                2、async 会异步加载，加载完成后立即执行并阻塞dom解析以及渲染，可能会在 DOMContentLoaded 之前也可能在之后，多个async谁先加载完谁先执行，加载过程是异步的，不会阻塞dom，执行过程是阻塞的
            3、在dom解析完毕，DOMContentLoaded事件被触发之前执行
            4、es module 默认开启严格模式

        1、vite 在开发环境下不需要打包文件，所以页面是秒开的
            但是vue-cli使用了webpack，所以需要在开发环境下打包构建，如果项目比较大，页面打开较慢 
            1、快速冷启动
            2、按需编译
            3、热更新，与组件模块数量无关，即，不过多少组件模块都会比较快
            4、使用 rollup 打包
        2、vite 创建项目 不需要安装 直接在想创建项目的地方执行以下命令即可
            1、基本方式
                npm init vite-app <project-name>
                cd <project-name>
                npm i
                npm run dev
            2、模板方式，可以创建其他框架的项目
                npm init vite-app --template react 创建react项目
                npm init vite-app --template preact

        3、开发模式下当我们使用 import 导入单文件组件时因为vite不会对以 .vue 结尾的单文件组件进行编译，所以会向vite启动的服务器发送请求，请求当前的单文件组件的内容，此时vite的服务器会对以 .vue 结尾请求进行拦截，并会对单文件组件解析成js文件，并将响应头content-type设置为 application/JavaScript 告诉浏览器发送的是js文件 
            请求 .vue 文件的时候，返回的 js 代码中会 import { render as __render } from 'xxx.vue?type=template' 
            此时就回去请求 xxx.vue?type=template ，此时会通过 compiler-sfc 模块将单文件组件编译成 render 函数并返回 

            进入页面时请求单文件组件，这里是 App.vue 为例，App.vue 中使用了 HelloWorld.vue 组件，首先会返回以下代码
                import HelloWorld from 'HelloWorld.vue';
                
                const __script = {
                    name: 'App',
                    components: {
                        HelloWorld
                    }
                }

                import { render as __render } from '/src/App.vue?type=template'
                __script.render = __render
                __script.__hmrId = '/src/App.vue'
                __script.__file = '此处是App.vue在文件系统中的绝对路径'
                export default __script

                此处的 HelloWorld 组件请求过程类似

            然后会发送请求，请求地址为 /src/App.vue?type=template ，告诉服务器需要给我返回编译好的模板
            这里会将 App.vue 编译成 render 函数返回






###  composition api

    1、setup 在props解析完成，但vue组件实例还没有创建之前 执行的，所以无法使用this获取组件实例，也无法访问data methods等
    setup 返回的数据在组件的其他位置都可以使用 
    这里使用 reactive 产生的代理对象不能进行解构

    2、reactive({}) 生成一个代理对象
    3、toRefs(position) 可以将响应式对象的内部属性也转换为响应式的，即使用了 toRefs(position) 转换后，我们就是使用解构将代理对象中的直解构出来单独使用，此时解构出来的值也是响应式的
        实现原理
            1、该方法要求传入的必须是一个代理对象
            2、他会将里面的每个属性转换为一个代理对象，该对象下有个value，value就是他的值，get和set的时候都是设置其value属性
    4、ref 将普通的基本类型的变量转换为响应式数据，实现原理同上，也是将基本值转换成一个代理对象，内部有value属性，get和set的都是其value属性
        参数可以使基本值，会返回一个代理对象
            const count = ref(0);
            此时count就是一个代理对象，有一个value属性以及 get 和 set
            修改count的值，需要使用 count.value ++;
        如果传递 对象的话，内部会调用reactive方法

        toRefs 和 ref 这之后的属性在插值表达式中可以省略value ，但是在 setup，computed，methods 等中不管设置还是获取都是使用其 value 属性

    5、在 setup 中设置函数，直接在 return 的对象中挂载即可，无法使用 this ，因为此时vue实例还没创建好，又因为vue 使用 use strict ，所以this是 undefined 
        setup 函数有两个参数，一个是 props ，一个是 context

        createApp({
            setup() {
                function con() {}
                return {
                    con
                }
            }
        })

    6、computed 
        const countValue = computed(() => { count.value++ });
    7、watch
        1、三个参数
            1、要监听的数据，可以是 ref 、 toRefs 、 reactive 返回的值，也可以是一个获取值得函数，监听返回值的变化，还可以是一个数组
            2、监听到变化后的执行的函数，该函数有两个参数，分别是新值和旧值
            3、选项对象，分别可以传入 deep immediate 
        2、会返回一个取消监听器的函数，调用则取消监听器

    8、watchEffect 简化版的watch，只有一个参数，参数是一个函数，用来监听内部依赖的值是否发生变化，也会返回一个取消监听器的函数
        在初始时会立即执行一次
        

###  Vue3.0 响应式原理
    proxy 使用回顾

        1、 proxy 使用回顾

            'use strict'
            const target = {
                foo: 'xxx',
                bar: 'yyy'
            }

            const proxy = new Proxy(target, {
                get(target, key, receiver) {
                    return Reflect.get(tarhet, key, receiver)
                },
                set(target, key, value, receiver) {
                    return Reflect.set(tarhet, key, value, receiver)
                },
                deleteProperty(target, key) {
                    return Reflect.deleteProperty(target, key)
                }
            })

            注意此处我们使用严格模式，严格模式下 set 和 deleteProperty都需要返回一个 Boolean ，非严格模式下不需要返回
                set 返回一个 Boolean ， true 表示设置成功， false 表示设置失败，会抛出一个错误，此处如果不加 return 则表示返回一个undefined，即为false，就会抛出一个错误
                deleteProperty 返回一个 Boolean ， true 表示删除成功， false 表示删除失败，会抛出一个错误，此处如果不加 return 则表示返回一个undefined，即为false，就会抛出一个错误

                如果是非严格模式下则不需要返回 Boolean 
                因为调用 Reflect.set 和 Reflect.deleteProperty 后会返回对应的 Boolean ，所以这里直接返回这两个函数调用的返回值即可

                此处 receiver 参数表示当前的 proxy 实例

                另外如果使用 es module 的话， es module 会默认开启严格模式，所以必须要返回
            
        2、proxy 使用回顾 this指向问题
            
            const obj = {
                get foo() {
                    console.log(this);
                    return this.bar;
                }
            }

            const proxyObj = new Proxy(obj, {
                get(target, key, receiver) {
                    if (key === 'bar') {
                        return 'value - bar';
                    }
                    // return Reflect.get(target, key)
                    return Reflect.get(target, key, receiver)
                }
            })

            console.log(proxyObj.foo);

            此处注释我们在调用 Reflect.get 的时候没有传入 receiver （该参数表示当前 Proxy 的实例，即当前的代理对象 proxyObj ）
            当我们访问 foo 的时候，此时其内部的 this 指向的是原对象，即 obj ，那么此时的 bar 是 undefined
            当我在调用 Reflect.get 的时候传入了 receiver ，那么此时的 this 就会指向当前代理对象 proxyObj ，此时的 this.bar 就会输出 value - bar

    reactive 和 ref 的区别

        reactive 
            返回的对象重新赋值后，不再是响应式对象，因为解除了对代理对象的引用
            返回的对象不可以结构，结构的后获取到的变量只是获取到值了
        ref 
            可以把基本类型数据转换成响应式数据
            对返回的对象的 value 赋值是响应式的，即使赋值一个对象，这个对象也会被转换成响应时的，他内部判断后会调用reactive来进行转换
    
###  vite 实现原理
