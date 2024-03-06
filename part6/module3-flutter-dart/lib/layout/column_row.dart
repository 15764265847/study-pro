// ignore_for_file: avoid_unnecessary_containers

import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('column_row'),
        leading: const Icon(Icons.menu),
        actions: const [Icon(Icons.search), Icon(Icons.settings)],
        elevation: 3.0,
        centerTitle: true,
      ),
      body: const ColumnDemo(),
    );
  }
}

class ColumnDemo extends StatelessWidget {
  const ColumnDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return const SizedBox(
      width: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(
            Icons.access_alarm,
            size: 50,
          ),
          Icon(
            Icons.search_rounded,
            size: 50,
          ),
          Icon(
            Icons.accessible_forward_outlined,
            size: 50,
          ),
          Icon(
            Icons.add_a_photo_outlined,
            size: 50,
          ),
          Icon(
            Icons.add_box,
            size: 50,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Icon(Icons.abc),
              Icon(Icons.access_time),
              Icon(Icons.ac_unit),
              Icon(Icons.ac_unit_sharp),
            ],
          )
        ],
      ),
    );
  }
}
