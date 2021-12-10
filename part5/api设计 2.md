### api 携带版本版本号
  1. url  例： /v1/xxx/xxx
  2. 查询参数  例： /xxx/xxx?version=v1
  3. http请求头

### 数据库相关知识
  1. 关系型数据库 
    - 甲骨文的 Oracle
    - 微软的 MS SQL Server
    - PostgresSQL
    - Access
  2. 非关系型数据库
    - MongoDB 文档型数据库 存储为类似js对象的数据 持久化数据存储
    - Redis key-value存储 主要是用来作数据缓存，也能够进行数据持久化，主要是用来提高查询获取数据的速度
    - HBase 列存储 高级数据库
    - FlockDB 图存储
    - db4o 对象存储
    - BaseX XML存储 

  3. MySQL 安装后配置的问题 配置环境变量不管用 
    - https://www.jianshu.com/p/4d6a171df3d0
    - 通过官网下载可视化界面安装的 
    - 安装后需要配置其环境变量才能够使用 ！！！！ 
      ！！！！！！！！此处很重要 
      配置环境变量的时候首先要知道我们使用的是什么样的 shell 工具 
      使用 echo $SHELL 会输出使用的 shell 类型 
      此电脑使用 echo $SHELL 会输出 /bin/zsh 即使用的是 Bourne Shell 的一个变种 
      Mac OS X 10.2之前默认的是C Shell。 
      Mac OS X 10.3之后默认的是Bourne Shell。 
      所以我这里添加环境变量应该是在 ~/.zshrc 文件中添加环境变量
      加完之后使用 source ~/.zshrc 运行一下就可以正常使用对应的命令了
    - 这里我们使用 navicat 可视化工具来管理 MySQL，navicat 工具和 Robo 3T 工具类似
    - sequelize 工具库用来操作 mysql 
      要使用 sequelize 工具库操作 mysql 必须安装 mysql 的驱动，这里我们安装了 mysql2 ， 该包就是 mysql 驱动库

### 密码保存 使用 bcryptjs 进行密码加盐加密
  - const bcrypt = require('bcryptjs')
  1. const salt = bcrypt.genSaltSync(10) 调用该方法生成盐，方法的参数表示生成该盐需要计算机耗费多大的成本，数字越大计算机消耗成本越多，当然成本越高，安全性越高。通常取默认值就可以
  2. 数据库不能明文存储密码，需要加盐且加密，相同的密码加密之后也应该是不同的，这样可以有效防止【彩虹表攻击】

### 数据库设计 实体表与业务表
  1. code first 
    - 思考model而不是表，通过model自动创建对应的表
  2. 实体表 即对我们生活中的实物的映射，比如说电影啊，书记啊，音乐啊，这些都是一类可以在生活中找到的东西，是纵向的，一类就是一个纵向的
  3. 业务表 即概念性的，比如说音乐这个东西就有很强的地域性，比如云南的山歌，陕西的歌，他们是不一样的，我们可以创建一张地域的表来标记每个音乐所具有的地域性
    再比如期刊这种，期刊是一期一期发售的，那么他就天然拥有一个时间上的概念，每一期和每一期是不一样的，那么我们就可以创建一个 期 的表，其中记录了我们发售的所有期，而所有的期刊都有对应的 期 的id，这样我们就可以横向使用 期 的概念来标记每一期的东西

### 使用 basicAuth 进行 token 验证
  1. 请求头中添加 Authorization 头，值为 使用base64加密的  [account]:[password]  完整形式如下
          Authorization: Basic base64(account:password)
        由于此处项目使用 token 所以我们使用的是 生成的 token + : 之后字符串进行加密
  2. 后端（nodejs）验证时可使用 basic-auth 包将请求头的 Authorization 头的信息解析成一个对象，token 就存在这个对象中

### 序列化
  1. const data = Amodel.findOne(); 
    其最终数据存储在 data.datavalues 中，并且获取到数据后想添加一些其他字段也只能在 data.datavalues 中添加才可以 
    即返回的json 序列化时使用的是 data.dataValues 的数据，而不是 data 

  2. 我们可以使用 data.setDataValue(key, value) 来添加字段 

### 数据库事务
  1. 概念 总是能保证某一些需要同时执行的任务的执行，如果都成功，事务执行成功，如果其中某一个失败，则撤销已完成的全部操作，保证数据一致性
    例如：点赞操作，我们可能会需要针对当前用户生成一个点赞记录，也需要对点赞的数量进行修改，但是他们操作的可能不是同一张表，这样就会容易出现其中一个操作完成了，但是另一个操作却失败了，这样点赞的记录和点赞的数量就对不上了，就造成了数据的不一致

### ACID 一个好的数据库设计会遵循着四条
  A 原子性
  C 一致性
  I 隔离性
  D 持久性

### JSON序列化
  使用 JSON.stringify 将对象序列化时，会先看该对象下是否定义了 toJSON 方法，如果定义了则会将该方法中返回的数据进行序列化，如果没有定义，则直接序列化原始数据
  例
  const obj = {
    a: 1,
    b: 2
  }
  JSON.stringify(obj) // {"a":1,"b":2}

  const obj2 = {
    a: 1,
    b: 2
    toJSON() {
      return {
        name: 'john'
      }
    }
  }
  JSON.stringify(obj2) // {"name":"john"}

### api 垂直切割和水平切割
  1. 水平切割  将服务部署多份，可以进行负载均衡
  2. 垂直切割  将不同的功能模块分开部署
  两者相融合  将高负载的功能模块的服务单独成一个小的服务，然后部署多份使其可以进行负载均衡

### 关系型数据库和非关系型数据库相辅相成
  1. 主为关系型数据库 辅为非关系型
  2. Elastic Search 弹性搜索，用于做模糊检索

