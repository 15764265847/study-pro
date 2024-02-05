const http = require('http')
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

const server = http.createServer(function (req, res) {
  res.writeHead(200, { 'content-encoding': 'gzip' })
  fs.createWriteStream(path.resolve(__dirname, 'modules.js'))
    .pipe(zlib.createGzip())
    .pipe(res)
})

server.listen('9999')
