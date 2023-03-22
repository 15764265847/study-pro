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
        - 展开操作符，同 js 中的展开运算符 ，只有有 iterator(遍历器) 的才能使用 
            1. var list = [1, 2, 3]; var list1 = [0, ...list]
        - 遍历
            1. forEach 同 js forEach
            2. map 同 js map ，和 js 不同的是他返回的是一个 iterator(遍历器)，需要调用 toList 方法才能变成 List
            3. where 返回满足条件的数据，同 js 的 filter 方法 ，他返回的也是一个 iterator(遍历器)
            4. any 只要其中一项满足条件就返回 true ，同 js 的 some
            5. every List 中的每一项都满足条件才会返回 true ，同 js 的 every
            6. expand 数组摊平 ，功能类似 js 的 flat ，使用起来不太一样
            7. fold 同 js 的 reduce 方法
                - PS：var s = [1, 2, 3, 4].fold(2, (p, el) => p + el);使用该代码会报错
                    因为 var 的动态类型，会导致后面运算报错
                    结果是什么类型就应该用什么类型的声明，如下最终结果是整数类型 ，应该使用 int 声明的变量来接受返回值 
                    int s = [1, 2, 3, 4].fold(2, (p, el) => p + el);
         