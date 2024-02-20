### 万物皆对象，变量只是一个引用，存储的是对象的引用
- 大小写敏感： age 和 Age 不是同一个变量
- 变量默认值是 null，js 中不分配值的话，默认值是 undefined ，这一点套用 变量只是一个引用 来说，相对好理解
- dart 变量不会进行隐式转换，即 if(null) 中 ，null 不会转换为 false

### 变量声明
> 初始化声明未赋值时，值为null，例 int a; // a == null
1. var 类似js中的var
2. final 和 const 常量，不可修改 
    - const可以用来创建常量值，以及声明创建常量构造函数
        var foo = const [];
        foo = [42]; // Error: Constant variables can't be assigned a value.
3. late 延迟变量
    - late String foo;
        在某个特定的条件下，将其初始化 foo = '123';
4. 使用数据类型来声明变量
    - list a = [];
        int b = 10;
        String c = '123';

### Dart 数据类型
#### Number 有三个关键字描述
- num 既可以是整数也可以是小数
    - int 整数
    - double 浮点数，整数小数皆可
#### String
- 单双引号皆可 
- 三个引号可以声明包含换行符的字符串 PS：这语法感觉有点奇怪
- 正则
    1. RegExp(r'正则表达式'); 例: RegExp(r'\d+')
#### Boolean
- 通过 bool 关键字声明
- 要显示判断变量，因为 dart 不会隐式类型转换
    - 错误示例 if (变量)
    - 正确示例 if (变量 != 0)  if (变量 != null)
#### List：dart 中的数组 ，类似 js 中的 Array
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
        > var s = [1, 2, 3, 4].fold(2, (p, el) => p + el);使用该代码会报错
            因为 var 的动态类型，会导致后面运算报错
            结果是什么类型就应该用什么类型的声明，如下最终结果是整数类型 ，应该使用 int 声明的变量来接受返回值 
            int s = [1, 2, 3, 4].fold(2, (p, el) => p + el);
#### Set：无序的，元素唯一的集合，无法通过下标取值。类似 js 中的 Set 类型
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
#### Map： 无序的键值对的映射，同城被称作哈希或者字典
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
#### 其他数据类型
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
#### 声明函数
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
#### 函数参数
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
#### 函数作用于与闭包 
> 与 js 类似
#### 异步函数 使用 future 来实现
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
#### 类
##### 简介
1. 通过class关键字声明的代码段，包含属性和方法
    * 属性 描述类的变量
    * 方法 类中的函数成为类的方法
2. 对象 是类的实例化结果 var obj = new Myclass();
##### 构造函数
1. 普通构造函数，就是在类当中声明一个和类同名的函数，new 的时候会自动调用这个函数
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
2. 命名构造函数 类名.函数名 可实现多个构造函数，提供额外的清晰度
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
3. 常量构造函数，如果类生成的对象不会进行改变，那么我们可以使用常量构造函数是这些对象成为编译时常量
    ```
        void main() {
            // 常量构造函数可以当做普通构造函数使用，使用了 new 之后常量构造函数就变成了普通构造函数
            var b1 = new Bird(2, 1);
            var b2 = new Bird(2, 1);
            print(b1 == b2); // false

            常量构造函数可以省略 new 关键字，但是过等同于使用了 new 关键字
            var b5 = Bird(2, 1);
            var b6 = Bird(2, 1);
            print(b5 == b6); // false

            // 正确使用方式是使用 const 关键字来生成对象
            var b3 = const Bird(2, 1);
            var b4 = const Bird(2, 1);
            print(b3 == b4); // true
        }
        class Bird {
            // 属性必须通过 final 声明
            final eyes;
            final mouse;

            // 常量构造函数必须通过 const 声明
            // 如果属性中有非 final 声明的就会报错
            // 常量构造函数后面不能加 {} 以及包含在 {} 之中的函数体，因为如果包含函数体那么就不能保证属性是一定不变的
            const Bird(this.eyes, this.mouse);
        }
    ```
