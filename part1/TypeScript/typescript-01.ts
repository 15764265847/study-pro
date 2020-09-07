// 全局安装 TS后可以使用tsc命令
// 初始化TS配置 tsc --init

// 在已有的vue项目中使用安装vue官方提供的TS插件

// 推荐使用下面语法！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
// <script lang="ts">
// vue 中使用TS 
// import Vue from 'vue';
// const str:string = '123';
// export default Vue.extends({ // 该对象和普通vue写法一样
//     data() {
//         return {

//         }
//     }
// })
// 推荐使用上面的语法！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！



// Vue类式定义组价
// import Vue from 'vue';
// import Component from 'vue-class-component';
// import Hello from 'hello.vue';导入子组件
// @Component(component: { Hello }) 这个必须要，可以在这里注册子组件
// export default class App extends Vue {
//     foo = '123'; 将data中枢性定义为实例成员，初始值不能为undefined
//     get filedFirst() { 计算属性

//     }
//     set filedFirst() { 计算属性

//     }
//     getSomething() { 直接将methods中的方法作为实例属性，beforeMount等也是
//
//     }
// }
// </script>

// vue-property-decorater在vue-class-component的基础上进行了加强，提供了大量装饰器
// 装饰器语法已有提案，但未完全实现，阮一峰的es6入门有该语法的介绍

// 标准库就是TS对于js内置对象的的声明文件，可通过右击内置类型，然后点击 Go To Definition进行查看
// 我们在TS文件中要使用内置对象就必须引用对应的标准库，如果没有引用对应的标准库而是用的话就会报错

const hello = (name: string) => {
    // 当配置文件中配置项lib为["ES2015"]，他会覆盖掉所有的默认配置项，但是定义console的标准库是在DOM中，此时直接使用console就会报错
    // 所以需要将lib原有的默认配置项都给配置上去，TS中BOM和DOM的标准库统一为DOM，BOM和DOM同意使用DOM标准库，即lib: ["ES2015", "DOM"]
    console.log(`hello ${name}`);
}

hello('TypeScript');

// 非严格模式下，即配置项中strict为false时，typescript中允许值为null或undefined
const a: string = 'string'; 
// const a1: string = null; 非严格模式下这样是可以的，即配置项中strict为false

// 非严格模式下，即配置项中strict为false时，typescript中允许值为null或undefined
const b: number = 100; 

// 非严格模式下，即配置项中strict为false时，typescript中允许值为null或undefined
const c: boolean = true; 

// 非严格模式下值可以为null
const d: void = undefined; 

const e: null = null;

const f: undefined = undefined;

// 此处在TS默认配置下，会报错，因为他默认引用的是TS中es5对应的标准库，需要修改配置文件中的lib配置项，可以添加指定标准库
// 即lib: ["ES2015"]
const symbol1: symbol = Symbol(); 

// 定义为object类型可以接受 对象，数组，函数以及使用包装函数（new Number(), new String()是可以的，直接使用Number(1)不行）
// 不能接受原始类型的字面量即 const g: object = 1 是不可以的
const g: object = new Number(1);

// 这里的类型{}，可以单指对象的字面量形式
// 下面表示有foo为string和bar为number两个属性的对象
const h: {foo: string, bar: number} = {foo: '123', bar: 123};

// 和flow，数组泛型，表示定义了一个元素全部是numbe的数组
const arr1: Array<number> = [1, 2, 3];

// 更常用的定义数组的方式，表示该数组元素全是number
const arr2: number[] = [1,3 ,43];

// 保证rest参数数组内部元素全部是number，如果传入非number则会报错
function sum(...rest: number[]) {
    return rest.reduce((total, current) => total + current, 0);
}

// 元组类型是一种明确数组长度，以及数组内部每一个元素的类型的类型
// 表示数组长度为2，且第一个元素是number类型，第二个元素是string类型
const arr3: [number, string] = [1, '123'];

// 枚举类型
// 如果不指定枚举类型的值，默认会从0开始累加，等同于
// enum Status {
//     Draft = 0, // 草稿
//     Unpublished = 1, // 未发布
//     Published = 2, // 已发布
// }
enum Status {
    Draft, // 草稿
    Unpublished, // 未发布
    Published, // 已发布
}

