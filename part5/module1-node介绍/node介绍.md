## node
### 底层
  1. v8 执行js代码，提供桥梁接口
  2. libuv 事件循环，事件队列，异步IO
  3. 第三方模块 zlib http c-ares 等

### 异步IO
  1. IO操作是应用程序的瓶颈所在 
  2. 异步IO提高性能
  3. 异步IO会针对不同瓶体使用不同的方案解决
  4. nodejs单线程配合事件驱动架构以及libuv实现了异步IO，例如linux使用的是epoll？？？还是其他，忘了

### node常见全局变量
  - __filename 正在执行的脚本文件绝对路径
  - __dirname 正在执行的脚本的目录，即不包含正在执行的文件的文件名
  - process 提供与当前进程互动的 接口与API

### process
  1. 获取进程信息
  2. 执行进程操作


### 核心模块
#### path 处理文件/目录的路径 常用API
  1. basename() 获取路径中的基础名称，就是路径中最后的部分
  2. dirname() 获取路径中的目录名称，不包含最后部分的部分
  3. extname() 获取路径中的扩展名
  4. isAbsolute() 判断传入的路径是否是绝对路径
  5. join() 拼接多个路径片段 
  6. resolve() 返回一个绝对路径
  7. parse() 解析一个路径
  8. format() 序列化路径
  9. normalize() 规范化路径

#### Buffer
  1. 总结
  - 全局的，直接使用
  - node 下进行二进制操作
  - 不占用 v8 堆内存大小的内存空间
  - 内存的使用由node控制，由 v8 进行 GC(垃圾回收) 操作
  - 一般是配合 Stream流 来使用，充当数据缓冲区
  - 每一个字节都是16进制的

  2. 常用API
  - alloc 创建指定字节大小的 buffer
  - allocUnsafe 创建指定字节大小的 buffer （不安全）
    1. const b2 = Buffer.allocUnsafe(10) // <Buffer 08 00 00 00 01 00 00 00 b1 ae>
      - 当我们使用 allocUnsafe 创建出buffer之后会发现，它里面存在数据
        这是由于，该方法会直接把不再使用的内存空间拿过来使用，这就会导致当有些内存空间已经没有对象引用了，但是内存还没来得及被回收且数据还存在的时候被该方法拿来使用了，所以就会看到里面的数据
  - from 接收数据，将数据转换为 buffer
    1. 第一个参数是要转换的数据，第二个参数是编码规则，默认是 utf-8
    2. 中文在 utf-8 编码中一个中文文字占用 3个字节
    3. 当 from 的第一个参数是数组的时候，其中的每一项如果占用多个字节，那么转换成 buffer 的时候不能完整识别，只会开辟数组长度个字节的内存空间
      即 buffer 中的每个字节为数组中每一项的第一个字节
    4. 当参数是一个 buffer 时，创建出来的是一个新的 buffer 和传入的 buffer没有关系，即修改传入的buffer 不会影响新创建出来的buffer
  
  3. 实例方法
    - fill 对buffer进行数据填充
      - 如果传入的数据不够buffer 的长度，那么会一直 repeat ，直到填满
      - 第二个参数 表示从哪个位置开始填充数据
      - 第三个参数 表示填充到哪个位置，不包含该位置
    - write 向buffer中写入数据
      - 类似repeat，但是不会repeat
      - 第二个参数 表示从哪个位置开始填充数据
      - 第三个参数 表示写入的数据的长度，即 写入当前数据的 多少个字节
    - toString 从buffer 提取数据
      - 第一个参数 表示使用什么编码格式转译数据
      - 第二个参数 表示从哪个位置开始转译数据
      - 第三个参数 表示到哪个位置结束，包含该位置
    - slice 截取 buffer 数据
      - 类似数组的 slice 方法
    - indexOf 查找某个数据是否存在
      - 类似数组中的 indexOf 方法
    - copy 复制buffer中的数据
      - let b1 = Buffer.alloc(6)
        let b2 = Buffer.from('拉钩')
        b2.copy(b1)
        此时 b1 和 b2 都是 拉钩
      - 所以 copy 的意思为 将 b2 作为复制源，复制到 b1 中，即将 b2 复制到 b1
      - 第二个参数 表示从 b1 的哪个位置开始写入数据
      - 第三个参数 表示从 b2 的哪个位置做读取操作
      - 第四个参数 表示读到 b2 的哪个位置，不包含该位置

  4. Buffer 类的静态方法
    - concat 将多个buffer拼接为一个buffer
      - let b1 = Buffer.from('教育')
        let b2 = Buffer.from('拉钩')
        let b3 = Buffer.concat([b2, b1])
        console.log(b3.toString()) // 拉钩教育
      - 第一个参数为数组，包含所有需要合并的 buffer
      - 第二个参数表示合成后的buffer的长度

    - isBuffer 
      - 当前参数是否是 buffer 类型
  
  5. Buffer 之 自定义 split 操作
    ArrayBuffer.prototype.split = function (sep) {
      // 获取分隔符转换成 buffer 后的长度
      const len = Buffer.from(sep).length
      let offset = 0
      let start = 0
      const result = []

      while (this.indexOf(sep) !== -1) {
        offset = this.indexOf(sep)
        result.psuh(this.slice(start, offset))
        start = offset + len
      }
      return result
    }
  