4. 工厂构造函数
    > 通过 factory 关键字声明，工厂构造函数不会自动生成实例，而是通过代码决定返回的实例
    // 实际代码示例展示了一个单例模式
    ```
        void main() {
            // 工厂构造函数不能够进行实例化操作
            Dog d1 = new Dog('jecy');
            print(d1.name); // The getter 'name' was called on null.
        }
        class Dog {
            String name;

            static Dog instance;

            // 工厂构造函数
            factory Dog([String name = 'candy']) {
                // 工厂构造函数不能使用 this 关键字
                // print(this.name); // 报错
                if (Dog.instance == null) {
                    Dog.instance = new Dog.newSelf(name);
                } else {
                    return Dog.instance;
                }
            }

            Dog.newSelf(this.name);
        }
    ```
##### 访问修饰符
- dart类 中没有 TS 的 public protected private 三个修饰符 
- dart类 中默认的访问修饰符就是 public，不需要手动添加
- dart类 中 以 _ 开头的变量名就代表该变量是 私有的 (private)
- 只有把类单独抽离出去的时候 以 _ 开头的属性才会起作用，不会被直接访问 
    > 例如把类单独封装到某一文件夹下，在主文件中 import
    * lib/Person.dart
    * import 'lib/Person.dart'
    ```
        // lib/Person.dart
        class Person {
            String name;
            num _money = 100;
            Person(this.name);

            num getMoney () {
                return this._money;
            }
        }

        // 主文件
        import './Person.dart';
        void main() {
            var p1 = new Person('zhangsan');
            print(p1.name);
            // 如果类和main函数处于同一作用域，那么 _ 不起作用
            // 此处类和main处于同一文件下，视为同一作用域
            // print(p1._money); // 报错
            print(p1.getMoney());
        }
    ```
##### Getter Setter
* Getter 通过get关键字修饰的方法，可以像访问属性一样访问，类似js 的 class 中的 get 关键字
* Setter 通过set关键字修饰的方法，可以像设置属性一样赋值，类似js 的 class 中的 set 关键字
```
    void main() {
        var c1 = new Circle(10);
        c1.setR = 20;
        print(c1.area);
    }

    class Circle {
        final PI = 3.14159;
        num r;
        Circle(this.r);
        num get area {
            return this.r * this.r * this.PI;
        }

        set setR(val) {
            this.r = val;
        }
    }
```
##### 初始化列表
1. 作用：在构造函数中设置属性默认值
2. 时机：在构造函数体执行之前执行
3. 语法：使用逗号分隔初始化表达式
4. 场景：常用于 final 常量的值
```
void main() {
    var p1 = new Point(1, 2, 3);
    print(p1.z); // 3

    var p2 = new Point.twoD(3, 4);
    print(p2.z); // 0
}

class Rect {
    num width;
    num height;

    // Rect([int width = 10, int height = 20]) {
    //   this.width = width;
    //   this.height = height;
    //   print('width: $width, height: $height');
    // }

    // Rect({int width = 10, int height = 20}) {
    //   this.width = width;
    //   this.height = height;
    //   print('width: $width, height: $height');
    // }

    Rect()
        : width = 10,
            height = 10 {
        this.width = width;
        this.height = height;
        print('width: $width, height: $height');
    }
}

class Point {
    double x, y, z;

    Point(this.x, this.y, this.z);

    // 初始化列表的特殊用法（重定向构造函数）
    // 这种用法类似函数柯里化
    Point.twoD(double x, double y) : this(x, y, 0);
}
```
##### static
- 用来指定静态成员
- 使用类名直接访问该属性
- 实例化比较消耗资源，声明静态属性，可以提高程序性能
- 静态方法不能访问非静态成员，非静态方法可以访问静态成员
- 静态方法中不能使用this。js中是可以使用的
- 不能使用this关键字访问静态属性，但可以直接访问。js中是可以访问的，访问到的 this 指向构造函数
```
void main() {}

class Person {
    static String name = '123';
    int ahe = 20;

    static getName() {
        print(name);
        // print(age); // 静态方法不能访问非静态成员
    }
}
```
##### 元数据
- 以 @ 开头，给代码添加一些额外信息，可以用在库、类、构造器、函数、参数或者变量声明前面
- @override 重写，某方法前添加后表示重写了父类中的方法
- @required 必填，用来注解命名参数，表示该参数必填
- @deprecated 弃用，类或者方法前面添加，表示该类或者方法已废弃不再建议使用
##### 继承
- 使用 extends 关键字
##### 抽象类
- 使用 abstract 修饰
- 抽象类的作用是充当普通类模板，约定一些必要要的属性和方法
- 抽象方法是指没有方法体的方法
    > 抽象类一般都有抽象方法，也可以没有抽象法
    > 普通类中不能有抽象方法
