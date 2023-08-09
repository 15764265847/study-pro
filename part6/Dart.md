### 万物皆对象，变量只是一个引用，存储的是对象的引用
    - 大小写敏感： age 和 Age 不是同一个变量
    - 变量默认值是 null，js 中不分配值的话，默认值是 undefined ，这一点套用 变量只是一个引用 来说，相对好理解
    - dart 变量不会进行隐式转换，即 if(null) 中 ，null 不会转换为 false

### Dart 数据类型
    1. Number 有三个关键字描述
        - num 既可以是整数也可以是小数
            - int 整数
            - double 浮点数，整数小数皆可
    2. String
        - 单双引号皆可 
        - 三个引号可以声明包含换行符的字符串 PS：这语法感觉有点奇怪
        - 正则
            1. RegExp(r'正则表达式'); 例: RegExp(r'\d+')
    3. Boolean
        - 通过 bool 关键字声明
        - 要显示判断变量，因为 dart 不会隐式类型转换
            - 错误示例 if (变量)
            - 正确示例 if (变量 != 0)  if (变量 != null)
    4. List：dart 中的数组 ，类似 js 中的 Array
        - 声明方式
            1. 字面量 声明出来的数组不限定长度
                - List list = []; 不限定数组内元素类型且不限长度
                - List list = <int>[]; 限定元素类型，只能为整形
            2. 构造函数
                - List list = new List.empty(growable: true); 不限长度的空列表
                - List list = new List.filled(3, 0); 长度为 3，并且元素填充为 0
            3. 可通过 toSet 输出成 Set 类型，可用于去重
        - 展开操作符，同 js 中的展开运算符 ，只有有 iterator(遍历器) 的才能使用 
            1. var list = [1, 2, 3]; var list1 = [0, ...list]
        - 遍历
            1. forEach 同 js forEach
            2. map 同 js map ，和 js 不同的是他返回的是一个 iterator(遍历器)，需要调用 toList 方法才能变成 List
            3. where 返回满足条件的数据，同 js 的 filter 方法 ，他返回的也是一个 iterator(遍历器)
            4. any 只要其中一项满足条件就返回 true ，同 js 的 some
            5. every List 中的每一项都满足条件才会返回 true ，同 js 的 every
            6. expand 数组摊平 ，功能类似 js 的 flat ，使用起来不太一样
            7. fold 数组归并 同 js 的 reduce 方法基本一致，除了 reduce 的初始值是第二个参数
                - PS：var s = [1, 2, 3, 4].fold(2, (p, el) => p + el);使用该代码会报错
                    因为 var 的动态类型，会导致后面运算报错
                    结果是什么类型就应该用什么类型的声明，如下最终结果是整数类型 ，应该使用 int 声明的变量来接受返回值 
                    int s = [1, 2, 3, 4].fold(2, (p, el) => p + el);
    5. Set：无序的，元素唯一的集合，无法通过下标取值。类似 js 中的 Set 类型
        - 声明方式
            1. 字面量
                - var nums = <int>{1, 2, 3};
                - var nums = <int>{1, 2, 2, 3};print(nums); // {1, 2, 3}
            2. 构造函数
                - var fruits = new Set();
                  fruits.add('banana');
                  fruits.add('apple');
                  fruits.add('orange');
                  print(fruits); // { banana, apple, orange }
                - 可通过 toList 方法输出 List 类型
                  print(fruits.toList()); // [ banana, apple, orange ]
        - api
            0. 背景代码，用于后面的操作
               var caocaofriend = new Set();
               caocaofriend.addAll('张辽', '司马懿', '关羽');
               var liubeifriend = new Set();
               liubeifriend.addAll('关羽', '张飞', '诸葛亮');
            1. addAll 一次性添加多个元素
                - var fruits = new Set();fruits.addAll(['banana', 'apple', 'orange']);
            2. intersection 交集 // 返回 caocaofriend 与 liubeifriend 交集的集合
                - caocaofriend.intersection(liubeifriend); // { 关羽 }
            3. union 并集 // 返回 caocaofriend 与 liubeifriend 并集的去重的集合
                - caocaofriend.union(liubeifriend); // { 张辽, 司马懿, 关羽, 张飞, 诸葛亮 }
            4. difference 差集 // 返回 caocaofriend 与 liubeifriend 交集的集合
                - caocaofriend.difference(liubeifriend); // { 张辽, 司马懿 }
            5. 属性
                - first 返回集合的第一个元素 print(caocaofriend.first) // 张辽
                - last 返回集合的最后一个元素 print(caocaofriend.last) // 关羽
            6. 其他还有很多 api 包含 any every 等
    6. Map： 无序的键值对的映射，同城被称作哈希或者字典
        - 声明方式
            1. 字面量, 类似 js 中对象的声明方式
                var map = { key1: value1, key2: value2 }
            2. 构造函数, 类似 js 中 const obj = {};obj.a = 'xxxx';
                var map = new Map(); map['key1'] = value1;
                新版 dart 中可以省略new， var map = Map();
        - api
            0. var noNewFruit = Map();
               noNewFruit['name'] = 'apple';
               noNewFruit['color'] = 'red';
            1. containsKey 判断 key 是否存在, 返回 true 或 false
                - noNewFruit.containsKey('name'); // true
            2. containsValue 判断 value 是否存咋
                - noNewFruit.containsValue('red'); // true
            3. putIfAbsent key不存在才会赋值，存在则不赋值
                - noNewFruit.putIfAbsent('prince', () => '$100');
            4. keys 属性，获取 Map 的所有的 key。类似的还有 values entries 两个属性。
               他们返回的都是遍历器，可使用 toList 或 ...(展开运算符) 转换成 List 
                - print(noNewFruit.keys);
            5. removeWhere 根据条件删除键值对
                - noNewFruit.removeWhere((key, value) => key === 'prince'); 删除 key 是 prince 的键值对
    7. 其他数据类型
        1. Runes 符文
            - Runes 对象是一个 32 位字符对象，他可以把文字转换成符号表情或特定的文字
            - print('\u{1f44d}'); 输出一个表情，👍🏻 类似这样的，但颜色可能和这个不一样
            - utf-32 字符集包含内容 https://copychar.cc
            - var str = '😁';
              print(str.length); // 2 ,因为dart中用是的 utf-16 的字符集，一个字符占16位，但是表情是 32 位的，得用2个字符表示，所以直接输出length 就等于 2
              print(str.runes.length); // 1 ，runes 是 32 位的，所以一个字符就可以展示一个表情
            - 将字符转换为对应的表情
              Runes input = new Runes('\u{1f680}');
              print(new String.fromCharCodes(input));
        2. Symbol 表示反射的概念，js 中的表示的是唯一值
            - 在 Dart 中符号用 # 开头来表示的标识符
            - 
              ```
              var a = #abc;
              print(a); // Symbol('abc')
              var b = new Symbol('abc');
              print(b); // Symbol('abc')
              ```
        3. dynamic
            - 动态数据类型

