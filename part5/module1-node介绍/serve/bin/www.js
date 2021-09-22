#! /usr/bin/env node

const { program } = require('commander')

const options = {
  '-p --port <dir>': {
    description: 'init serve port',
    example: 'serve -p 8080'
  },
  '-d --directory <dir>': {
    description: 'init serve directory',
    example: 'serve -d /'
  }
}

const formatConfig = (configs, cb) => {
  Object.entries(configs).forEach(([key, val]) => {
    cb(key, val)
  })
}

formatConfig(options, (cmd, val) => {
  program.option(cmd, val.description)
})

program.on('--help', () => {
  console.log('Examples:')
  formatConfig(options, (cmd, val) => {
    console.log(val.example)
  })
})
program.name('serve')

const version = require('../package.json').version

program.version(version)

const cmdOptions = program.parse(process.argv)

const { Server } = require('../main')

new Server(cmdOptions).start()