- 抽象类不能被实例化
- 抽象类可以被普通类继承 使用 extends 关键字
    > 如果普通类继承抽象类，必须实现抽象类中所有的抽象方法
- 抽象类还可以充当接口被实现 implements 关键字
    > 如果抽象类被当做接口实现的话，必须实现抽象类当中定义的所有的方法和属性
```
void main() {
var a1 = new Apple();
    // 抽象类中的普通方法会被继承
    a1.info();
}

abstract class Mobile {
    String name;
    num price;

    // 声明抽象方法
    void call();
    void camera();
    void info() {
        print('随便输出一点东西');
    }
}

// 普通类继承抽象类必须实现抽象类中定义的所有抽象方法，属性不是一定要实现的
class Apple extends Mobile {
    void call() {
        print('call');
    }

    void camera() {
        print('camera');
    }

    // viod aaa(); 此处报错，因为普通类中不能有抽象方法
}
```
##### 接口
- 接口在dart中就是一个类，只是用法不同
    > java中的接口要使用interface关键字实现，dart不需要，js更是没有这个概念
    > 接口可以是任意类，但是一般是使用抽象类作为接口
- 一个类可以实现多个接口，多个接口使用逗号分割
    > class MyClass implements inteface1, interface2, ... { ... }
    > 接口可以看成一个个小零件，类实现接口相当于是组装零件
- 普通类实现接口必须实现接口内定义的所有的属性和方法
```
void main() {
    var m = new Mobile(4, '10000万');

    m.arch('4nm');
    m.brand('三星');
}

abstract class Processor {
    num cores; // 芯片核数

    arch(String name); // 芯片制程
}

abstract class Camera {
    String resolution; // 像素

    brand(String name); // 品牌
}

class Mobile implements Processor, Camera {
    @override
    num cores = 10;

    @override
    String resolution = '10000万像素';

    Mobile(this.cores, this.resolution);

    @override
    arch(String name) {
        print('芯片制程：$name');
    }

    @override
    brand(String name) {
        print('品牌：$name');
    }
}
```
##### Mixin
- 混入是一段公共代码，混入有两种声明方式
    * 将类当做混入使用 class MixinA { ... }
        > 作为 Mixin 的类只能继承自 Object，不能继承其他类
        > 作为 Mixin 的类不能有构造函数
    * 使用 mixin 关键字声明 mixin MixinB { ... }
- Mixin 可以调代码复用率，普通类可以使用 with 来会用混入
    > class A with MixinA, MixinB, ... { ... }
- 一次性使用多个混入时，后引入的混入会覆盖之前引入的重名属性或方法
    > class A with MixinA, MixinB, ... { ... }，如果 MixinA MixinB 中都有 hello 方法，那么 MixinB 会覆盖 MixinA 的
```
void main() {
    var m1 = new MyClass();

    m1.printA();
    m1.printB();
    // 重名属性或方法，后引入的会覆盖之前的
    print(m1.name);
}

class MixinA extends Object {
    // 类当做混入使用只能继承自 Object，默认也会继承自 Object，不能继承自其它的类
    String name = 'A';
    // MixinA(); 类当做混入使用不能添加构造函数
    printA() {
        print('A');
    }
}

mixin MixinB {
    String name = 'B';

    printB() {
        print('B');
    }
}

class MyClass with MixinA, MixinB {}
```
##### 泛型
- 泛型是在函数、类、接口中执行宽泛类型的语法
    > 使用泛型的函数叫泛型函数，使用泛型的类叫泛型类，使用泛型的接口叫泛型接口
