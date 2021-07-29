const fs = require('fs')

const readStream = fs.createReadStream('buffer.js', {
  highWaterMark: 4
})

const writeStream = fs.createWriteStream('test.txt', {
  highWaterMark: 1
})

let flag = true

readStream.on('data', (chunk) => {
  flag = writeStream.write(chunk)
  if (!flag) {
    readStream.pause()
  }
})

writeStream.on('drain', () => {
  readStream.resume()
})
