// 简述题

// 一、简述Vue首次渲染的过程
// 1、调用 new Vue产生vue实例
// 2、实例的构造函数中会调用this._init()方法
// 3、然后会调用$mount方法
// 4、如果是完整版调用的则是在src/platform/web/entry-runtime-with-compiler.js中重写的添加编译器的$mount方法
//    这里最终也会调用原始版本的$mount方法
//     1、$mount方法会判断传入的options选项中是否传入了render函数
//     2、如果传入了render函数则继续执行
//     3、没有传入render函数则看是否传入template模板，如果传入了模板则会根据模板调用compileToFunction方法生成一个render函数
//        挂载到options上
// 5、运行时版本只会调用原始版本，内部调用了mountComponent方法
// 6.mountComponent方法
//     1、先判断options中是否有render函数
//     2、在判断是否有template模板
//         1、如果是运行时版本传入了template则会抛出警告，运行时版本不包含编译器，所以不能传入template
//     3、触发beforeMount钩子
//     4、定义updateComponent方法，方法内部调用vm._update(vm.render(),...)
//         1、_render 生成虚拟dom
//         2、_update 更新，将虚拟dom转换成真实dom，并挂载到页面上
//     5、创建watcher实例，此时会将上一步定义的updateComponent方法传入watcher的构造函数，并在watcher的构造函数中调用实例的get方法
//     6、触发mounted钩子
//     7、返回vm
// 7、watcher.get()
//     1、调用传入的updateComponent方法
//     2、调用vm._render，返回虚拟dom
//     3、调用vm._update
//         调用__patch__(vm.$el, vnode)，将虚拟dom渲染成真实dom挂载到页面，并将真实dom挂载到vm.$el上


// 二、响应式原理
// 1、new Vue创建vue实例
// 2、构造函数中调用了this._init方法
// 3、依次调用initState -> initData -> observe
//     1、initState中回调用initProps，initMethods、initComputed、initWatch等方法用来初始化props，methods等我们会用到的属性
// 4、observe方法
//     1、判断传入的value是否是对象，如果不是则直接返回
//     2、判断value是否有__ob__属性，如果有则说明已经添加过响应式，不需要重复添加，直接返回
//     3、没有则创建一个Observer实例，返回创建的Observer实例
// 5、创建Observer实例
//     1、给value定义一个不可枚举的__ob__属性，该属性保存了当前的为当前的属性创建的Observer实例，后续可能会用到
//     2、处理数组的响应式，重写数组的常用操作方法，pop、push等，再重写的方法内部会触发依赖更新
//     3、处理对象的响应式，调用walk方法，walk方法内部会遍历所有的key调用defineReactive添加getter和setter
// 6、依赖收集
//     1、watcher实例的get方法中调用pushTarget方法记录Dep.target
//     2、给childOb收集依赖，在删除属性的时候会用到
// 7、watcher
//     1、数据发生变化时，先触发Dep实例的对应的key的notify方法，然后遍历所有的watcher实例调用update方法更新数据
//     2、会使用queueWatcher判断当前watcher是否被处理，如果没有则添加到队列中，并调用flushSchedulerQueue刷新队列
// 8、flushSchedulerQueue方法
//     1、触发update函数
//     2、调用watcher.run函数
//     3、清空上一次的依赖
//     4、触发actived钩子
//     5、触发updated钩子


// 三、简述虚拟Dom中的key的好处
//     1、在插入数据、删除数据还有对数据进行排序的时候，对dom元素进行重用

//     例：此时我们有数组let arr = [1, 2,3,4,5,6];如果我们调用splice方法添加一个7，arr.splice(1, 0, 7);
//     此时对虚拟dom进行patch的时候，根据diff算法，在没有key的情况下，会认为7及7之后的元素和2及2之后的元素是相同的，其内部的文本节点不同，
//     会去挨个更新元素的节点，最后在创建一个6的元素
//     再有key的情况7和2的元素是不同的，首首不同，走尾尾，尾尾相同不会触发文本节点的更新，减少dom操作


// 四、vue模板编译的过程
// 1.调用compileToFunction加载编译好的render函数
//     1、如果没有缓存中没有对应的render函数，就会调用compile方法
// 2、compile
//     1、合并选项
//     2、调用baseCompile方法编译模板
// 3、baseCompile方法
//     1、调用parse将模板字符串转换成AST语法树
//     2、调用optimize方法优化AST语法树，标记静态根节点，静态根节点不需要patch及修改
//     3、generate函数将AST生成符合JS语法的字符串
// 4、会调用new Function将上一步生成的js字符串转换成一个方法
// 5、render函数和staticRenderFns函数生成完之后挂载到options选项中