### FS 模块
  - 权限位
    - r 标识为 4 可读
    - w 标识为 2 可写
    - x 标识为 1 所有权限
  - 常见 flag 操作符
    - r read 表示可读
    - w write 表示可写
    - s sync 表示同步
    - + 表示执行相反操作 例：r+ 表示可读之后追加一个相反的操作，可读的相反操作为可写，所以就是 r+ 表示可读又可写
    - x 表示排他操作
    - a 表示追加操作 
  
  - fd 操作系统分配给被打开文件的标识
    - 0 1 2 分别被 标准输入 标准输出 标准错误使用，所以使用 fs.open 打开的第一个文件的表示是 3 ，后面依次分配
    - 可以用来追踪或者定位备操作的文件资源

  - 文件操作api
    - readFile 读文件
    - writeFile 向文件中写入数据，即把文件原先的内容重置掉，重新写入新的数据，即是覆盖的写操作
      - 写入一个不存在文件时，会自动创建文件并写入数据
      - 第三个参数 可以是一个对象 
        flag 是不同的值的时候操作是不一样的
        如果是 w+ 那么会先将文件内容进行清空，然后写入
        如果是 r+ ，例，原文件内容 为 helloworld ，那么写入123 则会变成 123loworld
        {
          mode: 438, windows 下的十进制 可读可写权限 标识
          flag: 'w+', 
          encoding: 'utf-8'
        }
    - appendFile 对文件进行追加内容，该操作不同于 writeFile ，是在文件内容的末尾开始追加数据
    - copyfile 将 a 文件复制到 b 文件
      fs.copyfile('data.txt', 'test.txt', () => {})
      - 第一个参数为源文件
      - 第二个参数是目标文件
      即 将源文件 的内容复制到 目标文件
      - 当目标文件是个不存在的文件时，会自动创建该文件
      - 不适合内容特别多的文件操作
    - watchFile 监听文件变化，执行回调
      fs.watchFile('data.txt', { interval: 20 }, (current, previous) => {})
      - 第二个参数为配置项 
        其中interval表示每隔多少毫秒看下文件有没有发生变化
      - 回调函数可以接受两个参数 分别表示 当前的修改后的文件一些信息 和 文件修改之前的信息
        - 其中有个字段叫做 mtime 保存了修改时间，如果 current.mtime !== previous.mtime 说明文件被修改了
      - fs.watchFile 取消文件的监控
        fs.watchFile('data.txt')

  - 文件的打开与关闭
    - readFile 和 writeFile 是一次性读取和写入，不适用于占用空间较大的文件
    - fs.read(rfd, buf, 1, 3, 0, (err, readBytes, data) => {}) 从文件磁盘中将数据 读取出来然后写入到 缓冲区内存中，所谓 读既是写
      - rfd 第一个参数 这里可以是文件路径也可以是 文件被 fs.open('xxx.txt', 'r', (err, fd) => {}) 方法打开后通过回调函数参数获取到的文件操作标识
      - buf 第二个参数 即 Buffer，即要写入数据的 缓冲区内存
      - 1 第三个参数 表示从 buf 的哪一个字节开始写入
      - 3 第四个参数 表示写入到 buf 的数据的字节的长度，即从文件中读取几个字节的数据然后写入到 buf
      - 0 第五个参数 表示从文件的哪一个字节开始读取
      - 回调函数 参数
        - readBytes 表示读取的字节的长度
        - data 表示写入到 buf 后的 buf 的内容
    
    - fs.write(rfd, buf, 1, 3, 0, (err, readBytes, data) => {}) 从缓冲区内存中将数据 读取出来然后写入到 文件磁盘中，所谓 写既是读
      - rfd 第一个参数 这里可以是文件路径也可以是 文件被 fs.open('xxx.txt', 'r', (err, fd) => {}) 方法打开后通过回调函数参数获取到的文件操作标识
      - buf 第二个参数 即 Buffer 即要读取数据的 缓冲区内存
      - 1 第三个参数 表示从 buf 的哪一个字节开始读取
      - 3 第四个参数 表示写入到文件的字节的长度，即从 buf 中读取几个字节的数据然后写入到 文件中
      - 0 第五个参数 表示从文件的哪一个字节开始写入
      - 回调函数 参数
        - readBytes 表示读取的数据的长度
        - data 表示 buf 的内容

    - 在我们 open 完文件并进行操作之后一定要 close ，不然的话 文件操作标识符 不会被取消掉 即 每次新open一个文件 fd 会一直往上涨，就会造成内存泄漏，是一种资源的浪费

