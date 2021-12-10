### schema 类型
  - 官方网站 https://graphql.cn/

### Apollo Server 是一个开源的、符合规范的 GraphQL 服务器，它与任何 GraphQL 客户端兼容，包括Apollo 客户端。这是构建可以使用任何来源数据的生产就绪、自记录 GraphQL API 的最佳方式。
 - 地址 https://www.apollographql.com/docs/apollo-server/

### websocket 通信
 - 一次握手

  1. 特点
    - 建立在TCP协议之上
		- 与HTTP协议有着良好的兼容性，默认端口也是 80 和 443，握手阶段采用的是HTTP协议
		- 数据格式轻量性能开销小，通信高校
		- 可以发送文本也可以发送二进制
		- 没有同源限制

	2. 流程
		- 一开始借助 http 协议发送请求，即请求连接的时候我们可以看到请求头请求方式等依然是 http 协议的东西
		- 请求头，升级协议，这是一个询问服务器的过程，询问服务器是否支持升级到客户端想要的协议
			1. 其中最主要的就是 connection: Upgrade 请求头，标识要升级协议，从 http 协议升级到更高级的协议
			2. 另外 Upgrade: Websocket 请求头表示升级到哪一个协议
		- 响应头回应是否支持升级到对应的协议
			1. connection: Upgrade 以及 Upgrade: Websocket 表示支持升级到 Websocket 协议 
	
	3. 每一个每一次客户端与服务端建立连接都会生成唯一的标识
		- 请求头 Sec-Websocket-Key ，客户端发送socket连接时对服务器发送的 hash 值
		- 相应头 Sec-Websocket-Accept ，socket协议针对客户端发送的 hash 返回的信息 
	
	4. 借助 https://github.com/theturtle32/WebSocket-Node 该包实现自定义的socket服务器
		- 该包比 socket.io 封装的简单很多，不像 socket.io 可以直接使用
		- 该包使用还需要手动搭建 ws 服务器，他应该只是简单的封装了，数据传递过程前的数据封包，以及传递后的数据解包过程
	
	5. 客户端简历链接时的四种状态，即 websocket 实例的 readyState
		- 示例代码 const ws = new WebSocket('ws://localhost:8080', 'xxx')
		1. 0 还未建立链接，但是已经 new 了的时候，链接建立之前
		2. 1 连接建立成功
		3. 2 连接正在关闭
		4. 3 链接已经关闭

	6. 群聊如何做
		- 每一个客户端的每一次连接都会在后端产生一个新的 connection 
		- 方法
			1. 最笨的方法 将每一次产生的 connection 全部收集起来，断开的删掉，当有消息进来时，遍历 connection list 调用 send 方法给每一个 connection 发送数据
			2. 最好的做法就是使用像 Redis 这样的来缓存到一个池子里面
	
	7. 使用 socket.io 跟着文档搞就完事了，其他不需要懂
	