const net = require('net')

const server = net.createServer()

const PORT = 9998
const HOST = 'localhost'

server.listen(PORT, HOST)

server.on('listening', () => {
  console.log(`服务开启了 ${HOST}:${PORT}`)
})

server.on('connection', (socket) => {
  socket.on('data', (chunk) => {
    const msg = chunk.toString()
    console.log(msg)
    socket.write(Buffer.from(`你好，${msg}`))
  })
})

server.on('close', () => {
  console.log('服务端关闭了')
})

server.on('error', (err) => {
  console.log('服务端 报错了', err)
})
