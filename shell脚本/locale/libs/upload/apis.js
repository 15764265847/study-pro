/**
 * @file 语言上传相关
 */
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const chalk = require('chalk')

const axios = require('axios')

const { rootPath } = require('../const')
const { catchErrorAndExit } = require('./utils')

// 初始化当前的环境变量
require(path.resolve(rootPath, 'env/set-envfile'))

/**
 * 构造可向后端服务发起请求的 Axios 实例
 */
const getAxiosInstanceWithSecret = async () => {
  const { SERVER_PLATFORM, CLIENT_APP_CLIENT_ID, CLIENT_APP_CLIENT_SECRET } =
    process.env

  return catchErrorAndExit(async () => {
    const { data: credential } = await axios.post(
      `${SERVER_PLATFORM}/oauth/token`,
      {
        grant_type: 'client_credentials',
        client_id: CLIENT_APP_CLIENT_ID,
        client_secret: CLIENT_APP_CLIENT_SECRET,
      },
    )

    return axios.create({
      headers: {
        'Content-Type': 'application/json',
        'X-School-Id': 0,
        Authorization: `Bearer ${credential.access_token}`,
      },
    })
  })
}

/**
 * 获取当前系统的版本
 */
const getCurrentVersion = async () => {
  return Number(process.env.CHALK_LOCALE_VERSION)
}

/**
 * @file 获取最新的文本
 */
const getLaststLocaleTexts = async () => {
  console.log('正在获取线上最新版本的语言包')
  const axiosInstance = await getAxiosInstanceWithSecret()
  const currentVersion = await getCurrentVersion()

  if (!currentVersion) return []

  return catchErrorAndExit(async () => {
    const { data } = await axiosInstance.request({
      method: 'get',
      url: `${process.env.SERVER_CHALK}/i18n/locale-texts/versions/${currentVersion}/locale/sys?belongs_to=fe&school_id=0`,
    })

    console.log('获取成功')
    return data
  })
}

/**
 * 创建一个新的版本
 * @param {LocaleTextReq[]} textData
 */
const createNewVersion = async textData => {
  console.log('开始新建版本')
  const nextVersion = (await getCurrentVersion()) + 1

  const axiosInstance = await getAxiosInstanceWithSecret()

  catchErrorAndExit(async () => {
    await axiosInstance.request({
      method: 'post',
      url: `${process.env.SERVER_CHALK}/i18n/locale-texts/versions/${nextVersion}`,
      data: textData,
    })
  })

  const isProd = process.env.ENV === 'production'
  const localeVersionFileName = isProd
    ? '.locale-version'
    : '.locale-version.dev'
  const localeVersionPath = path.resolve(
    process.cwd(),
    '../../env/',
    localeVersionFileName,
  )

  // 开始修改版本号
  const versionContent = fs
    .readFileSync(localeVersionPath, 'utf-8')
    .replace(
      /CHALK_LOCALE_VERSION=([0-9]+)/,
      `CHALK_LOCALE_VERSION=${nextVersion}`,
    )

  fs.writeFileSync(localeVersionPath, versionContent, 'utf-8')

  childProcess.execSync(`git add ${localeVersionPath}`)

  console.log('新建成功，当前版本为', nextVersion)
  console.log(chalk.bold.red('将版本变更的 commit merge 至 matser 分支。'))
}

/**
 * 将新增文本同步进当前版本库
 * @param {LocaleTextReq[]} textData
 */
const syncCurrentVersion = async textData => {
  console.log('开始同步当前版本库')
  const currentVersion = await getCurrentVersion()

  const axiosInstance = await getAxiosInstanceWithSecret()

  catchErrorAndExit(async () => {
    await axiosInstance.request({
      method: 'put',
      url: `${process.env.SERVER_CHALK}/i18n/locale-texts/versions/${currentVersion}`,
      data: textData,
    })

    console.log('同步成功！当前版本为', currentVersion)
  })
}

module.exports = {
  createNewVersion,
  getLaststLocaleTexts,
  syncCurrentVersion,
}
