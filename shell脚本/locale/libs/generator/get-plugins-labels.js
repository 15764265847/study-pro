/**
 * @file 根据 apps/plugins 里的 index.json 中的 name/title 来获取 plugin 名称
 */
const fs = require('fs')
const path = require('path')
const { pluginDirPath, plugins } = require('./paths')

const pluginLabelMap = {}

const getPluginLabelMap = () => {
  if (Object.keys(pluginLabelMap).length) {
    return pluginLabelMap
  }

  // 获取项目中所有的 Plugins 主目录
  const pluginIndexPath = plugins.map(pluginName =>
    path.resolve(pluginDirPath, pluginName, 'src', 'index.json'),
  )

  // 从入口文件中，取出中文名称
  pluginIndexPath.forEach(indexPath => {
    const indexFile = fs.readFileSync(indexPath, 'utf8')
    const indexObject = JSON.parse(indexFile)

    const { name, title } = indexObject

    const key = `plugin-${name}`

    pluginLabelMap[key] = title ? `plugin-${title}` : key
  })

  return pluginLabelMap
}

const getPluginLabel = path => {
  if (!path.includes('/apps/plugins/')) return null

  const matchResult = path.match(/\/apps\/plugins\/([^\s\/]*)\//i)

  if (!matchResult) return null

  const pluginKey = `plugin-${matchResult[1]}`

  return getPluginLabelMap()[pluginKey]
}

module.exports = {
  getPluginLabel,
}
