// ignore_for_file: avoid_unnecessary_containers

import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flex'),
        leading: const Icon(Icons.menu),
        actions: const [Icon(Icons.search), Icon(Icons.settings)],
        elevation: 3.0,
        centerTitle: true,
      ),
      body: const FlexDemo(),
    );
  }
}

class FlexDemo extends StatelessWidget {
  const FlexDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Container(
              color: Colors.amber,
              height: 50,
              width: 50,
            ),
            Expanded(
              child: Container(
                color: Colors.lightBlue,
                height: 300,
              ),
            )
          ],
        ),
        const Flex(
          direction: Axis.horizontal,
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          textDirection: TextDirection.rtl,
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
          ],
        ),
        Flex(
          direction: Axis.horizontal,
          children: [
            Expanded(
              flex: 2,
              child: Container(
                color: Colors.deepOrangeAccent,
                height: 50,
              ),
            ),
            Expanded(
              flex: 1,
              child: Container(
                color: Colors.deepPurpleAccent,
                height: 50,
              ),
            ),
          ],
        ),
        Container(
          height: 100,
          margin: const EdgeInsets.all(50),
          child: Flex(
            direction: Axis.vertical,
            verticalDirection: VerticalDirection.up,
            children: [
              Expanded(
                flex: 2,
                child: Container(
                  color: Colors.deepOrangeAccent,
                  height: 50,
                ),
              ),
              const Spacer(
                flex: 1,
              ),
              Expanded(
                flex: 1,
                child: Container(
                  color: Colors.deepPurpleAccent,
                  height: 50,
                ),
              ),
            ],
          ),
        )
      ],
    );
  }
}
