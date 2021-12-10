/**
 * @file 需检测的文件路径
 */
const shelljs = require('shelljs')
const path = require('path')
const {
  appsIncluded,
  packagesNotIncluded,
  pluginsNotIncluded,
} = require('./config')
const { rootPath } = require('../const')

const appDirPath = path.resolve(rootPath, 'apps')
const apps = shelljs
  .ls('-d', path.resolve(appDirPath, '*'))
  .map(p => {
    return p.replace(`${appDirPath}/`, '')
  })
  .filter(v => appsIncluded.includes(v))

const packageDirPath = path.resolve(rootPath, 'packages/src')
const packages = shelljs
  .ls('-d', path.resolve(packageDirPath, '*'))
  .map(p => {
    return p.replace(`${packageDirPath}/`, '')
  })
  .filter(v => !packagesNotIncluded.includes(v))

const pluginDirPath = path.resolve(rootPath, 'apps/plugins')
const plugins = shelljs
  .ls('-d', path.resolve(pluginDirPath, '*'))
  .map(p => {
    return p.replace(`${pluginDirPath}/`, '')
  })
  .filter(v => !pluginsNotIncluded.includes(v))

module.exports = {
  appDirPath,
  apps,
  packageDirPath,
  packages,
  pluginDirPath,
  plugins,
}
