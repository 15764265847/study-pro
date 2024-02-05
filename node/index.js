// const { a } = require('./modules')

// console.log(a)

// console.log(require.cache)

// delete require.cache[require.resolve('./modules')]

// console.log(require.cache)

// console.log(process.arch, '获取到系统是32位还是64位')
// console.log(process.platform, '系统的类型')

// process.memoryUsage()可以获取当前进程的内存使用情况
// const { rss, heapTotal, heapUsed } = process.memoryUsage()
// console.log(rss, heapTotal, heapUsed)

// 输出执行参数
// console.log(process.argv)
// for (const arg of process.argv) {
//   console.log(arg)
// }

// zlib压缩、解压缩，或用来加密
// const zlib = require('zlib')
// zlib.deflate('测试压缩', function (_err, deBuf) {
//   console.log(deBuf.toString())
//   zlib.inflate(deBuf, function (_err, inBuf) {
//     console.log(inBuf.toString())
//   })
// })
