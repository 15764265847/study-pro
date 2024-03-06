import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('首页'),
        leading: const Icon(Icons.menu),
        actions: const [Icon(Icons.search), Icon(Icons.settings)],
        elevation: 3.0,
        centerTitle: true,
      ),
      body: const ContainerDemo(),
    );
  }
}

class ContainerDemo extends StatelessWidget {
  const ContainerDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10.0),
      margin: const EdgeInsets.fromLTRB(10.0, 20.0, 10.0, 20.0),
      // width: 200,
      // height: 200,
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        // border: Border(
        //   top: BorderSide(
        //     width: 2.0,
        //     color: Colors.black,
        //   ),
        //   right: BorderSide(
        //     width: 2.0,
        //     color: Colors.black,
        //   ),
        //   bottom: BorderSide(
        //     width: 2.0,
        //     color: Colors.black,
        //   ),
        //   left: BorderSide(
        //     width: 2.0,
        //     color: Colors.black,
        //   ),
        // ),
        border: Border.all(
          width: 5.0,
          color: Colors.red,
        ),
        // borderRadius: BorderRadius.all(
        //   Radius.circular(10),
        // ),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(10),
          bottomRight: Radius.circular(30),
          topRight: Radius.elliptical(40, 20),
        ),
        // 设置背景色
        color: Colors.lightBlue[50],
        // 渐变也是设置背景色
        gradient: const LinearGradient(
          colors: [
            Colors.blue,
            Colors.pink,
          ],
        ),
      ),
      alignment: Alignment.center,
      // transform: Matrix4.translationValues(10, 0, 0),
      // transform: Matrix4.rotationZ(0.1),
      transform: Matrix4.skewX(0.1),
      // transformAlignment: AlignmentGeometry.lerp(a, b, t),
      child: const Text(
        'Flutter 帮助开发者通过一套代码库构建适用于移动、Web、桌面和嵌入式平台的精美应用。',
        style: TextStyle(
          fontSize: 20,
          color: Colors.black,
        ),
      ),
    );
  }
}
