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
      body: const TextDemo(),
    );
  }
}

class TextDemo extends StatelessWidget {
  const TextDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text(
          'Flutter 帮助开发者通过一套代码库构建适用于移动、Web、桌面和嵌入式平台的精美应用。',
          textDirection: TextDirection.ltr,
          style: TextStyle(
            fontSize: 30,
            color: Color.fromRGBO(66, 165, 245, 1.0),
            fontWeight: FontWeight.w400,
            fontStyle: FontStyle.italic,
            decoration: TextDecoration.underline,
            decorationColor: Colors.blueGrey,
          ),
          textAlign: TextAlign.center,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          textScaler: TextScaler.linear(1.3),
        ),
        RichText(
          text: const TextSpan(
              text: 'Hello',
              style: TextStyle(
                fontSize: 25,
                color: Colors.lime,
                fontFamily: 'AlimamaShuHeiTiBold',
              ),
              children: [
                TextSpan(
                  text: 'Flutter',
                  style: TextStyle(
                    color: Colors.deepPurple,
                  ),
                ),
                TextSpan(
                    text: '你好世界',
                    style: TextStyle(
                      fontSize: 35,
                      color: Colors.redAccent,
                    ))
              ]),
        ),
      ],
    );
  }
}