### 运算符号
    1. ~/ 地板除，意思是除完之后会向下取整，就是融合了 除 和 向下取整 两个操作的运算符
    2. is is! 类型判断运算符 类似 js 中的 instanceOf
    3. ?? ??= 避空运算符 如果变量为 空 ，就赋值，不为空不赋值
        - ?? 不具有赋值效果
        - ??= 具有赋值效果， 
           ```
           var a; a ??= 3;print(a); // 3
           a ??= 6;print(a); // 3
           ```
    4. ?. 条件属性访问
    5. .. 级联运算符
        - obj.func(); // func函数的输出结果
        - obj..func(); // 会返回 obj 的引用，这个运算符的作用就是用来 链式调用 的，相当于在 js 函数的最后返回当前对象的链式调用
### 函数
    1. 声明函数
        List b = [1, 2, 3, 4];
        - 直接声明，可以不写关键字
            ```
            void printInfo() {
                print('Hello, World');
            }
            ```
        - 箭头函数 函数体只能写一行，且不能带有结束的分号
            ```
            b.forEach((element) => {print(element)});
            ```
        - 匿名函数
            ```
            b.forEach((element) {
                print(element);
            });
            ```
        - 立即执行函数
            ```
            ((int n) {
                print(n * 8);
            })(6);
            ```
    2. 函数参数
        - 必填参数
            1. 参数类型 参数名称
            ```
            void userInfo(String name, [int age = 30]) {
                print('你好，$name, 年龄，$age');
            }
            ```
        - 可选参数
            1. 放在必选参数后
            2. 使用中括号包裹
            3. 带默认值的参数
            ```
            void userInfo(String name, [int age = 30]) {
                print('你好，$name, 年龄，$age');
            }
            ```
        - 命名参数
            1. 使用大括号包裹
            2. 函数调用时，命名参数的名称与声明函数中的名称保持一致
            ```
            void userInfo(String name, {int age = 30}) {
                print('你好，$name, 年龄，$age');
            }
            // 调用的时候需要把名字给传进来
            userInfo('法外狂徒张三', age: 25);
            ```
        - 函数参数
            ```
            var printNum = (n) {
                print(n);
            };
            List b = <int>[1, 2, 3, 4];
            b.forEach(printNum);
            ```
    3. 函数作用于与闭包 与 js 类似
    4. 异步函数 使用 future 来实现
        1. async 函数返回一个 future ，await 等待 future
        2. then
            ```
            Future getIp() {
                final url = 'https://httpbin.org/ip';
                return http.get(url).then((res) {
                    print(res.body);
                    String ip = jsonDecode(res.body)['origin'];
                    print(ip);
                });
            }
            getIp().then((ip) => {print(ip)}).catchError((err) => {print(err)});
            ```
        3. async await
            ```
            void main () async {
                final ip = await getIp();
            }
            Future getIp() async {
                final url = 'https://httpbin.org/ip';
                final res = await http.get(url);
                print(res.body);
                String ip = jsonDecode(res.body)['origin'];
                print(ip);
            }
            ```