// 枚举类型如果指定了第一项的值，没有指定后续项的值，默认会以第一项的值为基础累加
// 等同于
// enum Status1 {
//     Draft = 6, // 草稿
//     Unpublished = 7, // 未发布
//     Published = 8, // 已发布
// }
enum Status1 {
    Draft = 6, // 草稿
    Unpublished, // 未发布
    Published, // 已发布
}

// 字符串枚举无法以其中某一项为基础进行累加，所以每一项都需要指定
enum Status2 {
    Draft = '1', // 草稿
    Unpublished = '2', // 未发布
    Published = '3', // 已发布
}

// 枚举类型编译后会产生一个双向枚举的对象，即
console.log(Status.Draft); // 0
console.log(Status[0]); // Draft

// 如果我们可以确定不需要Status[0]进行反向查找对应的值，我们可以使用常量枚举
const enum Status4 {
    Draft, // 草稿
    Unpublished, // 未发布
    Published, // 已发布
}
// 常量枚举在编译后会把使用的地方替换为对应的值
// 编译后为
// const person: {} = {
//     status: 0 // Draft
// }
const person: {} = {
    status: Status4.Draft
}

// 函数声明参数类型以及返回值设置
// 实参个数和类型必须与形参个数和类型保持一致
// ?表示参数可选，即可传可不传 
// 参数可选也可以使用参数默认值的形式，使用了参数默认值该参数也可以不传 
function func1 (a: number, b: string = '111', c?: number): string {
    return 'func';
}

// 函数表达式可以使用以下方式来表示参数类型及返回值类型，也可以使用函数声明同样的方式来设置参数类型及返回值类型，即
// let func2 = (a: number, b: number): string => {
//     return 'string';
// }
let func2: (a: number, b: number) => string = (a, b) => {
    return 'string';
}

// any类型
// 可随意修改，TS不会对any类型进行类型检查
let any1: any = '123';
any1 = 123;

// 隐式类型推断
// 当我们声明一个变量的时候并且赋值的时候该变量就会被推断为，赋值的类型
// 即下面等同于let other1: number = 10;
// 使用other1 = 'foo';修改other1的值时TS就会报错
let other1 = 10;

// 当我们仅仅是声明一个变量并没有赋值的时候，TS会把该变量推断为any类型，即，TS无法判断该变量的类型时，该变量就是个any类型
// 此时该变量就可以随便赋值
let foo; foo = 10; foo = 'string'; 

// 断言
// 断言不是类型转换，类型转换是在代码执行时的一种概念
// 断言是在TS编译时候的概念，当使用TS编译过后，断言是不会存在的
let arr4 = [1, 2, 3, 4, 5];
// 此时result1可能是一个number类型也可能是一个undefined，因为可能找不到
let result1 = arr4.find(i => i > 0);
// 此时我们可以使用断言，明确告诉TS这个结果就是个number类型
// 断言的两种方式，1、使用as number  2、使用<number>
let num1 = result1 as number;
//<number>的方式会与jsx中标签的尖括号语法产生冲突，使用jsx语法的时候只能使用as这种方式进行断言
let num2 = <number>result1;

// interface 接口
// interface使用';'来分割每个成员，';'可加可不加，不加则换行
// ?表示可选成员，和可选参数等一样都是在在冒号前面添加问号即'?:'表示成员可选等同于
// interface Post {
//     title: string;
//     content: string;
//     subTitle: string | undefined
// }
// readonly表示该成员只读；只读成员的值初始化完成后不能修改，修改会报错
interface Post {
    title: string;
    content: string;
    subTitle?: string
    readonly summary: string
}
// interface 使用
// 定义对象，用来约束对象成员以及成员的值得类型； 
const post: Post = {
    title: '123123',
    content: '123123',
    summary: 'wangabdna'
}
// 函数传参以及返回值
function returnObj(post: Post): Post {
    console.log(post.title);
    console.log(post.title);
    return {
        title: '456',
        content: '456',
        summary: 'wangabdn'
    }
}
// 动态接口，一般适用于具有动态成员的对象，类似声明一个没有成员空对象{}，可随意添加成员
interface MyCache {
    [key: string]: string
}
const cache: MyCache = {};
cache.other = '1111111';

