void main() {
  Person pYellow =
      new Person.yellow({'name': '法外狂徒李四', 'age': 25, 'type': 'yellow'});
  print(pYellow.name);
  Person pWhite =
      new Person.white({'name': '叶卡捷琳娜', 'age': 25, 'type': 'white'});
  print(pWhite.name);
  Person pBlack =
      new Person.black({'name': '马丁路德金', 'age': 25, 'type': 'black'});
  print(pBlack.name);
}

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

class Person {
  String name = '';
  int age = 0;
  String type = '';

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
