
Vue的虚拟DOM是改造了一个开源库，SnabbDom

snabbdom 使用简介
    最新版本的snabbdom更新了导出方式，所以视频中的例子是低版本的导出方式
        import { h } from 'snabbdom/build/package/h'
        import { init } from 'snabbdom/build/package/init'
        import { thunk } from 'snabbdom/build/package/thunk'
        import { classModule } from 'snabbdom/build/package/modules/class'

    h函数、init函数和thunk函数时snabbdom最基础的三个函数
        init函数：一个高阶函数返回一个patch()
            参数：
                数组，需要传入模块 
                    const patch = init([]);

            patch函数是用来比对两个虚拟dom的差异更新到真实dom，主要就是用来更新dom的
                参数
                    第一个参数可以是一个真实dom，内部会把dom元素转换成vnode，表示旧的元素
                    第二个参数是vnode，表示新的元素
                返回值：vnode
                示例：
                    const oldNode = patch(div, vnode);
                PS：patch的时候就会对比差异并把修改后的dom渲染到页面上

                // 清空dom节点
                // h('!')生成一个注释节点
                patch(oldanli2div, h('!'));

        h函数：返回虚拟dom节点，和Vue中的h函数类似，因为Vue的虚拟dom就是改造的snabbdom
            new Vue({
                router,
                store,
                render: h => h(App)
            }).$mount('#app');

            参数：
                第一个参数：标签名称
                第二个参数如果是一个字符串则是表示标签的内容，#是id，.表示class
                    const vnode = h('div#app.one', 'Hello World');
                

        thunk函数：一种优化策略，可以 在处理不可变数据时候使用

    模块：
        1、attributes，用来设置元素属性
            使用setAttributes来操作属性
            会处理值为boolean的类型，例如input的checked属性和元素的contentable属性

        2、props
            使用element[attrname] = value的方式设置属性
            不处理值为boolean的类型

        3、class用来切换class的
            给元素设置class使用sel选择器

        4、dataset设置自定义属性

        5、eventListeners用来添加和移除事件

        6、style用来设置行内样式，支持动画

        使用，类似插件，需要另外导入，需要使用init来注册模块，使用h函数的时候第二个参数可以是对象，原本的第二个参数后移

关于vue中key的使用
    我的理解：正常来说v-for使用key并没有特别大的作用，因为无论是删除还是添加在首首、尾尾、首尾、尾首的比对中都会比对到，但是对列表排序的时候key的作用就会很大，这时候首首、尾尾、首尾、尾首都匹配不到，就会按照对应的key在旧的虚拟dom查找，找到的话就不需要重新创建dom，直接使用找到的dom进行插入