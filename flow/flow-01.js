// @flow

// 表示参数类型都是number
function sum(a: number, b: number) { 
    return a + b;
}

// 表示返回值类型必须是number
function foo (): number { 
    return 1000;
}

// 无返回值flow中为void
function foo2 (): viod { 

}

// 表示callback回调接受两个参数，第一个参数是string类型，第二个参数是number类型，该回调函数没有返回值，
    // 如果void改为string，表示返回值为string类型
function foo3(callback: (string, number) => void) { 
}

foo3(function(str, num) {
    console.log(str + num)
})

// mixed类型，表示函数参数可以传入任意类型
// 等同于 string | number | symbol | boolean | ...其他任意类型
function foo4 (value: mixed) {

}

// any类型，功能与mixed类 似都是可以是任意类型
function foo5 (value: any) {

}

// any和mixed类型的区别
function foo5 (value: any) {
    // any类型在内部可以将value当做任意类型的变量使用。flow的语法不会报错
    value = value.toString();
    value = value.substr();
}
function foo4 (value: mixed) {
    // mixed中下面这样写，flow的语法会报错
    // value = value.toString();
    // value = value.substr();

    // mixed必须先判断类型然后才能决定走哪些逻辑，这样在flow语法层面不会报错
    if (typeof value === 'string') {
        value = value.substr();
    }
    if (typeof value === 'number') {
        value = value.substr();
    }
}

const a: string = 'a';
// 表示a1必须是foo，其他值就会报错 即字面量类型
const a1: 'foo' = 'foo'; 
// 表示a3必须是 'success' | 'warning' | 'danger'其中的一个，不能是其他的，即联合类型，或者称为或类型
const a3: 'success' | 'warning' | 'danger' = 'success'; 

const num1: string | number = 100; // 表示num1的类型可以是string类型也可以是number类型

// 可以使用type来声明一个类型，来表示某个联合类型，类似于别名，在其他地方可重复使用
type StringOrNumber = string | number; 
const num2: StringOrNumber = 100;

// maybe类型，表示除了string类型外，这个变量还可以是null或者undefined
const num3: ?string = null;
// maybe类型等同于下面这样
const num4: string | null | void = 100;

const b: number = Infinity // NaN // 100

const c: boolean = true // false

const d: null = null;

const e: void = undefined;

const f: symbol = Symbol();

// 表示HTML元素，由于可能没有找到元素，可能为null，所以使用联合类型，即为HTMLElement | null
const elem: HTMLElement | null = document.getElementById('app');

// 数组表示方式1，泛型
// 表示数组中元素必须为number类型
const g: Array<number> = [1, 2]; 
// 表示数组中元素必须为number类型
const h: number[] = [1, 2]
// 表示数组长度为2，且数组中第一个为number，第二个为string 即元组
const i: [number, string] = [1, '2'] 

// 表示obj1必须有两个属性foo和bar，foo为number类型，bar为string类型
const obj1: { foo: number, bar: string } = { foo: 100, bar: 'string' };
// ?表示可选，即该属性可有也可无
const obj2: { foo?: number, bar: string } = { bar: 'string' } 
// 表示可以添加任意数量的key，但是key和value都必须是string类型
const obj3: { [string]: string } = {}; 
obj3.key1 = 'value1';
obj3.key3 = 'value2';