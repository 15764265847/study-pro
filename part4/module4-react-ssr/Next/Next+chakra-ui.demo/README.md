# react + chakra-ui + emotion + Nextjs 基础项目搭建

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
