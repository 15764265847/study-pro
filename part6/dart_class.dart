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

import './Person.dart';

void main() {
  var p1 = new Person('zhangsan');
  print(p1.name);
  // 如果类和main函数处于同一作用域，那么 _ 不起作用
  // 此处类和main处于同一文件下，视为同一作用域
  // print(p1._money);
  print(p1.getMoney());
}
