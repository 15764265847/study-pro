const EventEmmiter = require('events')

const ev = new EventEmmiter()

ev.on('事件1', () => {
  console.log('事件1执行')
})

ev.emit('事件1')
