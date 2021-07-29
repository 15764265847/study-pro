const fs = require('fs')
const EventEmmiter = require('events')

class MyReadStream extends EventEmmiter {
  constructor (
    path,
    {
      flags = 'r',
      mode = 438,
      autoClose = true,
      start = 0,
      end,
      highWaterMark = 64 * 1024
    } = {}
  ) {
    super()
    this.path = path
    this.flags = flags
    this.mode = mode
    this.autoClose = autoClose
    this.start = start
    this.end = end
    this.highWaterMark = highWaterMark
    this.readOffset = 0

    this.open()

    this.on('newListener', (type) => {
      if (type === 'data') {
        this.read()
      }
    })
  }

  pipe (writeStream) {
    this.on('data', () => {
      const flag = writeStream.write(this.fd)
      if (!flag) {
        this.pause()
      }
    })
    writeStream.on('drain', () => {
      this.resume()
    })
  }

  close () {
    fs.close(this.fd, () => {
      this.emit('close')
    })
  }

  read () {
    if (!this.fd) {
      return this.once('open', this.read)
    }
    const buf = Buffer.alloc(this.highWaterMark)
    let howMuchToRead = this.highWaterMark
    if (this.end) {
      howMuchToRead = Math.min(this.end + 1 - this.readOffset, this.highWaterMark)
    }
    fs.read(this.fd, buf, 0, howMuchToRead, this.readOffset, (err, readBytes) => {
      if (err) {
        return this.emit('error', err)
      }
      if (readBytes) {
        this.readOffset += readBytes
        this.emit('data', buf.slice(0, readBytes))
        this.read()
      } else {
        this.emit('end')
        this.close()
      }
    })
  }

  open () {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {
        this.emit('error', err)
        return
      }
      this.fd = fd
      this.$emit('open', fd)
    })
  }
}