- 通常，在尖括号中，使用一个字母来代表类型，例如 E T S K V 等
    > 返回类型 函数名 <输入类型>(参数类型 参数) { 函数体 }
    > S getData<T, S>(T value) { return value; }
- 使用泛型可以减少重复的代码
- 泛型函数, 使用类似 TS 中的函数的泛型
    ```
    T getAnything<T>(T value) {
        return value;
    }
    ```
- 泛型类
    ```
    class GenericsClass<T, S, P> {
        T a;
        Set b = new Set<S>();
        List c = <P>[];

        GenericsClass(this.a);

        addB(S val) {
            this.b.add(val);
        }

        addC(P val) {
            this.c.add(val);
        }
    }
    ```
- 泛型接口
    ```
    void main() {
        var f1 = new FileCache<String>();
        f1.getByKey('a');
    }

    abstract class Cache<T> {
        getByKey(String key);
        void setByKey(String key, T value);
    }

    class FileCache<T> implements Cache<T> {
        FileCache();

        @override
        getByKey(String key) {}

        @override
        void setByKey(String key, T value) {}
    }
    ```
- 泛型类型限制
    * 对泛型进行类型限制
    ```
    void main() {
        var f = new Foo<SomeBaseClass>();
        print(f);

        var f1 = new Foo<ExtendsSomeBaseClass>();
        print(f1);

        var f2 = new Foo();
        print(f2);
    }

    class SomeBaseClass {}

    class ExtendsSomeBaseClass extends SomeBaseClass {}

    class Foo<T extends SomeBaseClass> {
        String toString() => 'Instance of Foo<$T>';
    }
    ```
##### 枚举，使用关键字 enum 声明 ，关键字为 enumeration 缩写
- 枚举是数量固定的常量值
    > enum Color { red, green, blue }
- 枚举的 values 常量，可以获取到枚举的所有值的列表
    > List<Color> l = Color.values;
- 可以通过 index 获取值的索引
    > assert(Color.green.index == 1);
```
void main() {
    print(Colors.blue == 2);
    print(Colors.green.index);
    List<Colors> colors = Colors.values;

    print(colors);

    colors.forEach((item) {
        print('value: $item, index: ${item.index}');
    });
}

enum Colors { red, green, blue }
```
##### extension(扩展)
1. Dart 2.7 以上才支持这个关键字，2.7以下用不了
2. extension 可以扩展对象的内容
    * 示例 `extension StringExtension on String { ... }`
    * 扩展不仅可以定义方法，还可以定义 setter、getter、operator
    * 使用，以下代码是扩展的 内置类 String，他还可以扩展自定义类，写法与扩展的内置类类似
        ```
        void main() {
            String data = '100';
            print(data.parseInt());
        }

        extension StringExtension on String {
            parseInt() {
                return int.parse(this);
            }
        }
        ```
##### call
![img](./images/C0FE37E4-147D-4285-B833-DA75FF119474.png)
> 把类的实例化对象当做函数调用时，必须在类中定义 call 函数

##### noSuchMethod
> 当我们调用了一个类的未定义的方法时，dart会自动调用 noSuchMethod 方法
> 如果类中定义了该方法则会调用类中定义的 noSuchMethod ，如果类中没有定义该方法则会调用默认的 noSuchMethod
> 在类中定义该方法时，方法名必须是 noSuchMethod
1. 使用前提
    * 类中必须定义 noSuchMethod
    * 实例化定义了 noSuchMethod 方法的类时，必须使用 dynamic 来声明
        > dynamic p = new Person();
    * 低啊用的一定是类中没有定义的方法

##### hashCode
> `xxx.hashCode` 即可获取到 hashCode
1. hashCode 是 Dart 中对象的唯一标识
2. hashCode 表现为一串数字
3. Dart 中的每一个对象都有 hashCode
4. 可以通过判断 hashCode 是否相等来判断两个对象是否相等

