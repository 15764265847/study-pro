1、创建一个Vue类，入口
    1、使用$options保存传入的options选项
    2、使用$el保存传入的el，如果el是一个字符串就去获取DOM元素，如果是一个元素就直接使用
    3、使用$data保存传入的options中的data对象
    4、调用_proxyData方法，给data中的数据添加代理，是Vue实例可以直接访问到
2、创建一个Observe类，添加getter和setter，并收集更新依赖
    1、遍历data中的所有的key添加getter和setter，需要递归添加
    2、getter中会添加及收集依赖
    3、setter中更新依赖
    4、如果将data下的value不为对象的key的value修改为一个对象，那么这里需要重新调用添加getter，setter的函数
3、创建一个Compiler类，用来解析插值表达式和命令
    1、遍历创建Vue实例时传入的el的子元素
    2、如果是一个文本节点，则匹配是否是{{  }}的格式，如果是则进行元素内容的修改，如果不是则什么也不做
    3、如果是一个元素节点，则解析元素的属性，看属性是否是v-的类型，如果是则解析命令，并根据对应的命令来做不同的解析方式
    4、在解析的时候需要创建对应的watcher
4、创建一个Dep类，发布者
    1、发布者需要收集对应的watcher对象，所以需要有一个数组来保存
    2、addSub用来收集依赖
    3、notify用来调用watcher对象的update方法，更新视图
5、创建一个Watcher类，订阅者
    1、需要传入 Vue实例、key，用于更行视图的函数
    2、构造函数需要设置Dep.target为this，并且获取一下当前key的value，来触发一下该key的getter来添加依赖
    3、update方法，调用我们传入的回调函数，更新视图