// ignore_for_file: avoid_unnecessary_containers

import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Wrap'),
        leading: const Icon(Icons.menu),
        actions: const [Icon(Icons.search), Icon(Icons.settings)],
        elevation: 3.0,
        centerTitle: true,
      ),
      body: WrapDemo(),
    );
  }
}

class WrapDemo extends StatelessWidget {
  WrapDemo({super.key});

  final _list = [
    '曹操',
    '曹丕',
    '曹仁',
    '曹值',
  ];

  List<Widget> getWei() {
    _list.add('典韦');
    return _list
        .map((item) => Chip(
              avatar: const CircleAvatar(
                backgroundColor: Colors.red,
                child: Text(
                  '蜀',
                  style: TextStyle(
                    fontSize: 14.0,
                  ),
                ),
              ),
              label: Text(item),
            ))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Wrap(
          children: [
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text(
                  '蜀',
                  style: TextStyle(
                    fontSize: 14.0,
                  ),
                ),
              ),
              label: Text('刘备'),
            ),
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text(
                  '蜀',
                  style: TextStyle(
                    fontSize: 14.0,
                  ),
                ),
              ),
              label: Text('关羽'),
            ),
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text(
                  '蜀',
                  style: TextStyle(
                    fontSize: 14.0,
                  ),
                ),
              ),
              label: Text('张飞'),
            ),
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text(
                  '蜀',
                  style: TextStyle(
                    fontSize: 14.0,
                  ),
                ),
              ),
              label: Text('赵云'),
            ),
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text(
                  '蜀',
                  style: TextStyle(
                    fontSize: 14.0,
                  ),
                ),
              ),
              label: Text('诸葛亮'),
            ),
          ],
        ),
        Wrap(
          spacing: 20,
          runSpacing: 20,
          alignment: WrapAlignment.spaceAround,
          runAlignment: WrapAlignment.spaceEvenly,
          children: getWei(),
        )
      ],
    );
  }
}