// 类
class Mobile {
    // 类中的属性必须初始化，要么像callPhone一样直接callPhone: string = '';要么像snedMessahe一样在constructor中赋值
    // public修饰符，公共成员，类内部的所有成员默认是public，可加可不加，建议加
    public callPhone: string = '';
    snedMessahe: string;
    // 可选成员
    playSomething?: string;
    // 受保护的成员，和静态属性一样只能在类内部使用
    // 与静态成员不同的是，protected修饰符修饰的属性可以在子类当中访问，但是private不能
    // 即protected修饰符修饰的属性是允许被继承的，但是private不能被继承
    protected isUzi: boolean = false;
    // 私有属性修饰符，私有属性只能在类内部访问
    // const huawei = new Mobile('12337y87239423', 'axiba');console.log(huawei.hasZhihu)这样访问会报错
    private hasZhihu: boolean = true;
    // readonly 只读属性，如果该属性前有修饰符，readonly则需要放到修饰符后面
    private readonly relatPerson: string = '13838384383';
    constructor(callPhone: string, snedMessahe: string) {
        this.callPhone = callPhone;
        this.snedMessahe = snedMessahe;
    }
    sayHi(name: string): void {
        console.log(`Hi, ${name}`);
        console.log(this.isUzi);
    }
    hasZhihuFunc(): boolean {
        return this.hasZhihu;
    }
}
class Huawei extends Mobile{
    // 使用private修饰constructor之后不能再类外部使用new进行实例化，只能在类内部实现一个静态方法来调用constructor
    private constructor(callPhone: string, snedMessahe: string) {
        super(callPhone, snedMessahe);
        console.log(this.isUzi);
    }
    static create(callPhone: string, snedMessahe: string): Huawei {
        return new Huawei(callPhone, snedMessahe)
    }
}

// interface与class组合使用
// 从某两个或多个类中抽象出一组共有的类型约束，即多个类中都必须有的属性和方法，但是属性值可能不一样，方法的实现也可能不一样
interface Run {
    footNum: number;
    run(num: number): void;
}
interface Eat {
    eat(food: string): void;
}
// 使用','接收多个interface
class Person implements Run, Eat {
    footNum: number = 2;
    eat(food: string): void {
        console.log('人吃饭' + food);
    };
    run(num: number) {
        console.log('人跑' + num);
    };
    dead(): string {
        return '死亡';
    }
}
class Dog implements Run, Eat {
    footNum: number = 4;
    eat(food: string): void {
        console.log('狗吃饭' + food);
    };
    run(num: number) {
        console.log('狗跑' + num);
    };
}

// 抽象类，使用abstract关键字
// 抽象类中包含了方法的实现，interface只是类型约束，不包含实现
// 抽象类声明后只能被继承，不能使用new关键字实例化
abstract class Animals {
    // 普通方法会自动继承到子类中，也可以在子类中自己实现
    eat(food: string): void {
        console.log(food);
    };
    run(num: number): void {
        console.log(num);
    };
    // 抽象方法使用abstract修饰，抽象方法和interface中的方法约束类似，不包含实现
    // 抽象方法必须在子类中存在以及实现
    abstract sleep(time: number): void;
}
class Cat extends Animals{
    sleep(time: number): void {
        console.log(time);
    }
}
const cat = new Cat();
cat.eat('123123');
cat.run(123123);

// 泛型，指的是我们在定义方法，接口，或者类的时候没有指定对应的类型，在使用的时候再去指定类型的一种特征
// 即在创建时我们可能不能明确是什么类型，那么我们就可以把这个类型变成一个参数，在使用的时候进行传递
// 此处getArr<T>中的<T>就是泛型，使用泛型后我们就可以创建任意类型的数组了
function getArr<T>(length: number, value: T): T[] {
    return Array<T>(length).fill(value);
}
getArr<number>(5, 100);
getArr<string>(5, '100');

// 类型声明 
// 其实在有一些npm包中的一些方法他们并没有使用TS进行类型声明，这个时候我们就可以使用declare来自己为这些方法进行类型声明
// 比如lodash中的camelCase方法，我们可以如下声明
// declare function camelCase(some: string): string
// TS生态够强大，所以一般来说我们常用到的一些库都会有对应的类型声明模块，我们进行一下安装就可以了
// 比如说node中的require方法，我们在TS中用到时就必须先安装@types/node模块。lodash需要安装@types/lodash，来进行生命安装
// 类型声明模块应该是一个开发依赖，因为类型声明模块没有具体的实现代码，只有对应的类型声明代码，用来帮助我们进行类型声明
// require 
// 有很多的库都已经集成了类型声明模块，即内部有类型声明的文件，不需要我们自己再去安装，比如query-string这个库就内置了类型声明模块

