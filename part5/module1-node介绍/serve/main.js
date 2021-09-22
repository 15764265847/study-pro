const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs').promises
const { createReadStream } = require('fs')
const mime = require('mime')
const ejs = require('ejs')
const { promisify } = require('util') 

const mergeConfig = (config) => {
  return {
    port: 8080,
    directory: process.cwd(),
    ...config
  }
}

class Server {
  constructor (config) {
    this.config = mergeConfig(config)
  }

  start () {
    const server = http.createServer(this.serveHandle.bind(this))
    server.listen(this.config.port, () => {
      console.log('服务端已经运行了')
    })
  }

  async serveHandle (req, res) {
    console.log('有请求进来了')
    let { pathname } = url.parse(req.url)
    pathname = decodeURIComponent(pathname)
    const abspath = path.join(this.config.directory, pathname)

    try {
      const statObj = await fs.stat(abspath)
      if (statObj.isFile()) {
        this.fileHandle(req, res, abspath)
      } else {
        let dirs = await fs.readdir(abspath)
        dirs = dirs.map(item => {
          return {
            path: path.join(pathname, item),
            dirs: item
          }
        })
        const renderFile = promisify(ejs.renderFile)
        const parentPath = path.dirname(pathname)
        const ret = await renderFile(path.resolve(__dirname, 'template.html'), {
          arr: dirs,
          parent: pathname === '/',
          parentPath,
          title: path.basename(abspath)
        })
        res.end(ret)
      }
    } catch (err) {
      this.errHandle(req, res, err)
    }
  }

  errHandle (req, res, err) {
    console.log(err)
    res.statusCode = 404
    res.setHeader('Content-type', 'text/html;charset=utf-8')
    res.end('Not Found')
  }

  fileHandle (req, res, abspath) {
    res.statusCode = 200
    res.setHeader('Content-type', `${mime.getType(abspath)};charset=utf-8`)
    createReadStream(abspath).pipe(res)
  }
}

module.exports = {
  Server
}
