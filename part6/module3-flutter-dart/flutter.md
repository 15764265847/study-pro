### Flutter
1. 组件库 Material Design (google 推出的UI组件库)
  * 官网 https://material.io
  * 中文官网 https://material-io.cn
  * 官网中文文档 https://www.mdui.org
2. flutter 中一切内容都是组件 (Widget)
  * 无状态组件 StatelessWidget
  * 有状态组件 StatefulWidget
3. 初始项目目录 ![img](./images/1708936962527.jpg) 

#### App 基础骨架
##### MaterialApp 组件
  - 是 Material Design 提供的基础组价，内部包含了 App 的基础骨架内容
  - title 在任务管理器中显示的标题
  - home 主内容
  - debugShowCheckedModeBanner 是否显示左上角的调试标记
##### Scaffold 
  - appBar 应用头部
  - body 应用主体
  - floatingActionButton 浮动按钮
  - drawer 左侧抽屉菜单
  - endDrawer 右侧抽屉菜单
  - app结构示意图 1
    ![img](./images/8226C68F-F3BE-43C1-9F63-2DC141198FC0.png) 
  - app结构示意图 2
      ![img](./images/1709015726362.jpg) 
    * Scaffold 结构
      ![img](./images/1709015734715.jpg) 
  - app 结构示意图3
    ![img](./images/1709016333649.jpg) 
##### Card 卡片
  - child 子元素
  - color 背景色
  - shadowColor 阴影颜色
  - elevation 阴影高度
  - shape 边框样式
  - margin 外边距
##### ListTile 列表瓦片
  - leading 头部组件
  - title 标题
  - subtitle 子标题

### 基础组件
#### 常用
##### Text
  - TextDirection 文本方向
  - TextStyle 文本样式
    1. Colors 颜色
    2. FontWeight 字体粗细
    3. FontStyle 字体样式
  - TextAlign 对齐方式
  - TextOverflow 文本溢出
  - maxLines 最多显示几行
##### RichText 和 TextSpan 
  - 这俩个组件一般是组合使用
  - 作用是给一段文本添加不同的样式
  - 代码示例
    ```
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
                  color: Colors.deepOrange,
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
    ```
##### 设置自定义字体
  - 下载字体文件
  - 在 pubspec.yaml 中声明字体
  - 示例
    ![img](./images/1709087654338.jpg.jpg) 
  - 使用
    1. 全局设置
      - MaterialApp 如下设置
        ```
          MaterialApp(
            ...,
            theme: ThemeData(fontFamily: 'AlimamaShuHeiTiBold'),
            ...
          );
        ```
    2. 为单个组件设置
      - 单个组件设置，例如在 Text 组件中，如下
        ```
          Text(
            ...,
            style: TextStyle(
              ...,
              fontFamily: 'AlimamaShuHeiTiBold',
            ),
            ...,
          )
        ```
##### Icon 字体图标组件
  - 使用 Icon(Icons.menu)
  - 在线预览地址1 https://www.mdui.org/design/style/icons.html#
  - 在线预览地址2 https://m3.material.io/styles/icons/overview
  - 说实话这俩个地址，我都看不懂
##### Color 
  - flutter 中通过 ARGB 来声明 ，js是 RGBA
  - const Color(0xFF42A5F5); 16进制的 ARGB ，其中 FF 标识透明度，42A5F5标识颜色值
  - const Color.fromARGB(0xFF, 0x42, 0xA5, 0xF5);
  - const color.fromARGB(255, 66, 165, 245);
  - const color.fromRGBO(66, 165, 245, 1.0); O标识透明度，这种方式更接近 js 中的 rgba(66, 165, 245, 1.0)
  - Colors.red 通过英文直接声明
##### Container
  - height width 如果不声明都是0，如果有内容的会自动被内容撑开
  - child 子元素
  - padding、margin 内边距外边距
    - 使用 EdgeInsets 组件实现，可以使用 EdgeInsets.all()、EdgeInsets.fromLTRB()、EdgeInsets.only()
  - docoration
    - 使用 BoxDecoration 组件实现，其中可以设置 边框、圆角、渐变、阴影、背景色、背景图片
  - alignment 
    - 使用 Alignment 组件实现 内容对齐
  - transform
    - 使用 Matrix 组件实现 translate rotate scale skew 
##### 线性布局 组件
  1. Column 不会给内容进行自动换行
    - 主轴方向是垂直方向
    - mainAxisAlignment: MainAxisAlignment 主轴对齐方式
    - crossAxisAlignment: CrossAxisAlignment 交叉轴对齐方式
    - children 子元素 list
  2. Row 不会给内容进行自动换行
    - 主轴方向是水平方向
    - 其他属性与Column一致
##### 弹性布局 
  1. Flex 组件，Column 和 Row 组件继承自 Flex ，Column 和 Row是不可以指定主轴方向的，但是 Flex 组件可以
    - direction 声明主轴方向
    - mainAxisAlignment: MainAxisAlignment 主轴对齐方式
    - crossAxisAlignment: CrossAxisAlignment 交叉轴对齐方式
    - children 子元素 list
    - textDirection: TextDirection 水平方向的排列顺序 
    - verticalDirection: VerticalDirection 垂直方向的排列顺序
  2. Expanded 可伸缩组件 会自动占满父元素
    - child 子元素
    - flex 弹性布局所占比例 ，和 css 的 flex 类似
##### 流式布局
  1. 所谓流式布局就是元素会顺序往下排列，html 默认就是流式布局 ，flutter也是，但是flutter有个问题就是在布局组件中如果内容溢出了就会报错 
    内容溢出错误如下图，会展示为斑马线样式
    ![img](./images/1709523764738.jpg.jpg)
  2. wrap 组件 就是用来解决 其他其他布局组件内容会溢出的问题
    - spacing 主轴方向子元素间距
    - alignment 主轴方向子元素的对齐方式 类似 justify-content ，使用 WrapAlignment 组件
    - runSpacing 纵轴方向子元素间距
    - runAlignment 纵轴方向子元素的对齐方式 类似 align-items ，使用 WrapAlignment 组件
  3. 顺带学习一些其他组件，不属于流式布局
    - Chip 标签 ，即扁平化的按钮组件
    - CircleAvatar 圆形头像
##### 层叠布局
  1. Stack 层叠组件 ，类似 css 中的 z-index
    - alignment 声明未定位子元素的对齐方式
    - textDirection 声明未定位子元素的排列顺序
  2. Positioned 绝对定位组件
    - child 子元素
    - left right bottom top 类似 css 绝对定位时使用的
    - width height
  3. 额外拓展一个组件 NetworkImage 网络图片组件
    - NetworkImage('图片地址')
    - 需要有网络权限才可以访问网络图片
      - Android <uses-permission android:name="android.permission.INTERNET" /> 具体配置如下 ，react-native 也是这么配置的
        ![img](./images/1709535090003.jpg.jpg)
        * 其中 android:usesCleartextTraffic="true" 表示 应用程序是否允许使用明文通讯 ，可以简单理解为是否可以使用 http 而不是必须使用 https ，当然明文通讯协议肯定不止是 http 一个，但 http 是当前应用最广泛的，true 表示 可以使用明文通讯
      - IOS 参考 https://blog.51cto.com/u_16213339/8767028 该地址

#### 布局
#### 按钮
#### 图片
#### 列表
#### 其他