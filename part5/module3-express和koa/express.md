### JSON
  1. JSON.stringify格式化的数据有回车换行等格式  JSON.stringify(data, null, '  ')

### AOP 面向切面编程
  - 概念： 在现有的程序代码中，在程序生命周期或者横向流程种添加或者减去一个或者多个功能，不影响其他的功能

### 中间件 next
  1. 可传参数
    - 只可以在路由器中间件种使用，next('route') 意思是路由器中间件执行栈种的其余中间件，执行下一条路由的中间件
    - 示例，当请求路径为 /1 时，会跳过 second 中间件，去执行 third 中间件
        app.get('/:id', function first(req, res, next) {
            if (res.params.id === '1') {
                next('route')
            } else {
                next()
            }
        }, function second(req, res, next) {
            console.log('')
            next()
        })

        app.get('/:id', function third(req, res, next) {
            console.log('')
            next()
        })
  2. 中间件可以数组的形式传入，组成一个内部的子执行栈
    - 示例 , 中间件 first second third 回依次执行
        function first (req, res, next) {console.log('first');next()}
        function second (req, res, next) {console.log('second');next()}

        const stack = [first, second]

        app.get('/:id', stack, function third(req, res, next) {
            console.log('third')
            res.end('wancheng')
            next()
        })

### 常用中间件 https://www.expressjs.com.cn/resources/middleware.html
  1. compression 压缩请求，开启 gzip

### 路由
  1. app.all('/secret', (req, res, next) => {
      console.log(req)
      next()
  }) 所有以 /secret 打头的路径都会走这个

### 大量node资源 https://github.com/sindresorhus/awesome-nodejs

### express 推荐接口数据验证包
  - express-validator 文档地址 https://express-validator.github.io/docs


