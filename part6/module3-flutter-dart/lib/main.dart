import 'package:flutter/material.dart';
// import 'package:permission_handler/permission_handler.dart';

// import './basic/hello_flutter.dart' show Home;
// import './basic/text.dart';
// import './layout/container.dart' show Home;
// import './layout/column_row.dart' show Home;
// import './layout/flex.dart' show Home;
// import './layout/Wrap.dart' show Home;
import './layout/stack.dart' show Home;

void main() async {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'flutter_shop',
      home: Home(),
      // theme: ThemeData(fontFamily: 'AlimamaShuHeiTiBold'),
      debugShowCheckedModeBanner: false,
    );
  }
}
