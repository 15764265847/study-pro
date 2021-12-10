/**
 * @file
 * 生成旧 sdk 前将已完全使用 sdk-next 不再依赖旧 sdk 的 api group
 * 从 doc.json 中移除。
 * 新增的 api group 均会通过 sdk-next 而非旧 sdk 被使用。
 */

const glob = require('glob')
const { join } = require('path')
const { camelCase } = require('lodash')
const { readFileSync, writeFileSync } = require('fs')
const [, , docFile, server] = process.argv
const root = join(__dirname, '../..')

const doc = require(join(root, docFile))

const srcFiles = [
  ...glob.sync(join(root, 'apps/*/src/**/*.@(js|jsx|ts|tsx)')),
  ...glob.sync(join(root, 'packages/src/**/*.@(js|jsx|ts|tsx)')),
]

const importExp = new RegExp(
  `import {([a-zA-Z0-9,\\s]+?)} from 'packages\/sdks\/${server}'`,
)
const suffixExp = /Api(AxiosParamCreator)?$/

// 生成 group api 是否被使用的 map
const usageMap = srcFiles.reduce((map, file) => {
  const content = readFileSync(file, 'utf8')
  const importStatements = content.match(new RegExp(importExp, 'g'))

  return !importStatements
    ? map
    : importStatements.reduce((m, stmt) => {
        stmt
          .match(importExp)[1]
          .split(/[,\s]+/)
          .filter(imp => imp.match(suffixExp))
          .forEach(apiTag => {
            map[camelCase(apiTag.replace(suffixExp, ''))] = true
          })
        return map
      }, map)
}, {})

// 在 doc.json 中删除未被使用的 api group
Object.entries(doc.paths).forEach(([path, pval]) => {
  Object.entries(pval).forEach(([action, aval]) => {
    const tag = camelCase((aval.tags && aval.tags[0]) || 'default')
    if (!usageMap[tag]) delete pval[action]
  })
  if (!Object.keys(pval).length) delete doc.paths[path]
})

// 保存新的 doc.json
writeFileSync(join(root, docFile), JSON.stringify(doc))
