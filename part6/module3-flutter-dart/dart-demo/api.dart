import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  // var caocaofriend = new Set();
  // caocaofriend.addAll(['关羽', '司马懿', '张辽']);
  // var liubeifriend = new Set();
  // liubeifriend.addAll(['关羽', '张飞', '诸葛亮']);

  // print(caocaofriend.intersection(liubeifriend));
  // print(caocaofriend.first);

  // var person = {'name': '张三', 'age': 20};
  // print(person);
  // var fruit = new Map();
  // fruit['name'] = 'banana';
  // fruit['color'] = 'yellow';
  // print(fruit);

  // 可以省略 new 直接声明
  // var noNewFruit = Map();
  // noNewFruit['name'] = 'apple';
  // noNewFruit['color'] = 'red';
  // print(noNewFruit);
  // print(noNewFruit['name']);
  // print(noNewFruit.containsValue('red'));
  // noNewFruit.putIfAbsent('prince', () => '\$100');
  // print(noNewFruit);
  // noNewFruit.putIfAbsent('prince', () => '￥600');
  // print(noNewFruit);
  // print([...noNewFruit.values]);
  // print(noNewFruit.keys);
  // print(noNewFruit.entries.toList());

  // Runes input = new Runes('\u{1f680}');
  // print(new String.fromCharCodes(input));

  // print(1 ?? 3);
  // print(null ?? 12);

  // var foo;
  // print(foo ?? 1);
  // printInfo();
  // int a = getNum(3, 4);
  // print(a);
  // var printNum = (n) {
  //   print(n);
  // };
  // List b = <int>[1, 2, 3, 4];
  // b.forEach(printNum);
  // b.forEach((element) {
  //   print(element);
  // });
  // b.forEach((element) => {print(element)});
  // List c = b.map((e) => e * 3).toList();
  // print(c);

  // ((int n) {
  //   print(n * 8);
  // })(6);

  // userInfo({'name': 'wangbadan', 'age': 30});
  // userInfo('法外狂徒张三', age: 25);
  // var a = 10;
  // void onFunc(a) {
  //   // a = 20;
  //   var a = 30;
  // }

  // 调用接口示例
  // https://httpbin.org/ip 会返回访问者的ip
  getIp().then((ip) => {print(ip)}).catchError((err) => {print(err)});
}

Future getIp() async {
  final url = 'https://httpbin.org/ip';
  final res = await http.get(url);
  print(res.body);
  String ip = jsonDecode(res.body)['origin'];
  print(ip);
}

// void printInfo() {
//   print('Hello, World');
// }

// int getNum(int a, int b) {
//   return a + b;
// }

// void userInfo(String name, {int age = 30}) {
//   print('你好，$name, 年龄，$age');
// }