### 常见目录操作API
  - access 判断目录或者文件是否具有操作权限
  - stat 获取目录及文件信息
  - mkdir 创建目录
    - fs.mkdir('a/b/c', { recursive: true }, () => {})
    - 第二个参数为配置参数
    - recursive 表示是否递归创建文件，上述使用中 即是不存在 a ，且 a/b/c 为多级的情况下就可以创建成功
    - 在上述使用中，如果 recursive 不设置为 true ，那么是不能创建成功的
    - 因为默认需要保证 a 这个文件夹的存在，然后可以创建 a/b ，即只能创建 a 下的 b
  - rmdir 删除目录
    - 默认情况下只能删除非空目录，且删除的是最后一级
      - 例 fs.rmdir('a/b/c', () => {}) 这种情况下只会删除 c 
    - fs.rmdir('a', { recursive: true }, () => {})
    - 将配置参数中的 recursive 设置为 true 就可以删除非空目录
  - readdir 读取目录中的内容
    - 示例，将如当前有一个 a 文件夹，下面有一个 b文件夹 和 c.txt ，b下有一个 d.txt
      fs.readdir('a', (err, files) => {}) 此时 files 为 ['c.txt', 'b']
  - unlink 删除指定文件

### CommonJs 规范 模块加载是同步完成的 所以不适用于浏览器
  - module属性
    * 任意js 就是一个模块，可以任意使用 module
    * id：模块标识符一般是一个绝对路径
    * filename：返回模块的绝对路径
    * loaded：布尔值，表示模块是否加载完成
    * parent：返回对象，存放调用当前模块的模块
    * children：数组，返回当前模块调用的模块
    * exports：返回当前模块需要暴露的内容
    * paths：存放不同目录下的 node_modules 位置
  
  - require属性
    * resolve： 返回传入的模块的绝对路径
    * extensions： 依据不同的后缀名执行不同的解析方法解析不同类型的文件
    * main： 返回主模块对象，即 入口模块对象 
      - 例： 如果当前模块是入口模块，那么在当前模块中 require.main === module
  
  - 模块分类
    * 内置模块
    * 文件模块，我们写的所有的js模块以及第三方包都属于该分类
  - 加载速度
    * 核心模块 nodejs 源码编译时写入到人进制文件中，即当 nodejs 被启用时，一些核心模块已经存在内存中了，不需要经历整个的加载流程，速度会快
    * 文件模块 在代码运行时动态加载的，需要经历完成的加载流程，所以慢
  - 加载流程 
    * 路径分析：依据标识符确定模块位置
    * 文件定位：确定目标模块中具体的文件及文件类型
      - 不传入扩展名时，会按照 .js .json .node 的方式进行加载文件
      - 如果找不到对应的文件，那么会认为他是一个目录
      - 他会将这个目录当做一个包进行处理，会遵循 commonjs 规范
      - 会首先查找该目录下的 package.json 文件，使用json.parse()解析，取出其中的 package.json 中的 main 属性值
      - 如果 main 属性中的值也是没有扩展名的，那么也会按照 .js .json .node 进行加载
      - 如果 main 属性不存在 甚至是不存在 package.json，那么使用 index 作为该目录下的具体文件名称进行加载
      - 依然按照 .js .json .node 进行查找
      - 如果没有，则失败
    * 编译执行：根据文件类型采用不同的方式完成文件的编译执行
      - js模块的编译执行
        1. 使用 fs 模块同步读取文件内容
        2. 对内容进行语法包装，生一个可执行的js函数
        3.然后调用该函数，调用时会将 exports module require 等属性值传入该函数
    
    * 缓存优先原则
      - 加载模块时回先从缓存中加载，如果换村中不存在那么就会走一边完整的加载流程

  - 第三方包加载 会根据 module.paths 中保存的con当前目录下的node_modules(如果当前目录存在的话)，一直到跟盘符下的 mode_modules 的路径的数组，他会遍历这个数组直到找到对应的模块，如果没有就报错

  - 内置核心模块 vm
    * 创建一个独立运行的沙箱环境

