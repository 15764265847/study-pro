import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stack 层叠布局'),
        leading: const Icon(Icons.menu),
        actions: const [Icon(Icons.search), Icon(Icons.settings)],
        elevation: 3.0,
        centerTitle: true,
      ),
      body: const StackDemo(),
    );
  }
}

class StackDemo extends StatelessWidget {
  const StackDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return const SizedBox(
      child: Stack(
        children: [
          CircleAvatar(
            backgroundImage: NetworkImage(
                'https://k.sinaimg.cn/n/sinakd20116/600/w700h700/20240214/0abc-9ebe2e087a93caf92004c16169f45469.jpg/w700d1q75cms.jpg'),
          )
        ],
      ),
    );
  }
}
