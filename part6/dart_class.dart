// ignore_for_file: missing_return

// void main() {
// Person pYellow =
//     new Person.yellow({'name': '法外狂徒李四', 'age': 25, 'type': 'yellow'});
// print(pYellow.name);
// Person pWhite =
//     new Person.white({'name': '叶卡捷琳娜', 'age': 25, 'type': 'white'});
// print(pWhite.name);
// Person pBlack =
//     new Person.black({'name': '马丁路德金', 'age': 25, 'type': 'black'});
// print(pBlack.name);
// var d1 = new Dog(4, 2);
// var d2 = new Dog(4, 2);
// print(d1 == d2);

// // 常量构造函数可以当做普通构造函数使用，使用了 new 之后常量构造函数就变成了普通构造函数
// var b1 = new Bird(2, 1);
// var b2 = new Bird(2, 1);
// print(b1 == b2);

// // 正确使用方式是使用 const 关键字来生成对象
// var b3 = const Bird(2, 1);
// var b4 = const Bird(2, 1);
// print(b3 == b4);

// 工厂构造函数不能够进行实例化操作
// Dog d1 = new Dog('jecy');
// print(d1.name); // The getter 'name' was called on null.
// }

// class Person {
//   String name = '';
//   int age = 0;

//   Person(Map options) {
//     this.name = options['name'] ?? '法外狂徒张三';
//     this.age = options['age'] ?? 30;
//   }

//   String getName() {
//     return this.name;
//   }

//   int getAge() {
//     return this.age;
//   }
// }

// class Person {
//   String name = '';
//   int age = 0;
//   String type = '';

//   Person.white(Map options) {
//     this.name = options['name'] ?? '叶卡捷琳娜';
//     this.age = options['age'] ?? 30;
//     this.type = options['type'] ?? 'white';
//   }
//   Person.black(options) {
//     this.name = options['name'] ?? '马丁路德金';
//     this.age = options['age'] ?? 30;
//     this.type = options['type'] ?? 'black';
//   }
//   Person.yellow(options) {
//     this.name = options['name'] ?? '法外狂徒张三';
//     this.age = options['age'] ?? 30;
//     this.type = options['type'] ?? 'yellow';
//   }

//   String getName() {
//     return this.name;
//   }

//   int getAge() {
//     return this.age;
//   }
// }

// class Dog {
//   num eys = 2;
//   num mouse = 1;

//   Dog(this.eys, this.mouse);
// }

// class Bird {
//   // 属性必须通过 final 声明
//   final eyes;
//   final mouse;

//   // 常量构造函数必须通过 const 声明
//   // 如果属性中有非 final 声明的就会报错
//   // 常量构造函数后面不能加 {} 以及包含在 {} 之中的函数体，因为如果包含函数体那么就不能保证属性是一定不变的
//   const Bird(this.eyes, this.mouse);
// }

// class Dog {
//   // 实际代码示例展示了一个单例模式
//   String name;

//   static Dog instance;

//   // 工厂构造函数
//   factory Dog([String name = 'candy']) {
//     // 工厂构造函数不能使用 this 关键字
//     // print(this.name); // 报错
//     if (Dog.instance == null) {
//       Dog.instance = new Dog.newSelf(name);
//     } else {
//       return Dog.instance;
//     }
//   }

//   Dog.newSelf(this.name);
// }

// import './Person.dart';

// void main() {
//   var p1 = new Person('zhangsan');
//   print(p1.name);
//   // 如果类和main函数处于同一作用域，那么 _ 不起作用
//   // 此处类和main处于同一文件下，视为同一作用域
//   // print(p1._money);
//   print(p1.getMoney());
// }

// void main() {}

// class Person {
//   static String name = '123';

//   static getName() {
//     print(name);
//   }
// }

// void main() {
//   var a1 = new Apple();
//   // 抽象类中的普通方法会被继承
//   a1.info();
// }

// abstract class Mobile {
//   String name;
//   num price;

//   // 声明抽象方法
//   void call();
//   void camera();
//   void info() {
//     print('随便输出一点东西');
//   }
// }

// // 普通类继承抽象类必须实现抽象类中定义的所有抽象法，属性不是一定要实现的
// class Apple extends Mobile {
//   void call() {
//     print('call');
//   }

//   void camera() {
//     print('camera');
//   }

//   // viod aaa(); 此处报错，因为普通类中不能有抽象方法
// }

// void main() {
//   var m = new Mobile(4, '10000万');

//   m.arch('4nm');
//   m.brand('三星');
// }

// abstract class Processor {
//   num cores; // 芯片核数

//   arch(String name); // 芯片制程
// }

// abstract class Camera {
//   String resolution; // 像素

//   brand(String name); // 品牌
// }

// class Mobile implements Processor, Camera {
//   @override
//   num cores = 10;

//   @override
//   String resolution = '10000万像素';

//   Mobile(this.cores, this.resolution);

//   @override
//   arch(String name) {
//     print('芯片制程：$name');
//   }

//   @override
//   brand(String name) {
//     print('品牌：$name');
//   }
// }

// void main() {
//   var m1 = new MyClass();

//   m1.printA();
//   m1.printB();
//   // 重名属性或方法，后引入的会覆盖之前的
//   print(m1.name);
// }

// class MixinA extends Object {
//   // 类当做混入使用只能继承自 Object，默认也会继承自 Object，不能继承自其它的类
//   String name = 'A';
//   // MixinA(); 类当做混入使用不能添加构造函数
//   printA() {
//     print('A');
//   }
// }

// mixin MixinB {
//   String name = 'B';

//   printB() {
//     print('B');
//   }
// }

// class MyClass with MixinA, MixinB {}

// T getAnything<T>(T value) {
//   return value;
// }

// class GenericsClass<T, S, P> {
//   T a;
//   Set b = new Set<S>();
//   List c = <P>[];

//   GenericsClass(this.a);

//   addB(S val) {
//     this.b.add(val);
//   }

//   addC(P val) {
//     this.c.add(val);
//   }
// }

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
