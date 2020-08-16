// console.log(1111111)
// let arr = [1, 2, 3, 4];

function once (fn) {
    let done = false;
    return function (...rest) {
        if (!done) {
            return fn.apply(null, rest);
            done = true;
        }
    }
}

// function map(arr, fh) {
//     let result = [];
//     for (let val of arr) {
//         result.push(fh(val));
//     }
//     return result;
// }

// function every (arr, fn) {
//     for (let i = 0;i < arr.length; i++) {
//         if (!fn(arr[i])) {
//             return false;
//         }
//     }
//     return true;
// }

// function some (arr, fn) {
//     for (let i = 0;i < arr.length; i++) {
//         if (fn(arr[i])) {
//             return true;
//         }
//     }
//     return false;
// }

// let result = map(arr, (item) => item * item);
// console.log(result);

// function paw(num1) {
//     return function (num2) {
//         return Math.pow.call(null, num2, num1);   
//     }
// }

// function memoize(fn) {
//     let map = new Map();
//     return function (...rest) {
//         if (!map.get(rest)) {
//             map.set(rest, fn.call(rest));
//         }
//         return map.get(rest);
//     }
// }

// function sum (num1, num2, num3) {
//     return num1 + num2 + num3;
// }

// function curry(fn) {
//     let len = fn.length;
//     return function func(...rest) {
//         if (rest.length < len) {
//             return function (...arg) {
//                 return func(...rest.concat(arg));
//             };
//         } else {
//             console.log(11111111111)
//             return fn.apply(null, arg);
//         }
//     }
// }

// let sumCurry = curry(sum);
// // console.log(sumCurry(1, 2)(3))
// console.log(sumCurry(3)(4)(5))

// function flow(...rest) {
//     return function (x) {
//         let result = x;
//         while (rest.length) {
//             let lastFunc = rest.pop();
//             result = lastFunc(x);
//         }
//         return result;
//     }
// }

// class Container{
//     #provateValue = 10;
//     constructor(age) {
//         this.age = age;
//     }
//     static getValue() {
//         return this.#provateValue;
//     }
// }

// const fp = require('lodash/fp');

// class IO {
//     constructor(fn) {
//         this._value = fn;
//     }
//     of(value) {
//         return new IO(function () {
//             return value;
//         })
//     }
//     map(fn) {
//         return new IO(fp.flowRight(fn, this._value));
//     }
// }


