### nuxtjs 三种模式
  1. 服务端渲染
  2. 也支持客户端渲染
    根目录下新建 nuxt.config.js
      export default {
        ssr: false
      }
  3. 静态网页生成 SSG
    根目录下新建 nuxt.config.js
      export default {
        <!-- ssr: false, -->
        target: 'static'
      }

  4. 部署到 vercel  nuxtjs官方文档中有具体的安装方式
    链接： https://nuxtjs.org/faq/now-deployment

  5. vuePress vue驱动的静态网站生成器