### 事件模块
  - 事件模块实例 可以监听 newListener 事件，每当我们监听了新事件的时候， newListener事件就会呗触发

### EventLoop 
  1. 浏览器
    - 每当宏任务列表中的任何一个宏任务完成之后，都会清空一次微任务
      示例： 第一个setTimeout中添加的任务命名为 s1 ，第二个命名为 s2
          setTimeout(() => {
            console.log('s1')
            Promise.resolve()
              .then(() => {
                console.log('p1')
              })
            Promise.resolve()
              .then(() => {
                console.log('p2')
              })
          })

          setTimeout(() => {
            console.log('s2')
            Promise.resolve()
              .then(() => {
                console.log('p3')
              })
            Promise.resolve()
              .then(() => {
                console.log('p4')
              })
          })
      执行顺序为 s1 p1 p2 s2 p3 p4
      即 此处，当执行完成 s1 的时候会先清空一遍 所有的微任务，所以是打印 s1 p1 p2；然后在执行 s2，打印 s2 p3 p4
  2. node 存在 6 个回调队列，按执行顺序如下简单介绍
    - timers 回调队列： 执行 setTimeout setInterval 的回调
    - pending callbacks： 执行系统操作的回调，例如执行 UDP TCP 的错误回调，会存放在这个回调队列当中
    - idle，prepare： 一般只在系统内部进行使用，我们控制不了
    - poll： 执行 IO操作 相关的回调
    - check： 执行 setImmediate 的回调函数
    - close callbacks： 专门用于执行 close 时间的回调函数的队列

    * 完整事件循环流程
      1. 执行同步代码，将不同的任务添加至相应的队列
      2. 同步代码执行完成之后，清空微任务队列
      3. 微任务执行完成之后开始执行 timer 中满足条件的宏任务
      4. timer 中红任务完成之后会切换队列，进行 pending callbacks 的任务的执行，后面的依次进行
      5. 每当切换队列之前都会清空一次微任务，例如 当 timer 队列的任务完成后会先清空一次微任务队列然后进行任务队列的切换，开始进行 pending callbacks 的任务

    * 细节点
      - nextTick 添加的微任务优先级要高于 promise的then 添加的微任务
    
    * 常见问题
      1. setTimeout 与 setImmediate 输出顺序不固定，时而 setTimeout 先， 时而 setImmediate 先
        setTimeout(() => {
          console.log('setTimeout')
        })

        setImmediate(() => {
          console.log('setImmediate')
        })
        这是由于 setTimeout 需要传入一个毫秒数，但是当我们没有传入的时候，他会受到某些因素影响，产生 n 毫秒的影响，就会导致 setImmediate 先执行
      
      2. 此时的执行顺序
        const fs = require('fs')

        fs.readFile('./buffer.js', () => {
          setTimeout(() => {
            console.log('setTimeout')
          })

          setImmediate(() => {
            console.log('setImmediate')
          })
        })
        会一直是 setImmediate 优先于 setTimeout
        原因是因为 这里执行的是 poll 队列中的任务，并且在执行 poll 队列的任务的时候，对 check 队列中添加了 setImmediate 的任务，当 poll 队列执行完成之后会执行 check 队列
        而 setTimeout 只会在下一次事件循环中执行


