/**
 * @file 仅用于生成需翻译文本 Excel
 * @deprecated
 */
const shelljs = require('shelljs')
const path = require('path')
const fs = require('fs')
const xl = require('excel4node')
const { default: extract } = require('@seiue/formatjs-cli/lib/extract')

// 无需获取本地化信息的 App
const appsNotIncluded = ['apollo']
const appDirPath = path.resolve(process.cwd(), '../../apps')
const apps = shelljs
  .ls('-d', path.resolve(appDirPath, '*'))
  .map(p => {
    return p.replace(`${appDirPath}/`, '')
  })
  .filter(v => !appsNotIncluded.includes(v))

// 无需获取本地化新的 Pakcage
const packagesNotIncluded = ['sdks', 'sdks-next']
const packageDirPath = path.resolve(process.cwd(), '../../packages/src')
const packages = shelljs
  .ls('-d', path.resolve(packageDirPath, '*'))
  .map(p => {
    return p.replace(`${packageDirPath}/`, '')
  })
  .filter(v => !packagesNotIncluded.includes(v))

// 所有本地化信息，用于判断 是否存在多个本地化信息及统一转化至 locale/locales/zh.json
const allMessageMap = {}

// 所有翻译过的英语信息
const allEnMessageMap = {}

// 取自各个 App Features 中的翻译，会被转化到对应 Feature 的 locales/en.json 中
const featureMessageMap = {}

// 取自各个 App 除了 Features 以外的翻译，会被转化到对应 App 的 src/locales/en.json 中
const appMessageMap = {}

// 存在于各个 packages 中的翻译，会被转化到对应包的 locales/en.json 中
const packageMessageMap = {}

// 如果一个翻译存在于上面三个 Map 中的两个及以上，则会被提取到此处
// 然后被转化为 locale/locales/en.json，是英语翻译的基底文件
const rootMessageMap = {}

/**
 * 赋 Message 至 Map
 * @param {Object} map
 * @param {string|null} key
 * @param {Object} message
 */
const setMessageToMap = (map, key, message) => {
  if (key) {
    map[key] = Object.assign({}, map[key], {
      [message.id]: message.defaultMessage,
    })
  } else {
    map[message.id] = message.defaultMessage
  }
}

/**
 * 提取需翻译内容
 * @param {string} dirPath 需要检索翻译的文件路径
 */
