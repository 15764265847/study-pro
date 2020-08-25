函子库  folktale

ES只提供了语言的基本使用
js是在ES之上做的扩展

浏览器环境下的js = ES + Web APIs

http://www.ecma-international.org/ecma-262/6.0/  ES规范网站

Proxy强大在哪里
1、支持更多功能，例如函数调用等等
2、对于数组的支持更强大，vue3.0之前都是使用重写数组的方式来支持数组的监听
3、proxy是以非侵入式的方式监听属性的读写


Symbol  目前主要是用来作对象的私有属性，使用Symbol实现的实行不会被Object.keys等方法获取到，也不会被JSON序列化 
Symbol.for(true) === Symbol('true'); // true  Symbol.for方法会把传入的参数自动转成字符串
