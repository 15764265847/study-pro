const fs = require('fs')
const path = require('path')
const vm = require('vm')

function Module (id) {
  this.id = id
  this.exports = {}
}

Module.prototype.load = function () {
  const extname = path.extname(this.id)
  Module._extensions[extname](this)
}

Module._resolveFilename = function (filename) {
  const absPath = path.resolve(__dirname, filename)
  if (fs.existsSync(absPath)) {
    return absPath
  } else {
    const suffix = Object.keys(Module._extensions)

    for (let i = 0; i < suffix.length; i++) {
      const newPath = absPath + suffix[i]
      if (fs.existsSync(newPath)) {
        return newPath
      }
    }
  }
  throw new Error(`${filename}不存在`)
}

Module._extensions = {
  '.js': (module) => {
    let content = fs.readFileSync(module.id, 'utf-8')
    content = Module.wrapper[0] + content + Module.wrapper[1]
    const compileFn = vm.runInThisContext(content)

    const exports = module.exports
    const dirname = path.dirname(module.id)
    const filename = module.id

    compileFn.call(exports, exports, customRequire, module, filename, dirname)
  },
  '.json': (module) => {
    let content = fs.readFileSync(module.id, 'utf-8')
    content = JSON.parse(content)

    module.exports = content
  }
}

Module._cacahe = {}

Module.wrapper = [
  '(function(exports, require, module, __filename, __dirname) {',
  '})'
]

function customRequire (filename) {
  const mPath = Module._resolveFilename(filename)
  console.log(mPath, 'mPath')
  const cacheModule = Module._cacahe[mPath]

  if (cacheModule) {
    return cacheModule.exports
  }

  const module = new Module(mPath)

  Module._cacahe[mPath] = module

  module.load()

  return module.exports
}

const obj = customRequire('./buffer')
console.log(obj)
