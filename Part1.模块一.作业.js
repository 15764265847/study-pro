// 简答题
// 一、如何理解js异步编程？EventLoop，消息队列是做什么的？如何理解宏任务和微任务
// 答：1.异步编程就和我们点外卖一样，我们等待吃的做出来然后再送到我们手里很慢，但是我们当外卖送到，我们拿外卖却很快，很显然在等待外卖
//      的过程中我们不可能就啥事也不做就在等着，我们中间可能会玩会手机啊，也可能会洗个衣服打扫打扫卫生啊，等外卖小哥到了就会打电话通知我
//      们拿外卖，假如这个时候有事情呢，我们就会让外卖小哥把外卖放到一个地方，等着我们去拿。
//      下单就是在注册事件添加回调函数，玩手机洗衣服打扫卫生就是js主线程在执行其他同步任务，外卖小哥打电话就是消息，假如这个时候有事情就是我们当前有同
//      步任务在执行，让外卖小哥把外卖放到一个地方就是把这个任务压入到调用栈，等着我们去拿就是在当前同步任务执行完之后会执行回调函数
//     2.（1）EventLoop是用来监听调用栈和消息队列的，当EventLoop监听到调用栈中没有任务了，就会从消息队列中取出第一个回到函数让入到调用栈当中来执行
//       （2）消息队列是用来保存回到函数的，即当有事件触发时，事件的回调函数会按照事件的触发顺序放入到消息队列，等待调用栈没有其他任务时，EventLoop
//       会依次把消息队列中的回调函数压入调用栈并执行
//     3.还是上面的例子，我在吃饭的时候会点外卖，但是这时候发现我没烟了，于是我就会告诉外卖小哥出钱帮我买一包烟，但是当他外卖送到了却不能直接，我还得
//       把买烟的钱给他。我下单点外卖让他帮忙买烟的过程就是宏任务，等他送到外卖，他不能立刻去送下一个外卖，因为我还得把烟钱给他，付钱的过程就是微任务
//       即微任务就像是附属任务，在完成主任务之后要完成的附属任务，这个附属任务必须完成，完不成就不能继续下一个主任务。微任务就是js自身调用某些API产生的
//       附属品
//       宏任务则是有宿主本身发起的


// let fp = require('lodash/fp');

// // 代码题
// // 一、
// new Promise((resolve) => resolve('hello '))
//     .then(value => {
//         return new Promise((resolve) => resolve(value + 'lagou '));
//     })
//     .then(value => {
//         console.log(value + 'I ❤️ you');
//     });

// // 二、
// // 1

// let arr = [{in_stock: 1, name: 'first'}, {in_stock: 2, name: 'last'}];

// // function getProp(x) {
// //     return function (y) {
// //         return fp.prop(x, y);
// //     }
// // }

// // function getLast(arr) {
// //     return function () {
// //         return fp.last(arr);
// //     }
// // }

// let getInStock = fp.flowRight(fp.prop('in_stock'), fp.last);
// console.log(getInStock(arr));

// // 2

// // function getFirst(arr) {
// //     return function () {
// //         return fp.first(arr);
// //     }
// // }

// let getName = fp.flowRight(fp.prop('name'), fp.first);
// console.log(getName(arr));

// // 3
// let cars = [];
// let _average = function (xs) {
//     return fp.reduce(fp.add, 0, xs) / xs.length;
// }
// // function getDollarValue(cars) {
// //     return function () {
// //         fp.map((car) => {
// //             return car.dollar;
// //         }, cars);
// //     }
// // }
// let averageDollarValue = fp.flowRight(_average, fp.map((car) => car.dollar));
// averageDollarValue(cars);

// // 4
// let _underscore = fp.replace(/\W+/g, '_');

// let sanitizeNames = fp.map(fp.flowRight(_underscore, fp.lowerCase));

// console.log(sanitizeNames(['Hello World']), '+++++++++++');

// // 三
// // 1
// let mayBe = {
//     _value: [5, 6, 1],
//     isNothing() {
//         return !this._value;
//     },
//     map(fn) {
//         return fn(this._value);
//     }
// }

// let ex1 = function () {
//     let fn = fp.map(fp.add(1));
//     return mayBe.map(fn);
// }

// console.log(ex1(), '11111111111111');

// // 2 
// let ex2 = function () {
//     // let fn = fp.map(fp.add(1));
//     return mayBe.map(fp.first);
// }

// console.log(ex2(), '2222222222222222');

// // 3
// let user = {name: 'Albert'};
// let ex3 = function () {
//     // let fn = fp.map(fp.add(1));
//     return safeProp('name')(user).map(fp.first);
// }

// console.log(ex3(), '33333333333333333');

// // 4
// let ex4 = function (n) {
//     // let fn = fp.map(fp.add(1));
//     return MayBe.of(n).map(parseInt);
// }

// console.log(ex4(), '44444444444444444');





const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject);
        } catch (error) {
            this.reject(error)
        }       
    }
    status = PENDING;
    value = void 0;
    reason = void 0;
    successCallback = [];
    failCallback = [];
    resolve = value => {
        if (this.status !== PENDING) return;
        this.status = FULFILLED;
        this.value = value;
        while(this.successCallback.length) this.successCallback.shift()();
    }
    reject = reason => {
        if (this.status !== PENDING) return;
        this.status = REJECTED;
        this.reason = reason;
        while(this.failCallback.length) this.failCallback.shift()();
    }
    then(successCallback, failCallback) {
        successCallback = successCallback || (value => value);
        failCallback = failCallback || (reason => {throw reason});
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = successCallback(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            } else {
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                })
            }
        });
        return promise2;
    }
    finally(callbak) {
        return this.then(value => {
            return new MyPromise.resolve(callbak()).then(() => value);
        }, reason => {
            return new MyPromise.resolve(callbak()).then(() => {throw reason});
        })
    }
    catch(failCallback) {
        return this.then(void 0, failCallback);
    }
    static all(array) {
        let result = [];
        let index = 0
        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value;
                index ++;
                if (index === array.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < array.length; i++) {
                let current = array[i];
                if (current instanceof MyPromise) {
                    current.then(value => addData(i, value), reason => reject(reason));
                } else {
                    addData(i, current);
                }
            }
        })
    }
    static race(array) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < array.length; i++) {
                let current = array[i];
                if (current instanceof MyPromise) {
                    current.then(resolve, reject);
                } else {
                    resolve(current);
                }
            }
        });
    }
    static resolve(value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise(resolve => resolve(value));
    }
    static reject(reason) {
        if (reason instanceof MyPromise) {
            return reason;
        }
        return new MyPromise((resolve, reject) => {
            reject(reason);
        });
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        throw TypeError('自己掉自己');
    }
    if (x instanceof MyPromise) {
        return x.then(resolve, reject)
    }
    return resolve(x);
}

MyPromise.defer = MyPromise.deferred = function () {
    let dfd = {}
    dfd.promise = new MyPromise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

let p1 = new MyPromise((resolve, reject) => {
    reject(1);
}).then(console.log, console.log)

module.exports = MyPromise;

