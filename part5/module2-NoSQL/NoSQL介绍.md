## 非关系型数据库
  - Not only SQL
  - MongoDB Redis

  ### 关系型数据的的缺点
    * 难以应付每秒上万次的高并发写入
    * 查询上亿级数据的速度极其缓慢
    * 分库分表形成的子库爱到一定的规模后难以扩展
    * 分库分表可能会因为需求变更而发生变更
    * 修改表结构困难 

  ### 非关系型
    - 简单讲就是把所有数据搜放到一个大仓库中，不标号，不连线，单纯的堆起来，从而提高了对海量数据的高性能存储及访问
  
  ### 常见NoSQL数据库
    - 键值数据库
      * 主要使用数据中的 key 来查找数据
        - 优点
          1. 在存储是不是用任何模式，因为极易添加数据
          2. 有极高的读写性能，用于处理大量数据的高访问负载，例如日志系统
        - 代表
          1. Redis
          2. Flare 

    - 文档型数据库
      * 满足了对海量数据的访存储和访问，同时对字段要求不严格，可以随意增删改，且不需要预先定义表结构，所以是用于各种网络应用
      * 代表 MongoDB CouchDB

    - 列存储型数据库
      * 代表Cassandra Hbase  ，Hbase更火一些 ，大数据方面使用较多
      * 查找速度快，可扩展性强，适用分布式文件存储系统
    
    — 图数据库
      * InfoGrid  Neo4J
      * 利用 图结构 的相关算法来存出实体之间的关系信息
      * 适用于构建社交网络和图鉴系统的关系图谱
  
  ### 如何选择关系型数据库he非关系型数据库
    1. 数据模型的关联性要求
      * 多表关联使用关系型数据库
      * 对象关联实体少则非关系型数据库
        - MongoDB 可以支持复杂度相对较高的数据结构，能够将相关联的数据以文档的方式嵌入，从而减少数据之间的关联操作 
    2. 数据库的性能要求
      * 数据量多且访问速度至关重要，NoSQL 比价适合
    3. 数据的一致性要求
      * NoSQL 有一个缺点就是 在事务处理与一致性方面无法与 关系型数据库 相提并论
      * NoSQL 很难同时满足 一致性 和 高并发性，如果对性能有高要求，NoSQL只能做到数据最终一致
    4. 数据可用性要求
      * NoSQL提供了强大的数据可用性
  
  ### MongoDB 使用于哪些场景
    1. 需要处理大量的低价值数据，且对数据处理性能有较高要求
      - 例如 微博的数据处理就不需要太高的事务性，但对数据的存取性能有较高的要求
    2. 需要借助缓存层来处理数据
    3. 需要高度的伸缩性 
  
  ### mongoDB 版本号说明
    - 奇数版本为开发版本 例如 4.3 就是开发版本 ，建议在开发测试环境使用
    - 偶数版本为稳定版本 例如 4.4 就是稳定版本 ，建议 在生产环境使用

  ### Redis
    * 定义： 是一个有 C语言 编写的一个开源的，支持网络的，基于内存的，可选持久性 的键值对存储数据库
      - 不只是 key-value 还支持数据结构 字符串 哈希 列表 集合 带范围查询的排序集合 位图 超日志 带有半径查询和流的地理空间索引
      - 具有内置的复制功能，能解析执行 Lua 脚本，支持 LRU 缓存控制，事务及不同级别的磁盘持久性，并通过 Redis Sentinel 和 Redis Cluster 自动分区提供高可用性
    * 使用 
      - 作为缓存系统 
        * 可以为每个 键 设置生存时间，生存时间到了之后会自动删除
        * 可以选定数据占用的最大空间，在数据达到空间限制后按照一定的规则自动淘汰不太需要的 键

      - 作为队列系统
        * Redis 的 列表 数据结构可以用来实现队列，并且支持阻塞式读取，可以很容易的就实现一个高性能的优先级队列
      
      - 发布/订阅
        * 支持 发布/订阅 功能，可以用来构建聊天室
    * 优点
      1. 简单稳定
      2. 读写性能优异
      3. 持久化
      3. 数据类型丰富
      5. 单线程
      6. 数据自动过期
      7. 发布订阅
      8. 分布式 

  ### Redis 操作
    - 默认运行端口 6379
    - 后台运行 redis-server --daemonize yes
    - 查看 redis 运行进程 ps -ef | grep -i redis
    - 停止运行redis  redis-cli shutdown
      * 前面一直是使用 ctrl + c 来强行关闭redis运行，但这样会存在问题，因为此时Redis可能正在将内存中的数据同步到硬盘中，这么做可能会导致数据丢失
      * 正确是法就是使用 redis-cli shutdown ，他会先断开所有的客户端连接，然后根据配置执行持久化，最后完成退出
    - 使用 kill -9 Redis进程号，来杀死进程可以达到与上面一样的效果
    - 连接 Redis ，执行 redis-cli 就可以连接数据库了
      * 也可以指定服务器地址和端口号
        - 使用 redis-cli -h 127.0.0.1 -p 1234
      * 断开连接 crtl + c 或者输入 quit 
    - 配置redis
      1. 使用命令行参数
      2. 使用配置文件配置 redis
        * 在 redis 根目录下有一个 redis.conf 的配置文件模板
        * 建议将 配置文件放到 /etc/redis 下 ，然后配置文件名称可以使用 端口号 命名
        * 启动 redis-server 配置文件路径 
      3. 在 redis 服务运行期间也可以对 redis 配置进行修改 ，运行期间使用 CONFIG SET 进行的修改只有在当前的运行期间才生效，重启之后还是会以配置文件为准
        - 在 redis-server + redis-cli 之后 可以使用 CONFIG SET 配置项 命令来修改配置项，但是只能修改部分配置项
          * CONFIG SET logLevel warning 将日志级别设置为warning
        - 通过 CONFIG GET 配置项 ，可以获取到 配置的想的值
          * CONFIG SET logLevel 获取当前设置的 日志级别 
          * CONFIG GET port 可以获取到当前配置的端口号

  ### Redis 多数据库
    1. 一个Redis实例提供了多个用来存储数据的字典，客户端可以指定将数据存储在哪个字典中。每个字典都可以理解为一个单独的数据库
    2. Redis 默认支持 16 个数据库，默认编号为 0 - 15
    3. 不支持数据库自定义数据库名称，默认以上述的编号命名
    4. 默认是编号命名，所以开发者必须明确哪个数据库存放了哪些内容
    5. 可以通过 databases 配置参数来修改支持的数据库个数
    6. 每个数据库都是独立的，在 0 号中添加了数据，在 1 号中是访问不到的
    7. 客户端与Redis 建立连接后，默认使用 0 号数据库，可以使用 SELECT 命令 来切换数据库
      * SELECT 7 切换为 7 号数据库
    8. 不支持为每个数据库设置访问密码，要么能访问全部，要么一个也不能访问
    9. 多个数据库之间并不是完全隔离的， 使用 FLUSHALL 明亮可以清空所有数据库中的的数据
    10. 这些数据库更像是命名空间，不适宜存储不同应用程序的数据，不同客户端应用应该使用不同的redis实例
  
  ### Redis 数据类型
    * Redis 中的命令不区分大小写，大师为了区分是命令还是其他，所以约定命令 都是大写
    * Redis 所有的数据类型都不支持嵌套其他的数据类型，例如下面的哈希类型，值只能是字符串，不能是哈希或者其他的类型
    * 字符串常用操作
      - 添加修改
        1. SET key value
        2. GETSET key value
        3. SETNX key value 只有当key不存在时才会添加成功
        4. MSET key value key value 可以同时设置多个
        5. MSETNX key value key value 可以同时设置多个且只有当key不存在时才会添加成功
        6. APPEND key value 如果 key 已存在且有字符串类型的值，则追加
      - 获取 
        1. GET key 
        2. GETRANGE key start end  返回对应字符串的 子字符串，即 start - end 之间的字符串
        3. MGET key key 获取多个 key 对应的 value
        4. STRLEN key 获取 key 的值得长度
        5. EXISTS key 判断key是否存在，通用的命令，所有的类型都可以通过该命令判断
        6. TYPE 查询 key 的类型 ，即查看 键 是啥类型的
      - 删除 
        1. DEL key

    * Redis 中的 number 类型也是以 字符串来表示的，但是有专门针对数字类型的命令
      1. INCR key 表示key对应的值 +1
      2. INCRBY key n 表示key对应的值 +n
      3. DECR key 表示key对应的值 -1
      4. DECRBY key n 表示key对应的值 -n

    * 哈希 ，类似 Object 类型
      - 添加
        1. HSET key field1 value1 field2 value2 向一个名字为 key 的哈希表中 添加 多个字段 ，其中 field1 = value1   field2 = value2，如果存在 field1 或者  field2字段，那么就修改对应的值
        2. HMSET key field1 value1 field2 value2 同上
        3. HSETNX key field1 value1 只有在 filed 不存在的情况下才会设置成功 
      - 获取
        1. HGET key filed1 获取 名字为 key 的哈希表中的 名字为 filed1 的字段的值 
        2. HKEYS key 获取名字为 key 的哈希表 的所有的字段名
        3. HLEN key 获取名字为 key 的哈希表 有多少个字段
        4. HMGET key filed1 filed2 获取名字为 key 的哈希表的给定字段的值
        5. HGETALL key 获取名字为 key 的哈希表的所有的字段和值
        6. HEXISTS key filed1 查看名字为 key 的哈希表是否存在名字为 filed1 的字段
        7. HVALS key 获取名字为 key 的哈希表的所有的字段的值
      - 修改
        1. HINCRBY key field1 n 名字为 key 的哈希表中的 名字为 filed1 的字段的值 +n
      - 删除
        1. HDEL key field1 field2 删除名字为 key 的哈希表中的 名字为 filed1 和 field2 的字段
        2. DEL key 删除名字为 key 的哈希表

    * 列表，类似于数组，存储一组有序的字符串列表，其内部使用双向链表实现
      - 添加
        1. LPUSH key ele1 ele2 将 ele1 ele2 按顺序插入到名字为 key 的列表的头部，即先插入 ele1 在插入 ele2 ，所以  ele2 应该在 ele1 之前
        2. RPUSH key ele1 ele2 将 ele1 ele2 按顺序插入到名字为 key 的列表的尾部 ，和 push 方法类似
        3. LINSERT key BEFORE ele1 ele3 在名字为 key 的列表的 ele1 元素前插入一个 ele3
        4. LINSERT key AFTER ele1 ele4 在名字为 key 的列表的 ele1 元素后插入一个 ele4
        5. LSET key index ele5 将索引为 index 的值修改为 ele5
        6. RPUSHX key value 为已存在的列表添加值 
      - 获取
        1. LRANGE key start end 获取 key 的列表的第 start 到 end 的元素
          * 例 LRANGE key 0 -1 获取所有的元素
          * 例 LRANGE key 0 -2 获取最后一个元素前的所有元素
        2. LINDEX key index 获取索引为 index 的值
        3. LLEN 获取列表的长度
      - 删除
        1. LPOP key 移除头部第一个元素，并返回该元素
        2. RPOP key 移除尾部第一个元素，并返回该元素
        3. LREM key count ele1 遍历删除 count 个值为 ele1 元素
          * count > 0 从头开始删除
          * count < 0 从尾开始删除
          * count = 0 删除所有值为 ele1 的元素
    * 集合 Set 类型
      - 添加
        1. SADD key member1 member2 例 SADD myset 1 2 a b c
      - 查询
        1. MEMBERS key 获取集合的所有成员 例 MEMBERS myset 输出  1 2 a b c
        2. SCARD key 获取集合成员数 例 SCARD myset 输出 5
        3. SISMEMBER key member 查询某个元素是否是集合的成员 SISMEMBER myset a 输出 1 表示存在
        4. SRANDMEMBER key [count] 随机返回 集合中的某一个或某多个元素 例 SRANDMEMBER myset 2 从 myset 集合中随机取两个元素返回
      - 修改
      - 删除
        1. SREM key member1 member2 移除一个或多个元素
        2. SPOP key 从集合中随机移除一个元素，并返回该元素
        2. SMOVE key key2 member 将元素从集合key移动到key2
      - 集合间的运算
        1. SDIFF key1 key2 key3 [...] 返回第一个集合key1和后续其他集合的差异
        2. SINTER key1 key2 key3 [...] 返回第一个集合key1和后续其他集合的交集
        3. SUNION key1 key2 key3 [...] 返回给定集合的并集
        4. SDIFFSTORE destination key1 key2 key3 [...] 返回 key1 及后续所有集合的差异并存储到 destination 集合中
        5. SINTERSTORE destination key1 key2 key3 [...] 返回 key1 及后续所有集合的交集并存储到 destination 集合中
        6. SUNIONSTORE destination key1 key2 key3 [...] 返回 key1 及后续所有集合的并集并存储到 destination 集合中
    
    * 有序集合
      - 添加
        1. ZADD key score member [score member] 向有序集合中添加一个或多个成员或者是更新已存在的成员

      - 查询
        1. ZRANGE key start stop 返回有序集合的指定区间内的成员，返回的数据是已 排序的


  ### 过期时间
    - EXPIRE key seconds 为给定 key 设置生存时间，单位为 s  
    - PEXPIRE key milliseconds 为给定 key 设置生存时间，单位为 ms
    - EXPIREAT key timestamp 为给定 key 设置生存时间，只不过此处使用的是时间戳，单位为 s 的时间戳
    - PEXPIREAT key timestamp 为给定 key 设置生存时间，只不过此处使用的是时间戳，单位为 ms 的时间戳
    - 前三个命令最终都会转化为 PEXPIREAT 来执行设置过期时间的功能
      - 例使用 EXPIRE 设置 某个 key 的过期时间为N秒之后，那么他会先调用 PEXPIRE 将 N秒 转化为 M毫秒，然后获取当前的时间戳X
        然后将 X + M 为过期时间戳传递给 PEXPIREAT 

    - TTL key 获取给定 key 的剩余生存时间，单位 s
    - PTTL key 获取给定 key 的剩余生存时间，单位 ms
      * 返回值
        - -2 过期且已删除
        - -1 没有过期时间设置，即永不过期
        - >0 距离过期时间还有多少 s 或 ms

    - PERSIST key 清除给定 key 的过期时间 
    - 使用 SET 或者 GETSET 为 key 赋值也会清除过期时间，其他只对键值操作的命令不会对过期时间有影响 

  
  ### 事务 
    * 操作命令
      - MULTI 标记一个事务块的开始
        1. 事务块中有多条命令会按照先后顺序放到一个队列中，最后由exec命令执行
        2. 告诉Redis 下面发出来的命令属于同一事务，先将他们存到队列中不要执行，等我消息
      - EXEC 执行事务当中命令，执行完成后表示当前事务已经结束了，想开启新的事务，需要重新执行 MULTI 命令，并添加事务中需要执行的命令
        1. 执行暂存在队列中的事务命令，最终返回每一条
        2. 如果在发送 EXEC 命令之前客户端段掉线了，那么就会清空当前的事务队列中的所有命令
        3. 如果在发送 EXEC 命令之后掉线了，那么也事务队列中的所有命令依然会执行
      - DISCARD 取消事务，放弃执行事务块内的所有命令
      - 保证当前事务队列中的命令会依次执行，不被其他命令插入
      - 语法错误：如果事务的命令队列中存在 有语法错误的命令 那么当前 EXEC 时，会直接返回错误，所有命令都不会执行
      - 运行错误：假如事务中的一条命令是使用散列的命令操作集合的key，那么这条命令会在运行时报错，但是其他命令依然会被执行
    * 错误
      - 由于Redis 事务不支持回滚（rollback），所以在运行出错时，需要开发者自己收拾产生的问题 ，例如数据复原
    * 事务的 WATCH 命令
      - 监视一个或者多个 key ，如果在事务被执行之前额写个key被其他命令改动，那么事务将被中断
      - 假设我先使用 WATCH 监听了 balance 这个 key，然后我使用 MULTI 开启一个事物，并在添加想要执行命令，比如 DECRBY balance 10 等等，但是此时
        在另一个客户端也在修改 balance 这个key中的值，执行 DECRBY balance 5 ，那么我当前的事务就会被中断，因为 balance 已经被修改了
      - 在执行 WATCH 命令之后，如果执行 EXEC 或者是 DISCARD 命令都会自动取消 WATCH
    * 执行示例
      SET Jack 10    设置 jack 有 10块钱
      SET Rose 20    设置 rose 有 20块钱
      MULTI          表示开始添加事务
      DECRBY Jack 5  jack 转出 5块
      INCRBY Rose 5  rose 接收到 5块
      EXEC           开始执行事务，最终结果jack 5块，rose 25块

  ### Redis 持久化
    * RDB持久化
      - 当符合一定条件的时候，Redis会自动将内存中的所有数据生成一份副本并保存在硬盘上，这个过程即为快照
      - 根据指定的规则”定时“将数据存储在硬盘上，在重启之后读取硬盘上的 .rdb 快照文件，将数据恢复到内存中
      - Redis 允许用户自定义快照条件，当符合条件时，Redis会自动执行快照操作。
      - 条件可以在配置文件中自定义，有两个参数组成
        - M 时间窗口，即在多少秒内
        - N 被改动的 key 的个数
        - 即每当时间 M 内，被修改的 key 的个数大于 N，既符合自动快照条件
      - dbfilename dump.rdb 配置快照保存的文件名称
      - dir ./ 配置快照文件的保存路径 
      - 当符合快照条件时，Redis会创建一个子进程来生成一个临时的RDB文件，当写入临时的RDB完成时，在替换掉原本的 .rdb 文件
      - 当Redis因为某些原因停掉了，那么数据库中最近修改的且未写入 RDB 快照文件的数据将丢书 
    * AOF持久化
      - 记录服务器所有的写操作命令，形成 .aof 日志文件保存到硬盘中，并在服务器启动时，通过重新执行这些命令来还原数据集
      - 将 每一条写命令操作日志存储到硬盘文件中，这一过程会显著降低Redis性能，但部分情况可以接受的，也可以使用较快的硬盘（固态硬盘）来提升性能
      - 对于日志的写入操作采用的追加模式，因此在写入过程中宕机了，那么也不会影响已写入的日志 
      - 配置
        1. 将配置文件中的 appendonly 参数改成 yes 即可
        2. 默认保存文件为 appendonly.aof，可以通过 appendfilename 参数来修改文件的保存名称
        3. 通过 dir参数来修改文件的保存为止




