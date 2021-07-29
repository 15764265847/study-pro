const { Readable } = require('stream')

const source = ['lg', 'zce', 'syy']

class MyReadable extends Readable {
  constructor (source) {
    super()
    this.source = source
  }

  _read () {
    const data = this.source.shift() || null
    this.push(data)
  }
}