### 核心模块 stream
  * 分类
    - readable 可读流
      1. readable 事件 当缓冲区中存在可读数据时触发
      2. data 事件 当流中数据块传递给消费者后触发
    - writeable 可写流
    - duplex 双工流，可读又可写
    - transform 转换流，可读可写，还能实现数据转换 

  * createReadStream 创建可读流配置对象
    - 假如 xxx.txt 内容为 0123456789
    - 示例
      const readStream = fs.createReadStream('xxx.txt', {
        flags: 'r', // 表示操作符标识 默认是 r，即可读
        encoding: null, // 数据的编码格式，默认是 buffer，读出来的数据应该就是 buffer 格式的
        fd: null, // 操作系统分配给文件的被打开的标识 默认是从 3 开始，如果不是从3开始，说明系统已经打开了其他文件了
        mode: 438, // 表示文件的权限 可读可写
        autoClose: true, // 表示读取完成后是否自动关闭文件
        start: 0, // 表示从文件的妈个字节开始读取数据
        end: 3, // 表示读取到文件的哪个字节结束读取
        // 水位线 表示每次读取时的字节数 ，readable 默认是 16kb 的字节数，文件操作的读取流默认就是 64kb 的字节数，但这里我们还是可以手动设置，这里传入 4 表示每次读取 两4个字节
        // 即会分配一个 4个字节 的缓冲区，然后每次读取会读取  4个字节 放入缓冲区来使用
        hignWaterMark: 4, 

      })
    - 可读流 读取数据的方式
      1. 监听 data 事件
        - 三种模式
          1. 流动模式 当我们监听 data 事件时候默认就是在 流动模式 
          2. 暂停 在读取过程中我们可以调用 readStream.pause() 进行暂停读取 
          3. 恢复 暂停读取之后我们可以调用 readStream.resume() 方法恢复数据的读取
        readStream.on('data', (chunk) => {
          console.log(chunk.toString())
          readStream.pause()
          setTimeout(() => {
            readStream.resume()
          }, 1000)
        })
      2. 监听 readable 事件 ，无法暂停，只要缓冲区存在数据时就会触发 ，直到读取完成
        - 这里可以通过 readStream.read() 方法来获取数据
          - readStream.read(1)
            - 此处的传值表示每次从缓冲区中读取几个字节，意思是我们在上面  hignWaterMark 传值之后会分配一个 4个字节的缓冲区，当缓冲区中有值的时候 ， read方法会每次从缓冲区中读取出一个字节
            - 然后直到缓冲区中读完了，继续会从文件中读取 4个字节 放入缓冲区，然后在从缓冲区中 read 1个字节，以此往复，直到 createReadStream 的设置的 end 配置项，或者文件读取完成
          - 即 此时 hignWaterMark 为 1 ，每次只会读取一个字节
          - readStream._readableState 可以通过该字段来获取当前读取完成后缓冲区剩余的内容
        readStream.on('readable', (chunk) => {
          const data = readStream.read()
          console.log(data)
          console.log(readStream._readableState.length)
        })
    - 常用事件
      1. open事件 文件打开时会触发 只要调用了 createReadStream 就会触发 
      2. end 当数据被清空之后 该事件在close事件之前执行
      3. close 文件读取完成会自动触发
  
  * createWriteStream 创建可写流
    - 代码示例
      const writeStream = fs.createWriteStream('xxx.txt', {
        flags: 'r', // 表示操作符标识 默认是 r，即可读
        encoding: 'utf-8', // 数据的编码格式，默认是 buffer，读出来的数据应该就是 buffer 格式的
        fd: null, // 操作系统分配给文件的被打开的标识 默认是从 3 开始，如果不是从3开始，说明系统已经打开了其他文件了
        mode: 438, // 表示文件的权限 可读可写
        start: 0, // 表示从文件的哪个字节开始写入数据
        hignWaterMark: 3, // 水位线，每次写入多少个字节，默认是16kb的字节，但考虑到 中文，这里我们可以手动改成3或者3的倍数，即每次写入 3个字节
      })
    - 常用方法
      1. writeStream.write('123123213', () => {}) 想写入目标中 写入数据 不存在文件会默认创建
        - 可以连续多次调用，此时数据会依次写入
          writeStream.write('123123213', () => {}) writeStream.write('拉钩', () => {})
          此时文件内容为 123123213拉钩
        - write 方法的第一个参数必须是 字符串 或者 buffer 或者是 Unit8Array，传入其他的会报错，此时是语法错误，不会被 error 事件捕获 
        - 其实有三个参数，可以在第二个参数中传入 编码格式 ，第三个参数用来传回调函数
      2. writeStream.end() 
        - 调用该方法则意味着写操作已经完成
        - 调用该方法之后不能够在调用 write 方法，即调用end 方法之后不允许再写入
        - writeStream.end('123123123') 会把 123123123 写入文件，最后执行一次写入
    - 常见事件
      1. open createWriteStream调用时就会触发
      2. close writeStream.end()调用之后执行
    
    - writeStream.write 的执行流程
      - 第一次调用的时候 是直接写入到文件里的，不是先写入到 缓存区 ，从第二次开始 会先将数据写入缓存
      - writeStream.write调用后会返回一个 boolean 值 
        const bool = writeStream.write('123123213', () => {})
        当 bool 该值为 false 时应该告知数据生产者，当前的消费速度已经跟不上生产速度了，这时候一般会将暂停生产数据，即需要将可读流切换为暂停模式
        消费者会慢慢消费缓存中的数据，直到可以再次被执行写入操作 
      - 如果 writeStream.write 的累计写入量 >= hignWaterMark 那么 bool 就会为 false
      - 当缓冲区可以继续被写入数据时，如何让生产者知道？ 通过 drain 事件，当 drain 事件触发时表示缓冲区可以写入数据了，我们就可以将 可读流 切换为 流动模式

    - drain 事件
      * 控制速度，限流
        - 示例
          const fs = require('fs')
          const writeStream = fs.createWriteStream('test.txt')

          const source = '拉钩教育'.split('')

          let flag = true
          let num = 0

          function excuteWrite() {
            flag = true

            while (num !== 4 && flag) {
              flag = writeStream.write(source[num])
              num++
            }
          }

          writeStream.on('drain', () => {
            excuteWrite()
          })

    - 背压机制
      - stream 已经实现了 即 pipe 方法 内部已经实现了 背压机制 
      - 数据读写时可能会存在的问题，当读取数据过大，而写入速度不够时，读取到的多与数据就会存储到内存中，而且会愈来愈多导致下列问题
        1. 内存溢出
        2. GC频繁调用
        3. 其他进程变慢
      - 基于上述问题就需要有一种能够让生产者与消费者之间的数据平滑流动（数据平滑的读取与写入）的机制，这就是所谓的背压机制
        - 背压机制进本就是类似下方代码实现思路
          1. 通过 writeStream.write方法 获取到当前写入流的写入状态
          2. 当 flag 为 false 时，说明缓冲区已经满了，此时在进行读取，内存就会溢出了
          3. 所以通过调用 readStream.pause() 方法来暂停读取
          4. 当 writeStream 可以写入时会触发 drain 事件，在该事件中调用 readStream.resume() 恢复数据读取即可 
        - 简单实现示例代码 
          const fs = require('fs')

          const readStream = fs.createReadStream('buffer.js', {
            highWaterMark: 4
          })

          const writeStream = fs.createWriteStream('test.txt', {
            highWaterMark: 1
          })

          let flag = true

          readStream.on('data', (chunk) => {
            flag = writeStream.write(chunk)
            if (!flag) {
              readStream.pause()
            }
          })

          writeStream.on('drain', () => {
            readStream.resume()
          })


