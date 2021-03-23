### css-in-js 
  - 优点
    1. 使css拥有独立作用域，即css只应用于对应的组件，不会造成样式冲突
    2. 让组件更具有可移植性，实现开箱即用，轻松创建松耦合应用程序
    3. 让组件更具可重用性，不仅可以在当前项目中使用还可以在使用了相同框架的项目中使用
    4. 让css具有动态性，可将复杂的逻辑应用于css样式。如果需要创建复杂的动态ui，这就是最理想的解决方案
  - 缺点
    1. 对项目而言增加了额外的复杂性
    2. 自动生成的选择器可读性很低

### Emotion 是一个旨在使用js编写css的库
  - 需要安装 @emotion/core @emotion/styled
  - 配置 babel
    1. 告诉 babel 不再需要转换 jsx 语法为 React.createElement 方法，而是转换为 jsx 方法
      例如 
        由    <img src=""> => React.createElement('img', { src: '' }) 
        变为  <img src=""> => jsx('img', { src: '' }) 
      使用注释的方式 
        /** @jsx jsx*/
        import { jsx } from '@emotion/core'
    
    2. babel 配置项 , 需要通过 npm run eject 弹射出底层配置
      presets: [
        'react-app',
        '@emotion/babel-preset-css-prop'
      ]
### emotion 特性
  - 组件的 props.css 属性优先级高于 组件内部使用的 css
  - styled component ,  import styled from '@emotion/styled'  styled.div`width: 100px;`

  PS：emotion 也有 styled component 的特性 ，另外有一个叫做 styled-component 的库是专门来做样式组件的