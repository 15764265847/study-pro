const fs = require('fs')

fs.readFile('./buffer.js', () => {
  setTimeout(() => {
    console.log('setTimeout')
  })

  setImmediate(() => {
    console.log('setImmediate')
  })
})