### 网络通信
  * 通信必要条件
    - 主机之间必须要有传输介质
    - 主机之间必须要有网卡设备，网卡设备进行数据的调制和解调制，即把二进制转换高低电压的电信号的过程就是数据调制
  * 基础网络通信方式
    - 交换机通讯
      - 通过机器的 物理地址来确定一台主机
      - 有交换机组成一个个的小的局域网，有局域网组成广域网，最后再组成互联网
    - 路由器通讯
      - 组成互联网之后，由于不同局域网之间是不能通讯的，所以就需要一个东西来解决不同局域网之间的通讯，这个就是路由器
      - 需要明确目标主机的IP地址
      - 通讯时会把当前主机的 ip 地址 和 物理地址 以及 目标主机的 ip 地址一起发送，通过目标主机的ip地址确定交换机，然后由 交换机 通过 物理地址 确定当前主机
  * OSI七层协议
    1. 作用 更加清晰规范的完成网络通信
    2. 分层 
      - 应用层 用户与网络 以及 应用程序与网络  的接口，我们可以利用不同的协议来完成各种服务
        1. http 完成网站服务
        2. ftp 完成文件服务
        3. ssh 完成远程登录服务
      - 表示层 对数据 加密、转换、压缩
      - 会话层 控制网络连接的建立与终止 
      - 传输层 保证数据传输的可靠性
      - 网络层 通过路由确定目标网络，即 通过 ip 地址进入某一个局域网内
      - 数据链路层 通过 MAC地址（物理地址）确定目标主机 ，常见的就是 ARP 寻址协议
      - 物理层 各种网络物理设备和标准
    3. 数据 从 主机A 到 主机B ，需要先进行封装，然后再进行解封 
  
  * 数据的封装与解封装
    1. 
    2. 使用TCP/IP 五层协议
      * 应用层 产生真正的要被传输的数据 这里使用 data 表示
      * 传输层 目标端口 源端口 data   端口的意义在于确定唯一一个正在运行的进程 因为一个端口只能运行一个程序
        - 这里 data 就会被包裹上  目标端口 源端口 ，形成 目标端口 源端口 data 这样的数据段
      * 网络层 需要通过 ip 协议来确定目标所在的网络
        - 这里会被包裹上 目标ip 源ip ，形成 目标ip 源ip 目标端口 源端口 data 的数据段
      * 数据链路层 通过 MAC地址（物理地址） 完成寻址操作
        - 形成 目标MAC 源MAC 目标ip 源ip 目标端口 源端口 data
        - 然后一条包含完整信息的数据就被封装好了 
      * 物理层
        - 此时需要传递给网络 但是网线是无法识别的，所以会经过 网卡的调制形成高低电压 
        - 通过传输后达到目标网络
        - 然后就会进行反向操作，即从物理层拿到电信号之后解调制成 二进制数据 然后向上 经过 数据链路层 网络层 传输层 应用层 反向操作
  
  * TCP 协议
    - 属于传输层协议，基于端口，面向连接，用于实时通讯
    - 主机之间想要通讯首先要建立双向的数据通道
    - TCP 的握手和挥手 本质上都是 四次的
      - 只不过握手 的 第二次和第三次合并为了 一次操作，即 当客户端请求连接时，服务端会回传 ACK=1 表示接受到信息，同时会发送SYN = 1表示服务端想同客户端建立连接
      - 挥手的不能合并是因为 结束的时候并不能保证服务端一定会把数据全部按送完 
    - 常见控制字段
      1. SYN = 1 表示请求建立连接
      2. FIN = 1 表示请求断开连接
      3. ACK = 1 表示数据信息确认，由接收方向发送方发出，表示接收到发送方发送的信息了

    - 通讯事件&方法
      - 事件
        * listening 调用 server.listen 方法时触发
        * connection 新的连接建立时触发
        * close 当server 关闭时触发
        * error 错误出现时触发
        * data 接收到数据时触发
        * end 当socket 的一段发送 FIN 包时触发，结束可读端
      - 方法
        * write 在socket 上发送数据，默认编码 utf8

    - 数据粘包及解决
      - 问题由来
        * 通讯需要有 数据发送端和接收端 ，通讯时 发送端并不是实时的一直发送给接收端，会一直累计数据等数据达到一定的量 执行一次 发送，接收端也是把接收到的数据放到缓冲区当中，等数据达到一定的量一次性处理
          好处就是 减少IO操作
          坏处就是 会出现粘包
        * TCP拥塞机制决定发送时机
      - 具体现象
        * 连续的多次写入会把数据合并为一条发送，导致数据无法区分
      - 解决
        * 将每次发送的时间间隔变大，即洗一次发送距离上一次发送有一定的间隔  确定是降低了传输效率
        * 数据的封包拆包
          - 按照既定规则封包，接收到数据后按照既定规则拆分数据  在消息体前面包装头部信息 ，其中 头部信息 包含 包编号 包数据长度 的信息
        * Buffer 数据读写 两个方法
          1. writeInt6BE 将value 从指定位置写入
          1. readInt6BE 从指定位置读取数据
  
  * HTTP 协议
    - 静态服务 
      1. 服务端代码 对于路径的使用和前端是不一样的 所以还是最好使用绝对路径查找文件 

        
      
    











