const fs = require('fs')

const writeStream = fs.createWriteStream('test.txt')

const source = '拉钩教育'.split('')

let flag = true
let num = 0

function excuteWrite() {
  flag = true

  while (num !== 4 && flag) {
    flag = writeStream.write(source[num])
    num++
  }
}

writeStream.on('drain', () => {
  excuteWrite()
})
