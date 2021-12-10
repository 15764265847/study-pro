/**
 * @file locale 相关常量
 */

const path = require('path')

module.exports = {
  rootPath: path.resolve(process.cwd(), '../..'),
  localeCachePath: path.resolve(process.cwd(), 'locale-cache.json'),
}
