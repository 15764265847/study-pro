/**
 * @file 多语言上传脚本工具函数
 */
const fs = require('fs')
const { localeCachePath } = require('../const')
const chalk = require('chalk')

/**
 * 获取 text id，我们以 模块_内容 为 text 唯一值
 * @param {*} text
 */
const getTextIdForDiff = text => {
  return `${text.module}_${text.content}`
}

/**
 * 将文本数组转化为 Object，方便查询
 * @param {*} texts
 */
const convertTextsToMap = texts => {
  return texts.reduce((result, text) => {
    return {
      ...result,
      [getTextIdForDiff(text)]: text,
    }
  }, {})
}

const isProd = () => process.env.ENV === 'production'

const beforeUpload = () => {
  console.log(
    chalk.green(`开始上传本地语言包至${isProd() ? '生产环境' : '开发环境'}`),
  )

  const isLocaleCacheExist = fs.existsSync(localeCachePath)

  if (!isLocaleCacheExist) {
    console.log(
      chalk.red(
        `本地文件包：${localeCachePath} 不存在，请先执行 generator 脚本`,
      ),
    )
    process.exit(1)
  }
}

const getNewLocaleTexts = () =>
  JSON.parse(fs.readFileSync(localeCachePath, 'utf-8'))

const catchErrorAndExit = async callback => {
  try {
    const result = await callback()
    return result
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

module.exports = {
  getTextIdForDiff,
  convertTextsToMap,
  isProd,
  beforeUpload,
  getNewLocaleTexts,
  catchErrorAndExit,
}
