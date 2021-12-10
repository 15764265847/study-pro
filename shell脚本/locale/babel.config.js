// 随意的配置一些 babel 环境和插件，满足 @seiue/formatjs-cli 的执行即可
module.exports = {
  presets: [
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  plugins: [
    'css-modules-transform',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
}
