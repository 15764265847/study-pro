const fs = require('fs')

const readStream = fs.createReadStream('./buffer.js', {
  highWaterMark: 4
})

const writeStream = fs.createReadStream('./buffer-copy.js', {
  highWaterMark: 1
})
