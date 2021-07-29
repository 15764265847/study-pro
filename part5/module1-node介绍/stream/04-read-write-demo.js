const fs = require('fs')

let buf = Buffer.alloc(10)

// fs.open('node介绍.md', 'r', (err, rfd) => {
//   if (err) return err
//   console.log(rfd)
//   // 这里的写操作即是 从文件磁盘中将数据读取到内存中
//   fs.read(rfd, buf, 1, 3, 0, (err, readBytes, data) => {
//     if (err) return err
//     console.log(readBytes)
//     console.log(data)
//     console.log(data.toString())
//   })
// })

buf = Buffer.from('1234567890')

fs.open('b.txt', 'w', (err, wfd) => {
  if (err) return err
  fs.write(wfd, buf, 2, 3, 1, (err, written, data) => {
    if (err) return err
    console.log(written)
    console.log(data)
    console.log(data.toString())
  })
})