### 类与对象
    - 类
        1. 简介
            + 通过class关键字声明的代码段，包含属性和方法
                * 属性 描述类的变量
                * 方法 类中的函数成为类的方法
            + 对象 是类的实例化结果 var obj = new Myclass();
        2. 构造函数
            + 普通构造函数，就是在类当中声明一个和类同名的函数，new 的时候会自动调用这个函数
                ```
                class Person {
                    String name = '';
                    int age = 0;

                    Person(Map options) {
                        // 还是不省略比较好，因为省略了本身就看不太明白
                        // 类中的 this 可以省略，当命名指向有歧义的时候不能省略
                        // name = options['name'] ?? '法外狂徒张三';
                        // age = options['age'] ?? 30;
                        this.name = options['name'] ?? '法外狂徒张三';
                        this.age = options['age'] ?? 30;
                    }

                    String getName() {
                        return this.name;
                    }

                    int getAge() {
                        return this.age;
                    }
                }
                ```
            + 命名构造函数 类名.函数名 可实现多个构造函数，提供额外的清晰度
                ```
                void main() {
                    Person p = new Person();
                    Person pYellow = new Person.yellow({'name': '法外狂徒李四', 'age': 25, 'type': 'yellow'});
                    print(pYellow.name);
                    Person pWhite = new Person.white({'name': '叶卡捷琳娜', 'age': 25, 'type': 'white'});
                    print(pWhite.name);
                    Person pBlack = new Person.black({'name': '马丁路德金', 'age': 25, 'type': 'black'});
                    print(pBlack.name);
                }
                class Person {
                    String name = '';
                    int age = 0;
                    String type = '';

                    Person() {}
                    Person.white(Map options) {
                        this.name = options['name'] ?? '叶卡捷琳娜';
                        this.age = options['age'] ?? 30;
                        this.type = options['type'] ?? 'white';
                    }
                    Person.black(options) {
                        this.name = options['name'] ?? '马丁路德金';
                        this.age = options['age'] ?? 30;
                        this.type = options['type'] ?? 'black';
                    }
                    Person.yellow(options) {
                        this.name = options['name'] ?? '法外狂徒张三';
                        this.age = options['age'] ?? 30;
                        this.type = options['type'] ?? 'yellow';
                    }

                    String getName() {
                        return this.name;
                    }

                    int getAge() {
                        return this.age;
                    }
                }
                ```
        3. 访问修饰
        4. Getter Setter
        5. 初始化列表
        6. static
        7. 元数据


            