// 1. 资源 ： CPU 内存
console.log(process.memoryUsage())

// {
//   rss: 19705856, 常驻内存
//   heapTotal: 4468736, 脚本运行时申请的内存
//   heapUsed: 2646184, 脚本执行过程中使用了多少内存
//   external: 828309, 扩展内存，底层核心模块使用的内存
//   arrayBuffers: 9898 一片独立空间大小，不占据v8的空间大小，当前脚本执行时底层对buffer的使用的呢欧村
// }

console.log(process.cpuUsage())
// {
//   user: 49270, 用户占用的cpu的时间片段
//   system: 15216  系统占用的cpu的时间片段
// }

// 2. 运行环境： 运行目录  node版本环境  CPU架构  当前开发环境  运行的系统平台
console.log(process.cwd())
// /Users/deshuiyu/Desktop/study-pro 项目运行目录

console.log(process.version) // 返回 当前的node版本

console.log(process.versions)
// 返回底层一些模块的版本，比如会返回 v8 、zlib 等的版本
// {
//   node: '14.15.4',
//   v8: '8.4.371.19-node.17',
//   uv: '1.40.0',
//   zlib: '1.2.11',
//   brotli: '1.0.9',
//   ares: '1.16.1',
//   modules: '83',
//   nghttp2: '1.41.0',
//   napi: '7',
//   llhttp: '2.1.3',
//   openssl: '1.1.1i',
//   cldr: '37.0',
//   icu: '67.1',
//   tz: '2020a',
//   unicode: '13.0'
// }

console.log(process.arch) // x64 当前CPU架构

console.log(process.env) // 环境相关

console.log(process.env.NODE_ENV)

console.log(process.env.PATH) // 获取本机配置的环境变量

console.log(process.env.USERPROFILE) // windows下获取当前管理员目录，MAC 下应该是使用 process.env.HOME

console.log(process.platform) // 当前操作系统

// 3. 运行状态： 启动脚本使用的参数  当前进程的PID  从开始到死掉的运行时间

console.log(process.argv) // console.log(process.platform)

// [ 不论啥时候都会存在的两个默认值
//   '/Users/deshuiyu/.nvm/versions/node/v14.15.4/bin/node', node程序的所在绝对零
//   '/Users/deshuiyu/Desktop/study-pro/part5/module1-node介绍/node-demo.js' 当前脚本所在的绝对路径
// ]

console.log(process.pid) // 当前进程的pid

console.log(process.uptime()) // 脚本从运行开始到结束整体消耗的时间

// 事件
// 退出事件
process.on('exit', code => {
  console.log(code) // code 表示当前推出的状态码
})
// 退出之前
process.on('beforeExit', code => {
  console.log(code) // code 表示当前推出的状态码
})

// 手动推出进程  不会执行 beforeExit 事件
process.exit()

// 5. 标准输入 输出 错误
