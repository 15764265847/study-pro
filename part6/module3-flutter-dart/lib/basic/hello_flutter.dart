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
      body: const HelloFlutter(),
    );
  }
}

class HelloFlutter extends StatelessWidget {
  const HelloFlutter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
        child: const Center(
            child: Text('Hello Flutter', textDirection: TextDirection.ltr)));
  }
}
