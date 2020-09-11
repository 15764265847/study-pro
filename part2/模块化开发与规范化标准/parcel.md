parcel在2017年推出首个版本，因为当时webpack使用过于繁琐
    优势：
        1、零配置
        2、使用多进程，打包速度快
    劣势：
        1、webpack生态更好
        2、随着这两年的发展webpack越来越好用

一、零配置，傻瓜式操作

二、parcel官方建议是用html作为打包入口
    官方理由：因为浏览器端html才是页面展示的入口

三、直接运行yanr parcel './src/index.html'是可行的
    PS：但是在本项目中有问题，估计是不知道啥哪个包和parcel冲突了，或者哪个包的版本早parcel中使用有问题，直接新开一个项目，直接运行是好使的

四、parcel和webpack一样需要针对文件自定义模块热替换的功能，但是parcel只支持传一个函数参数，即当前这个模块更新后会自动执行该函数
    if (module.hot && module.hot.accept) {
        module.hot.accept(() => {
            console.log('hmr)
        });
    }

五、支持自动安装依赖
    即直接在代码顶部加入import $ from 'jquery';就会自动安装相关的模块

六、parcel希望给开发这一种想做什么尽管去做，其他的都交由parcel自动处理，不需要安装什么插件啊，loader这些东西的体验

七、yarn parcel build src/index.html 这样就直接可以进行生产模式的打包了
    PS：对于同体量的项目，parce打包起来比wabpack快很多，因为parcel使用多进程进行打包，充分利用了cpu多核的特性

    webpack也可以使用happypack这个插件来实现多进程打包