## 克隆 chakra-ui 到本地项目
  - 使用 npx chakra-cli init --theme 克隆 chakra-UI 的主题到本地项目，不需要自己进行手动配置
## react 17 版本使用 emotion 时存在一个问题
  - 不能使用 css props 返回值，如下示例 将会导致抛出如下错误
    1. 错误
      You have tried to stringify object returned from css function. It isn’t supposed to be used directly (e.g. as value of the className prop), but rather handed to emotion so it can handle it (e.g. as value of css prop).

    2. 示例
      import { jsx, css } from '@emotion/react'

      const GreenText = css`
        color: green;
      `

      export default function Home() {
        return (
          <div css={GreenText}>Css props style</div>
        )
      }
  
  - 解决方式有两种 
    1. 使用旧版手动导入运行时
      /** @jsxRuntime classic */ 使用旧版传统模式手动导入运行时
      /** @jsx jsx */ 
      import { css, jsx } from '@emotion/react'

      @jsxRuntime classic: 使用旧版传统模式手动导入运行时
      @jsx jsx: 指明下一行为运行时的导入
      
    2. 使用 babel 转译插件 yarn add -D @emotion/babel-preset-css-prop

      const { addBabelPreset } = require('customize-cra')

      module.exports = {
        webpack: override(
          // emotion css props support
          addBabelPreset('@emotion/babel-preset-css-prop')
        )
      }

      PS: Next.js 中直接创建 .babelrc 文件 添加配置即可
        {
          "presets": ["next/babel","@emotion/babel-preset-css-prop"]
        }

## react + chakra-ui + emotion + Nextjs 基础项目搭建

### 1. 创建项目
` npm init next-app react-next-movie`


### 2. 安装 chakra-ui 框架 及 主题
` yarn add  @chakra-ui/core`
` yarn add  @chakra-ui/react`
` yarn add  @chakra-ui/theme`
` yarn add  @chakra-ui/react`
安装 `@chakra-ui/react`的依赖包 `yarn add @emotion/react @emotion/styled`

### 3. 克隆主题
- 没有克隆主题: 使用依赖包的形式 `import theme from "@chakra-ui/theme";`
- 
### 4. 配置主题
- 在 `pages` 文件夹下建立` _app.js `加入如下代码
```js
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import theme from "@chakra-ui/theme";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp;

```
### 5. 安装 字体图标
  `yarn add react-icons`

### 6. 安装 @babel/core
`yarn add @babel/core`

### 7. 安装 emotion 预置
`@emotion/babel-preset-css-prop`

### 8. 添加 babel 配置
  在根目录下创建 .babelrc 文件并添加如下代码
```json
{
    "presets":  ["next/babel","@emotion/babel-preset-css-prop"]
}
```

## 以下为当前使用的依赖版本
  "dependencies": {
    "@babel/core": "^7.14.0",
    <!-- "@chakra-ui/core": "^0.8.0", --> 这一行是不需要的，因为 @chakra-ui/react 就是改名后的 @chakra-ui/core ，@chakra-ui/core有的 @chakra-ui/react 
    "@chakra-ui/react": "^1.6.1",
    "@chakra-ui/theme": "^1.8.5",
    "@chakra-ui/theme-tools": "^1.1.7",
    "@emotion/babel-preset-css-prop": "^11.2.0",
    "@emotion/react": "^11.4.0",  @emotion/react 这里也是和 @chakra-ui/react 类似，他有低版本为 @emotion/core ，目前最新版本使用的是 @emotion/react ，不需要使用 @emotion/core
    "@emotion/styled": "^11.3.0",
    "chakra-ui": "^0.3.9",
    "framer-motion": "^4.1.11",
    "next": "10.2.0",
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "react-icons": "^4.2.0"
  },
  "devDependencies": {}

## 导出静态页面
  - next export  该命令会在根目录下生成 out 文件夹，这里面所有的文件就是生成的静态的 html css js ，可以直接放到对应的静态目录中访问
    例如我们 在 express 中 app.use(express.static('public')) 我们就可以那以上静态文件扔到对应的 public 目录中，通过自己的本地服务访问

## 自定义服务 
  - https://www.nextjs.cn/docs/advanced-features/custom-server 官方文档给出的实例，是使用原生写的
  - express 版
    const express = require('express')
      const next = require('next')

      const dev = process.env.NODE_ENV === 'production'

      // next是一个函数，接收一个配置对象
      // 这里只用到了一个 dev 参数 表示环境变量配置 当时是否是 dev 环境
      const nextApp = next({dev})

      const handler = nextApp.getRequestHandler()

      app.prepare().then(() => {
        const server = express()
        server.get('*', (req, res) => {
          handler(req, res)
        })
        server.listen(4000, () => {
          console.log('自定义next服务启动啦')
        })
      })


