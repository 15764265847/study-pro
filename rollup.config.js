// 该插件导出一个函数
import json from 'rollup-plugin-json';
// 该插件允许直接使用模块名的方式加载模块
import resolve from 'rollup-plugin-node-resolve';
// 用来解决rollup无法打包commonjs规范模块的问题
import commonjs from 'rollup-plugin-commonjs'

export default {
    input: './rollupPro/src/index.js',
    // output必须是一个对象 
    output: {
        // 指定输出文件
        // file: './rollupPro/dist/bundle.js',
        // 使用rollup拆包时会输出多个文件，需要配置输出路径，而不是配置输出的文件名
        // 这是需要使用dir属性
        dir: './rollupPro/dist',
        // 指定输出的格式，iife指的就是以自执行函数的方式输出
        // 使用rollup拆包时只能使用AMD或者cmd规范，不能使用iife模式输出代码
        // format: 'iife'
        format: 'amd'
    },
    plugins: [
        // 该插件是用来帮助我们指出使用import的方式导入json文件
        // 这里plugins数组中是函数调用的结果而不是函数
        json(),
        resolve(),
        commonjs()
    ]
}