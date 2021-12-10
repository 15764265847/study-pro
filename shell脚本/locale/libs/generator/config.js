/**
 * @file 本地化上传脚本配置
 */

// 需获取本地化信息的 Apps
const appsIncluded = ['chalk', 'go']

// 无需获取本地化信息的 Packages
const packagesNotIncluded = ['sdks', 'sdks-next']

// 无需获取本地化信息的 Plugins
const pluginsNotIncluded = []

// 来源标签，用于完善翻译文本的 module 字段
const sourceLabelMap = {
  chalk: 'Chalk 桌面端',
  go: 'Chalk 移动端',
  packages: '通用',
}

module.exports = {
  appsIncluded,
  packagesNotIncluded,
  pluginsNotIncluded,
}
