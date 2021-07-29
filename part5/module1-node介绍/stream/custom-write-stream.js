const fs = require('fs')

const EventEmmiter = require('events')

class MyWriteStream extends EventEmmiter {
  constructor (
    path,
    {
      flags = 'w',
      mode = 438,
      autoClose = true,
      start = 0,
      highWaterMark = 16 * 1024,
      encoding = 'utf8'
    } = {}
  ) {
    super()
    this.path = path
    this.flags = flags
    this.mode = mode
    this.autoClose = autoClose
    this.start = start
    this.encoding = encoding
    this.highWaterMark = highWaterMark
    this.readOffset = 0

    this.open()

    this.writeOffset = start
    this.writing = false
    this.writeLen = 0
    this.needDrain = false
    this.cache = []
  }

  _clearBuffer () {
    const data = this.cache.shift()
    if (!data) {
      if (this.needDrain) {
        this.needDrain = false
        this.emit('drain')
      }
      return
    }
    this._write(data.chunk, data.encoding, () => {
      data.cb && data.cb()
      this._clearBuffer()
    })
  }

  _write (chunk, encoding, cb) {
    if (!this.fd) {
      return this.once('open', () => {
        return this._write(chunk, encoding, () => {
          cb && cb()
          this._clearBuffer()
        })
      })
    }
    fs.write(this.fd, chunk, this.start, chunk.lengt, this.writeOffset, (err, written) => {
      if (err) {
        return this.emit('error', err)
      }
      this.writeOffset += written
      this.writeLen -= written

      cb && cb()
    })
  }

  write (chunk, encoding, cb) {
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    this.writeLen += chunk.length
    const flag = this.writeLen < this.highWaterMark
    this.needDrain = !flag

    if (this.writing) {
      this.cache.push({
        chunk,
        encoding,
        cb
      })
    } else {
      this.writing = true
      this._write(chunk, encoding, cb)
    }

    return flag
  }

  open () {
    fs.open(this.open, this.flags, (err, fd) => {
      if (err) {
        return this.emit('error', err)
      }
      this.fd = fd
      this.emit('open', fd)
    })
  }
}
