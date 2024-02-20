void main() {
  var c1 = new Circle(10);
  c1.setR = 20;
  print(c1.area);
}

class Circle {
  final PI = 3.14159;
  num r;
  Circle(this.r);
  num get area {
    return this.r * this.r * this.PI;
  }

  set setR(val) {
    this.r = val;
  }
}
