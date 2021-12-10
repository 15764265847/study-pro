/**
 * @file 获取系统中的文本，生成 locale-cache.json
 *
 * 仅服务于 Chalk 相关
 */
const shelljs = require('shelljs')
const path = require('path')
const fs = require('fs')
const { default: extract } = require('@seiue/formatjs-cli/lib/extract')

const {
  apps,
  appDirPath,
  packageDirPath,
  packages,
  pluginDirPath,
  plugins,
} = require('./paths')
const { localeCachePath } = require('../const')
const {
  getFeatureLabelMap,
  initFileFeatureLabelMap,
  getFileFeatureLabel,
} = require('./get-features-labels')
const { getPluginLabel } = require('./get-plugins-labels')

// 构成 { [feature: string]: { [id: string]: Message } } 的 Hash Map
const featureMessageMap = {}

/**
 * 赋 Message 至 Map
 * @param {Object} map
 * @param {string|null} key
 * @param {Object} message
 */
const setMessageToMap = (map, key, message) => {
  map[key] = Object.assign({}, map[key], {
    [message.id]: message,
  })
}

/**
 * 提取需翻译内容
 * @param {string} dirPath 需要检索翻译的文件路径
 */
const executeMessages = async dirPath => {
  console.log(`正在从 ${dirPath} 获取文本`)

  // 处理单个 message
  const executeMessage = message => {
    const { featureName, filename, module } = message

    const label =
      module ||
      getFileFeatureLabel(filename) ||
      getFeatureLabelMap()[featureName] ||
      getPluginLabel(filename) ||
      '通用'

    setMessageToMap(featureMessageMap, label, message)
  }

  // 获取所有符合格式的文件，即 js,jsx,ts,tsx
  const files = shelljs.find(dirPath).filter(file => file.match(/\.[tj]sx?$/))
  if (!files.length) {
    return
  }

  // 初始化文件名本身自带的 feature label
  initFileFeatureLabelMap(files)

  // 获取 Messages
  const extractMessages = await extract(files, {
    idInterpolationPattern: '[contenthash:5]',
    moduleSourceName: 'packages/locale/LocaleProvider',
    extractFromFormatMessageCall: true,
  })

  // 逐个处理
  Object.values(extractMessages).forEach(messages => {
    if (messages) {
      messages.forEach(message => {
        executeMessage(message)
      })
    }
  })
}

/**
 * 获取文案
 */
const generate = async () => {
  console.log('开始获取项目中的文本')
  console.time('process')

  // 文件取值处理需要按序进行，才能正确的比较所有文件的重复情况
  const executeStack = [
    ...apps.map(
      appName => () =>
        executeMessages(path.resolve(appDirPath, appName, 'src')),
    ),
    ...plugins.map(
      pluginName => () =>
        executeMessages(path.resolve(pluginDirPath, pluginName, 'src')),
    ),
    ...packages.map(
      packageName => () =>
        executeMessages(path.resolve(packageDirPath, packageName)),
    ),
  ]

  const execute = () => {
    let i = 0

    return new Promise(resolve => {
      const recursive = () => {
        executeStack[i]()
          .then(() => {
            if (executeStack[++i]) {
              recursive(resolve)
            } else {
              // 取值完毕后，开始输出
              const finalMessages = []

              const commonProps = {
                id: 0,
                locale: 'sys',
                belongs_to: 'fe',
              }

              Object.entries(featureMessageMap).map(
                ([featureKey, messageMap]) => {
                  Object.keys(messageMap).map(key => {
                    finalMessages.push({
                      ...commonProps,
                      content: key,
                      ref_to: key,
                      module: featureKey,
                    })
                  })
                },
              )

              resolve(finalMessages)
            }
          })
          .catch(e => {
            throw e
          })
      }

      recursive(resolve)
    })
  }

  const finalMessages = await execute()

  fs.writeFileSync(localeCachePath, JSON.stringify(finalMessages, null, 2)),
    console.log(`生成文本至 ${localeCachePath}`)
  console.timeEnd('process')
}

generate()
