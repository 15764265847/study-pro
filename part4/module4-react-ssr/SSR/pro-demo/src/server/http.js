import express from 'express'

const app = express()

app.use(express.static('public'))

app.listen(3000, () => {
  console.log('服务启动')
})

export default app