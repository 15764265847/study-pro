/**
 * 更新语言版本库
 */
const chalk = require('chalk')

const {
  getNewLocaleTexts,
  convertTextsToMap,
  getTextIdForDiff,
  beforeUpload,
} = require('./utils')

const { getLaststLocaleTexts, createNewVersion } = require('./apis')

;(async function () {
  beforeUpload()

  const newLocaleTexts = getNewLocaleTexts()

  // 获取服务器上最新的语言包
  const laststLocaleTexts = await getLaststLocaleTexts()

  // 服务器上没有数据？直接创建一个新版本
  if (!laststLocaleTexts.length) {
    console.log('当前版本没有数据')
    await createNewVersion(newLocaleTexts)
    return
  }

  const newLocaleTextMap = convertTextsToMap(newLocaleTexts)

  const hasDeletedText = laststLocaleTexts.find(text => {
    return !newLocaleTextMap[getTextIdForDiff(text)]
  })

  // 如果存在被删除的文本，这意味着产生了 Breaking Change，所以新建版本
  if (hasDeletedText) {
    console.log('存在被删除的文本，开始创建新的版本库')
    await createNewVersion(newLocaleTexts)
    return
  }

  console.log(
    chalk.yellow(
      '没有任何 Breaking Change 发生，不进行版本的提升。如果你想要上传新增文本，请执行 locale:upload。',
    ),
  )
})()
