const fs = require('fs')

const buf = Buffer.alloc(10)

fs.open('node介绍.md', 'r', (err, rfd) => {
  if (err) return err
  fs.read(rfd, buf, 0, 10, 0, (err, rlen, rdata) => {
    if (err) return err
    console.log(rlen)
    console.log(rdata.toString())
    fs.open('b.txt', 'w', (err, wfd) => {
      if (err) return err
      fs.write(wfd, buf, 0, 10, 0, (err, wlen, wdata) => {
        if (err) return err
        console.log(wlen)
        console.log(wdata.toString())
        fs.close(rfd, () => {})
        fs.close(wfd, () => {})
      })
    })
  })
})
