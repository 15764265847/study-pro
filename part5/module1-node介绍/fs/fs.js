const fs = require('fs')
const path = require('path')

fs.open(path.resolve('node介绍.md'), 'r', (err, fd) => {
  if (err) {
    return err
  }
  console.log(fd)

  // 我们可以直接使用 fd 来追踪或者定位被操作的文件资源
  fs.close(fd, err => {
    console.log(err, '关闭')
  })
})
