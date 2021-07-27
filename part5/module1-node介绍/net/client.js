const net = require('net')

const PORT = 9998
const HOST = '127.0.0.1'

const client = net.createConnection({
  host: HOST,
  port: PORT
})

client.on('connect', () => {
  client.write('拉钩教育')
})

client.on('data', (chunk) => {
  console.log(chunk.toString())
})

client.on('close', () => {
  console.log('客户端关闭了')
})

client.on('error', (err) => {
  console.log('客户端报错了', err)
})
