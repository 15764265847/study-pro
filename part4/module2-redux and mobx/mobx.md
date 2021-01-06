### 简介
  状态管理库，react负责渲染应用状态，mobx负责对状态进行管理

### 使用，由于 mobx 使用了装饰器语法，但实际浏览器并不支持装饰器语法，所以这里我们使用第三方插件来支持一下
  1. 使用 yarn eject 弹射出项目的底层配置
    - 下载 babel 插件 yarn add @babel/plugin-proposal-decorators

    - 可以在 package.json 中加入对应配置
    - package.json 
      "babel": {
        "plugins": [
          [
            "@babel/plugin-proposal-decorators",
            {
              "legacy": true
            }
          ]
        ]
      }

  2. 使用 react-app-rewired 以及 customize-cra 来扩展被 create-react-app 脚手架封装的配置项
      1. yarn add react-app-rewired customize-cra
      2. 根目录下添加 config-overrides.js
        const { override, addDecoratorsLegacy } = require('customize-cra');
        module.exports = override(addDecoratorsLegacy())
      3. 使用 react-app-rewired 来替换 package.json 中的 create-react-app 启动命令
        "start": "react-app-rewired start",
        "build": "react-app-rewired build",
        "test": "react-app-rewired test",

  3. 解决 vscode 编辑器对于装饰器语法的警告
    左下角 设置 - settins 修改配置 "javascript.implicitProjectConfig.experimentalDecorators": true
  
  4. yarn add mobx mobx-react