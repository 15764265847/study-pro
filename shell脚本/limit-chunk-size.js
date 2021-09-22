const fs = require('fs')
const glob = require('glob')
const path = require('path')
const _ = require('lodash')

const findLargestFileSizeInFolder = folder => {
  return _.max(
    glob
      .sync(path.join(folder, '**/*.chunk.+(js|css)'))
      .map(file => fs.statSync(file)['size'])
      .map(bytes => _.round(bytes / (1024 * 1024), 3)),
  )
}

const [, , folder, limit] = process.argv

const largestInMb = findLargestFileSizeInFolder(folder)

if (largestInMb > +limit) {
  throw new Error(
    `ERROR: Chunk too large (${largestInMb}m). The limit is ${limit}m.`,
  )
}
