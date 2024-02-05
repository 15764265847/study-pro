void main() {
  var p1 = new Point(1, 2, 3);
  print(p1.z); // 3

  var p2 = new Point.twoD(3, 4);
  print(p2.z); // 0
}

class Rect {
  num width;
  num height;

  // Rect([int width = 10, int height = 20]) {
  //   this.width = width;
  //   this.height = height;
  //   print('width: $width, height: $height');
  // }

  // Rect({int width = 10, int height = 20}) {
  //   this.width = width;
  //   this.height = height;
  //   print('width: $width, height: $height');
  // }

  Rect()
      : width = 10,
        height = 10 {
    this.width = width;
    this.height = height;
    print('width: $width, height: $height');
  }
}

class Point {
  double x, y, z;

  Point(this.x, this.y, this.z);

  // 初始化列表的特殊用法（重定向构造函数）
  // 这种用法类似函数柯里化
  Point.twoD(double x, double y) : this(x, y, 0);
}
