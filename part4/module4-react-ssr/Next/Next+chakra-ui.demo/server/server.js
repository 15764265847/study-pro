const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV === 'production'

// next是一个函数，接收一个配置对象
// 这里只用到了一个 dev 参数 表示环境变量配置 当时是否是 dev 环境
const nextApp = next({dev})

const handler = nextApp.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.get('*', (req, res) => {
    handler(req, res)
  })
  server.listen(4000, () => {
    console.log('自定义next服务启动啦')
  })
})
