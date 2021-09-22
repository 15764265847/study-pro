/**
 * @file 对比本地语言包和线上语言包，然后决定是否上传
 */
const { getLaststLocaleTexts, syncCurrentVersion } = require('./apis')
const chalk = require('chalk')
const {
  getNewLocaleTexts,
  convertTextsToMap,
  getTextIdForDiff,
  beforeUpload,
} = require('./utils')

/**
 * 上传新增的语言
 */
;(async function updateLocale() {
  beforeUpload()

  const newLocaleTexts = getNewLocaleTexts()

  // 获取服务器上最新的语言包
  const laststLocaleTexts = await getLaststLocaleTexts()

  if (!laststLocaleTexts.length) {
    console.log(
      chalk.red(
        '当前版本没有数据，请参照 https://www.yuque.com/kovru3/gfdy75/gon1ko#wjvx6 进行语言版本升级。',
      ),
    )
    process.exit(1)
  }

  const newLocaleTextMap = convertTextsToMap(newLocaleTexts)
  const deletedTextCount = laststLocaleTexts.filter(text => {
    return !newLocaleTextMap[getTextIdForDiff(text)]
  }).length

  // 无效文本警告值，当线上文本库的无效文本超过此数目时，予以提示。
  const WARNING_LIMIT = 100

  if (deletedTextCount > WARNING_LIMIT) {
    console.log(
      chalk.yellow(
        `当前线上语言库的文本已有超过${WARNING_LIMIT}条文本在项目中不存在，请参照 https://www.yuque.com/kovru3/gfdy75/gon1ko#wjvx6 进行语言版本升级。`,
      ),
    )

    // 仅在 CI 处阻止上传
    if (process.env.CI) {
      process.exit(1)
    }
  }

  const laststLocaleTextMap = convertTextsToMap(laststLocaleTexts)
  const addedTexts = newLocaleTexts.filter(text => {
    return !laststLocaleTextMap[getTextIdForDiff(text)]
  })

  if (!addedTexts.length) {
    console.log('没有文本发生改变')
    console.log(chalk.green('上传结束'))
  } else {
    console.log('存在新增的文本')
    await syncCurrentVersion(addedTexts)
  }
})()