### 减少最终穿透到数据的请求，才是优化数据库性能的王道
  因为数据库优化会有极限，优化到一定程度就没有啥提升空间了，所以才会有redis缓存这一层，用来缓存数据，当请求跑到这一层就确定的需要返回的数据，直接返回
  不需要进行查库

### REST 的六个限制和若干最佳实践
  1. REST 是什么？ REST是一种风格，万维网软件架构风格，用来创建网络服务
  2. 为啥叫 REST ？ Representational State Transfer 
    - Representational ：表现法 表现形式   在 REST 中表示数据的表现形式（JSON、XML.....） JSON 使用最多
    - State ：状态   在 REST 中表示当前的状态或者数据  每一种变化
    - Transfer ：传输   在 REST 中表示数据在互联网中的传输
  3. 六个限制
    - CS架构 （client-server  客户端-服务端）关注点分离 
      - 服务端专注数据存储，提升了简单性 
      - 前端专注用户界面，提升了可移植性
    - 无状态  Stateless 
      - 所有的用户会话信息都保存在了客户端 
      - 每次请求都必须包含所有的信息，不能依赖上下文信息 
        - 例：比如看小说，我现在看完了第一页，我想要看第二页，我需要跟后端请求第二页的数据，这时候我们不能告诉后端我们要看下一页，后端不能理解下一页这个东西，但是他可以精确的理解我要看第二页这个东西
      - 服务端不用保存会话信息，提升了简单性、可靠性、可见性
    - 缓存
      - 所有的的服务端的响应都必须标为 可缓存 和 不可缓存
      - 减少前后端交互 提升请求性能
    - 统一接口
      - 统一接口的限制 即REST要设计成啥样
        1. 资源是任何可以命名的事物，比如用户、评论等
        2. 每个资源可以通过 URI 被唯一的标识
          - github 用户接口 https://pi.github.com/users
          - 请求一个特定的用户 https://pi.github.com/users/lewis617 即在url中添加 userid 
        3. 通过表述来添加资源
          - 客户端不能直接操作数据库
          - 客户端只能通过表述来操作资源 JSON
            1. 描述数据的 JSON 数据
        4. 自描述消息
          - 每个消息必须提供足够的信息来让接受者理解
            1. content-type 头  值为 application/json
            2. HTTP 请求方法 POST 增  patch 部分修改 DELETE 删  put 全部修改
        5. 超媒体作为应用状态引擎
          - 点击链接跳转到另一个网页
      - 统一 接口设计尽可能的统一、通用，提升简单性和可见性
      - 接口 接口与实现解耦，前后端分离
    - 分层系统 Layered System
      - 每一层只知道相邻的一层，后面隐藏的就不知道了
      - 客户端不知道是在和代理还是真实服务器通信
      - 其它层：安全层、负载均衡、缓存层等
    - 按需代码
      - 客户端可以下载执行服务端传来的代码
      - 通过较少一些代码简化了客户端，提升客户端简单性

### RESTful 
  1. 是什么？ REST 风格的 API
  2. 设计规范
    - 使用名词，尽量用复数  /users
    - 嵌套表示关联关系  /users/12/repos/5
    - 使用正确的HTTP方法  如 GET/POST等
    - 不符合 CRUD（增删改查） 的情况
      1. POST 方法 /动作/资源id

### 仿知乎api这里为啥用 NoSQL
  - 简单，没有 ACID A 原子性  C 一致性  I 隔离性  D 持久性
  - 便于横向拓展，部署多台服务器。原因就是因为简单不具备 ACID ，多台服务器部署时不需要考虑ACID，也就不需要考虑为保持ACID所做的通讯等等复杂的操作
  - 适合超大规模的数据存储
  - 灵活的存储复杂的数据结构

### 啥是 MongoDB
  - 来自英文单词 Humongous ，中文意思为 庞大
  - 面向文档存储 即一个文档为一个 JSON
  - 用 C++ 编写而成

### 为啥用 MongoDB
  - 性能好（内存计算）
  - 大规模数据存储（可拓展信好）
  - 可靠安全（本地复制，自动故障转移）
  - 方便存储复杂的数据结构

### Session 和 JWT 
  - Session
    1. 存储在服务器，较为安全
    2. Cookie存储在客户端不安全，容易被攻击 例如 CSRF
  - JWT
    1. 分为三部分，三部分使用 . 相隔
      - 头部 Header
        1. typ  type的缩写，即token类型，这里固定式JWT
        2. alg  使用的hash算法， HMAC SHA256 RSA 等加密算法
      - 有效载荷 Payload
        1. 存储需要传递的信息
        2. token有效时间
        3. Payload可以加密，与Header不同
      - 签名 Signature
        1. 对Header和Payload部分进行签名
        2. 保证token在传输过程中没有篡改或损坏
        3. 算法
          Signature = HMACSHA256(
            base64UrlEncode(haeder) + '.' + base64UrlEncode(payload),
            secret
          )

### JWT 分为几种方式使用
  1. 上边写到的 Basic Auth 的方式需要base64转码然后放到请求头，服务端使用basic-auth包解析
  2. Bearer 只在前面拼一个 ‘Bearer ’ 即可，然后服务端拿到后干掉 ‘Bearer ’ 后即是token

### input type="file" 的 accept 属性 可使文件的选择只限于写入的几种，以下为例，表示选择文件时，只会展示以及选择图片的 png 和 jpeg 两种格式
  <input type="file" name="upload_file" accept="image/png, image/jpeg">
  <input type="file" name="upload_file" accept=".png, .jpeg">
  
  可选择所有类型的图片
  <input type="file" name="upload_file" accept="image/*">
