/**
 * @file 根据 feature 里的 @module 注释来获取 feature 名称
 */
const fs = require('fs')
const path = require('path')
const { appsIncluded } = require('./config')
const { appDirPath, packageDirPath } = require('./paths')

const featureLabelMap = {}

const getFeatureRegexp = () => /@module\s([^\s.]*)\s/i

const getFeatureLabelMap = () => {
  if (Object.keys(featureLabelMap).length) {
    return featureLabelMap
  }

  // 获取项目中所有的 Features 主目录
  const featureDirPaths = [
    path.resolve(packageDirPath, 'features'),
    ...appsIncluded.map(appName => {
      return path.resolve(appDirPath, appName, 'src/features')
    }),
  ]

  // 获取所有的 feature 的入口文件
  const featureIndexPaths = featureDirPaths.reduce((result, featureDirPath) => {
    try {
      const _paths = fs.readdirSync(featureDirPath)
      _paths.forEach(_path => {
        try {
          const innerFiles = fs.readdirSync(path.resolve(featureDirPath, _path))
          const indexFile = innerFiles.find(fileName =>
            fileName.startsWith('index'),
          )
          if (indexFile) {
            result.push(path.resolve(featureDirPath, _path, indexFile))
          }
        } catch (e) {}
      })
    } catch (e) {}

    return result
  }, [])

  // 从入口文件中，取出中文名称
  featureIndexPaths.forEach(indexPath => {
    const indexFile = fs.readFileSync(indexPath, 'utf8')
    const matchResult = getFeatureRegexp().exec(indexFile)

    if (matchResult && matchResult[1]) {
      const pathArr = indexPath.split('/')
      const featureName = pathArr[pathArr.length - 2]
      if (!featureLabelMap[featureName]) {
        featureLabelMap[featureName] = matchResult[1]
      }
    }
  })

  return featureLabelMap
}

const fileFeatureLabelMap = {}
const initFileFeatureLabelMap = files => {
  if (Object.keys(fileFeatureLabelMap).length) return fileFeatureLabelMap

  files.forEach(filePath => {
    const indexFile = fs.readFileSync(filePath, 'utf8')
    const matchResult = getFeatureRegexp().exec(indexFile)

    if (matchResult && matchResult[1]) {
      fileFeatureLabelMap[filePath] = matchResult[1]
    }
  })
}

const getFileFeatureLabel = path => fileFeatureLabelMap[path]

module.exports = {
  getFeatureLabelMap,
  initFileFeatureLabelMap,
  getFileFeatureLabel,
}
