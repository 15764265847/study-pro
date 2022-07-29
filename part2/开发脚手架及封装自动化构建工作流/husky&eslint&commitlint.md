## husky 提交eslint校验支持
### 1. 安装 husky && lint-staged && commitlint
```js
yarn add husky -D
yarn add lint-staged@10.0.0 -D // lint-staged 对node版本有要求

// commitlint & 规范
yarn add @commitlint/cli @commitlint/config-conventional -D
```
## 2. 配置
### （1）husky
> 命令行
```js
npm set-script prepare "husky install"
npm run prepare
npx husky add .husky/pre-commit "npm run lint"
git add .husky/pre-commit
```
### （2）lint-staged
> package.json
```js
"scripts": {
  "lint": "lint-staged"
}
"lint-staged": {
  "src/**/*.js": [
    "eslint",
    "git add"
  ],
  "src/**/*.vue": [
    "eslint --fix",
    "git add"
  ]
}
```

### （3）commitlint
> husky钩子支持
```
yarn husky add .husky/commit-msg 'yarn commitlint --edit "$1"'
```
> 项目根目录 新增 .commitlintrc.js 文件
```
module.exports = {extends: ['@commitlint/config-conventional']}
```
### 提交规范说明
> 格式
```
git commit -m <type>[optional scope]: <description>
```
> 说明
1. type ：用于表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档？ 
2. optional scope：一个可选的修改范围。用于标识此次提交主要涉及到代码中哪个模块。
3. description：一句话描述此次提交的主要内容，做到言简意赅。

> type类型说明

1. build:	编译相关的修改，例如发布版本、对项目构建或者依赖的改动
2. feat:	新特性、新功能
3. fix:	修改bug
4. perf:	优化相关，比如提升性能、体验
5. chore:	其他修改, 比如改变构建流程、或者增加依赖库、工具等
6. ci:	持续集成修改
7. docs:	文档修改
8. refactor:	代码重构
9. revert:	回滚到上一个版本
10. style:	代码格式修改, 注意不是 css 修改
11. test:	测试用例修改

## 优化提交步骤
### 插件安装
```
yarn add commitizen -D
yarn add cz-emoji -D
```

### 提交命令配置
```
package.json

"scripts": {
  "commit": "git-cz"
},
```
### 配置文件 .czrc
```
{
  "path": "./node_modules/cz-emoji",
  "config": {
    "cz-emoji": {
      "subjectMaxLength": 200,
      "types": [
        {
          "emoji": "📦️",
          "code": "build:",
          "description": "编译相关的修改，例如发布版本、对项目构建或者依赖的改动",
          "name": "build"
        },
        {
          "emoji": "✨",
          "code": "feat:",
          "description": "新特性、新功能",
          "name": "feat"
        },
        {
          "emoji": "🐛",
          "code": "fix:",
          "description": "修改bug",
          "name": "fix"
        },
        {
          "emoji": "🚀",
          "code": "perf:",
          "description": "优化相关，比如提升性能、体验",
          "name": "perf"
        },
        {
          "emoji": "🔧",
          "code": "chore:",
          "description": "其他修改, 比如改变构建流程、或者增加依赖库、工具等",
          "name": "chore"
        },
        {
          "emoji": "📝",
          "code": "docs:",
          "description": "文档修改",
          "name": "docs"
        },
        {
          "emoji": "💩",
          "code": "refactor:",
          "description": "代码重构",
          "name": "refactor"
        },
        {
          "emoji": "⏪",
          "code": "revert:",
          "description": "版本回滚",
          "name": "revert"
        },
        {
          "emoji": "🎨",
          "code": "style:",
          "description": "代码格式修改",
          "name": "style"
        },
        {
          "emoji": "✅",
          "code": "test:",
          "description": "测试用例修改",
          "name": "test"
        },
        {
          "emoji": "👷",
          "code": "ci:",
          "description": "持续集成修改",
          "name": "ci"
        }
      ],
      "skipQuestions": ["body", "breaking", "issues"]
    }
  }
}
```