const executeMessages = async dirPath => {
  console.log(`get ${dirPath} locale messages`)

  // 处理单个 message
  const executeMessage = message => {
    const { featureName, appName, packageName, id: messageId } = message
    let existMessage = allMessageMap[messageId]

    if (!existMessage) {
      // 先把值放到 all 中
      setMessageToMap(allMessageMap, null, message)

      // 在根据 message 的情况进行赋值即可
      if (packageName) {
        setMessageToMap(packageMessageMap, packageName, message)
      } else if (featureName) {
        const mapKey = `${appName}/${featureName}`
        setMessageToMap(featureMessageMap, mapKey, message)
      } else if (appName) {
        setMessageToMap(appMessageMap, appName, message)
      }

      return
    }

    // 如果存在旧值，但根据新值的情况无法在对应 map 检索到值
    // 就将内容放到 root 中
    if (packageName) {
      if (
        !packageMessageMap[packageName] ||
        !packageMessageMap[packageName][messageId]
      ) {
        setMessageToMap(rootMessageMap, null, message)
      }

      setMessageToMap(packageMessageMap, packageName, message)
    } else if (featureName) {
      const mapKey = `${appName}/${featureName}`
      if (!featureMessageMap[mapKey] || !featureMessageMap[mapKey][messageId]) {
        setMessageToMap(rootMessageMap, null, message)
      }

      setMessageToMap(featureMessageMap, mapKey, message)
    } else if (appName) {
      if (!appMessageMap[appName] || !appMessageMap[appName][messageId]) {
        setMessageToMap(rootMessageMap, null, message)
      }

      setMessageToMap(appMessageMap, appName, message)
    }
  }

  // 获取所有符合格式的文件，即 js,jsx,ts,tsx
  const files = shelljs.find(dirPath).filter(file => file.match(/\.[tj]sx?$/))

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
 * 判断文件是否存在
 * @param {string} path 文件路径
 */
const isFileExist = async path => {
  try {
    await fs.promises.stat(path)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 输出 en.json 文件
 * @param {string} localePath 所要输出的目标文件夹
 * @param {Object} newMessageMap 消息集
 */
const output = async (localePath, newMessageMap) => {
  console.log(`output local messages to ${localePath}`)

  const localeDirPath = path.resolve(localePath, 'locales')
  const localeFilePath = path.resolve(localeDirPath, 'en.json')
  const legacyFilePath = path.resolve(localeDirPath, 'en-legacy.json')

  const [isLocaleDirExist, isLocaleFileExist, isLegacyFileExist] =
    await Promise.all([
      isFileExist(localeDirPath),
      isFileExist(localeFilePath),
      isFileExist(legacyFilePath),
    ])

  let oldMessageMap = {}
  let legacyMessageMap = {}

  if (isLegacyFileExist) {
    legacyMessageMap = JSON.parse(
      await fs.promises.readFile(legacyFilePath, 'utf8'),
    )
  }

  if (isLocaleFileExist) {
    oldMessageMap = JSON.parse(
      await fs.promises.readFile(localeFilePath, 'utf8'),
    )
    Object.keys(oldMessageMap).forEach(id => {
      // 新值实际上为 { key: key }，其 value 是无意义的内容，一旦旧值有值便可直接替代
      if (newMessageMap.hasOwnProperty(id)) {
        newMessageMap[id] = oldMessageMap[id]

        // 将翻译过的文本放到 allEnMessageMap
        if (oldMessageMap[id] !== id) {
          allEnMessageMap[id] = oldMessageMap[id]
        }
      } else if (id !== oldMessageMap[id]) {
        // 新值里找不到 key，且是有效翻译，就放进 legacy 中
        legacyMessageMap[id] = oldMessageMap[id]
      }
    })
  }

  if (!isLocaleDirExist) {
    await fs.promises.mkdir(localeDirPath)
  }

  await Promise.all([
    fs.promises.writeFile(
      legacyFilePath,
      JSON.stringify(legacyMessageMap, null, 2) + '\n',
    ),
    fs.promises.writeFile(
      localeFilePath,
      JSON.stringify(newMessageMap, null, 2) + '\n',
    ),
  ])
}

/**
 * 启动
 */
const generate = async () => {
  console.log('start to generate locale files!')
  console.time('process')

  // 文件取值处理需要按序进行，才能正确的比较所有文件的重复情况
  const executeStack = [
    ...apps.map(
      appName => () =>
        executeMessages(path.resolve(appDirPath, appName, 'src')),
    ),
    ...packages.map(
      packageName => () =>
        executeMessages(path.resolve(packageDirPath, packageName)),
    ),
  ]

  const execute = () => {
    let i = 0

    return new Promise((resolve, reject) => {
      const recursive = () => {
        executeStack[i]()
          .then(() => {
            if (executeStack[++i]) {
              recursive(resolve)
            } else {
              // 取值完毕后，开始输出
              const outputPromissArr = []

              Promise.all(outputPromissArr).then(() => {
                // 最后输出一个提供给翻译人员使用的 excel 文件

                // 准备数据
                const excelMessageMap = {
                  ...allMessageMap,
                  ...allEnMessageMap,
                }

                // 构建 Excel
                const wb = new xl.Workbook()
                const ws = wb.addWorksheet('Sheet 1')
                ws.column(1).setWidth(50)
                ws.column(2).setWidth(50)

                // 说明
                ws.cell(1, 1, 1, 2, true)
                  .string(
                    '⚠️注意：中文文本中以大括号「{}」包裹的英文单词为变量元素，由程序自动填充，翻译时注意保留变量。\n举例：「当前省份：{currentProvince}」，其对应的翻译文本为：「Current Province: {currentProvince}」',
                  )
                  .style({
                    font: {
                      size: 16,
                      bold: true,
                    },
                    alignment: {
                      wrapText: true,
                    },
                  })
                ws.row(1).setHeight(100)

                // 表头
                const headerStyle = wb.createStyle({
                  font: {
                    size: 14,
                    bold: true,
                  },
                  alignment: {
                    vertical: 'center',
                  },
                })

                ws.cell(2, 1).string('中文文本').style(headerStyle)
                ws.cell(2, 2).string('翻译文本').style(headerStyle)

                ws.row(2).setHeight(40)

                const cellStyle = wb.createStyle({
                  font: {
                    size: 12,
                  },
                  alignment: {
                    wrapText: true,
                    vertical: 'center',
                  },
                })
                Object.entries(excelMessageMap).forEach(
                  ([key, value], index) => {
                    const rowIndex = index + 3
                    ws.cell(rowIndex, 1).string(key).style(cellStyle)

                    // 仅填充存在的翻译的值
                    if (key !== value) {
                      ws.cell(rowIndex, 2).string(value).style(cellStyle)
                    }

                    ws.row(rowIndex).setHeight(26)
                  },
                )

                wb.write(
                  path.resolve(
                    packageDirPath,
                    'locale/locales/Chalk-3-Translation.xlsx',
                  ),
                )

                resolve(undefined)
              })
            }
          })
          .catch(e => {
            reject(e)
          })
      }

      recursive(resolve)
    })
  }

  try {
    await execute()
  } catch (e) {
    console.error(e)
  }

  console.timeEnd('process')
  console.log('generate success!')
}

generate()