### Dart 库与生态
#### 简介
    * Dart中的库就是具有特定功能的模块
        > 可能包括单个文件，也可能包含多个文件  
    * 按照库的作者划分可以分为三类
        1. 自定义库（工程是自己写的）
        2. 系统库，Dart自带的
            > 系统库文档地址 https://dart.cn/guides/libraries
        3. 第三方库 其他人开发的开源库
            - 来源
                1. https://pub.dev
                2. https://flutter-io.cn/packages
                3. https://pub.dartlang.org/flutter
            - 使用 
                1. 在项目目录下创建 pubspec.yaml 文件
                2. pubspec.yaml 中声明第三方依赖库
                3. 命令行中进入 pubspec.yaml 所在目录 执行 dart pub get 命令进行安装
                4. 在项目中引入已安装的第三方库
                    > import 'packages:xxxx/xxxx.dart';
                    * 以 http 第三方包为示例
                        > impot 'pachages:http:http.dart'
                    * 每一个第三方库中都必须包含一个 pubspec.yaml 文件
                        - 第三方库目录结构图 
                          > ![img](./images/C0FE37E4-147D-4285-B833-DA75FF119474.png)
                    * pubspec.yaml
                        - 详情 可以在 https://dart.cn/tools/pub/pubspec 中查看
                        - 文件结构
                          > ![img](./images/C564B109-508E-4130-88F8-4048F7785217.png)

    * Dart 生态
        * https://pub.dev/
        * pub 命令 
#### 自定义库 通过 library 关键字声明
    * 每个 Dart 文件默认都是一个库，只是没有使用 library 来显示声明
        ![img](./images/C1FFC455-CE6B-4F68-BBF9-27383CEE022B.png)
    * Dart 使用 _ 开头的标识符，表示库内访问可见，意思就是当前文件内访问可见，其他的文件里访问不到
        > 所以前面在 [类与对象](# 类与对象)的3中，在 main 函数中可以访问到 _ 开头的属性和方法
    * 使用 library 声明库名称的时候建议使用 小写字母 + _
    * 使用 import 关键字引入库
        1. 不同类型的库，引入方式不同
            * 自定义库 import xxx/xxx.dart;
            * dart 系统的内置库 import 'dart:xxx';
                > import 'dart:html';
                > import 'dart:core'; core 是 dart 的核心，会被默认引入，不需要手动引入
            * 第三方库 
        2. 引入部分库 按需引入
            * 包含引入 使用 show 关键字，实际就是按需引入，show 后面指定引入的内容
                > import 'xxx.dart' show func1, func2, ...;
            * 排除引入 使用 hide 关键字，不引入 hide 后面的内容
                > 加入一个库中有 10 个函数，其中有两个不需要，那么就可以使用 hide 隐藏掉不需要的两个，只引入其他的，实际就是 show 其他8个
                > import 'xxx.dart' hide func1, func2, ...;
        3. 当不同库之间有同名变量或者函数需要引入时，这个时候需要 指定库的前缀
            > 使用 as 关键字 给库声明一个前缀
            ```
                // 1.dart中
                f1 () {
                    print('1.dart')
                }
                // 2.dart
                f1 () {
                    print('2.dart')
                }
                // 3.dart
                import './1.dart';
                import './2.dart' as func;
                void main () {
                    f1(); // 此处是1.dart中的 f1
                    func.f1(); // 此处是2.dart中的 f1
                }
            ```
        4. 延迟引入，懒加载
            > 使用 deferred as 关键字来标识需要延时加载的库
            ```
            import './1.dart' deferred as doSomething

            void main () {
                loadAndDo();
            }

            Future loadAndDo() async {
                await doSomething.loadLibrary();
                doSomething.f1();
            }
            ```
        5. part 和 part of
            * part of 后面跟的是库名，即 使用 library 关键字声明的库的名称
            * part 后面跟的是 库文件位置
            ```
            // 分库 sub1.dart
            part of utils; // 与主库建立联系

            int foo () {...}

            // 分库 sub2.dart
            part of utils; // 与主库建立联系

            int bar () {...}

            // 主库 utils.dart
            library utils;

            part 'sub1.dart';// 与分库建立联系
            part 'sub2.dart';// 与分库建立联系

            String Hello () {...}

            // 使用
            import 'utils.dart';

            void main () {
                foo(); // 来自sub1.dart
                bar(); // 来自sub2.dart
                Hello(); // 来自utils.dart
            }
            ```
