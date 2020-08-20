const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
    constructor(executor) {
        // Promise接受一个函数并立即执行，该函数接受两个参数，resolve和reject，这两个函数需要在promise定义
        try {
            executor(this.resolve, this.reject);
        } catch (error) {
            this.reject(error);
        }
        
    }
    // 需要定义一个promise状态的属性，该属性默认为pending状态，即promise一开始为pending状态
    status = PENDING;
    // value用来保存前一个promise成功后的值，往后传递，默认undefined
    value = void 0;
    reason = void 0;
    // 执行异步任务，由于executor并不会立刻执行完毕，所以需要将链式调用的then的任务保存，等待promise决议完之后在执行
    successCallback = [];
    failCallback = [];
    // resolve方法用来在promise的状态为pending时修改为fulfilled状态，如果promise的状态不是pending则不可改变
    // resolve方法接受一个参数用来往下传递
    resolve = value => {
        if (this.status !== PENDING) return;
        this.status = FULFILLED;
        this.value = value;
        while(this.successCallback.length) this.successCallback.shift()();
    }
    // reject方法用来在promise的状态为pending时修改为rejected状态，如果promise的状态不是pending则不可改变
    // reject方法接受一个参数用来往下传递
    reject = reason => {
        if (this.status !== PENDING) return;
        this.status = REJECTED;
        this.reason = reason;
        while(this.failCallback.length) this.failCallback.shift()();
    }
    // promise的then方法,then方法会返回一个新的promise
    // then方法不能返回当前调用then放的promise，这个时候应该报错
    then(successCallback, failCallback) {
        // 值穿透问题，如果参数是非函数，就转为默认函数
        successCallback = typeof successCallback === 'function' ? successCallback : value => value;
        failCallback = typeof failCallback === 'function' ? failCallback : reason => {throw reason};
        let promise2 = new MyPromise((resolve, reject) => {
            // 在该方法中我们无法直接获取到当前promise2对象，所以我们使用异步，即setTimeout
            // 此处setTimeout放到if里面和放到if外面逻辑上是没有差别的
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = successCallback(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    } 
                }, 0);
            }
            if (this.status === PENDING) {
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
                });
            }
        });
        return promise2;
    }
    catch(failCallback) {
        // catch返回当前promise，不是新创建
        // catch可以链式调用
        // 直接调用this.then()即可
        return this.then(null, failCallback);
    }
    static resolve(value) {
        // 判断是否是promise，是就直接返回，不是就返回一个新的peomise，reject同理
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise((resolve) => {
            resolve(value);
        });
    }
    static reject(reason) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise((resolve, reject) => {
            reject(reason);
        });
    }
    static all(arr) {
        let result = [];
        let index = 0;
        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value;
                index ++;
                if (index === arr.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < arr.length; i++) {
                let current = arr[i];
                if (current instanceof MyPromise) {
                    // 如果是promise对象则需要获取到该promise对象的值，所以我们需要通过current.then在then当中获取到，并添加到result当中
                    current.then(value => addData(i, value), reject);
                } else {
                    // 非promise我们就直接添加
                    addData(i, current);
                }
            }
        });
    }
    static race(arr) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                let current = arr[i];
                if (current instanceof MyPromise) {
                    // 如果是promise，我们直接在其then当中传入resolve，其中一个执行完之后立即修改当前promise状态
                    current.then(resolve, reject);
                } else {
                    resolve(current);
                }
            }
        });
    }
    static finally(callback) {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value);
        }, reason => {
            return MyPromise.resolve(callback()).then(null, () => {throw reason});
        })
    }
}

// 判断成功或失败回调的返回值是否是promise，是则直接返回，不是则resolve
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise'));
    }
    if (x instanceof MyPromise) {
        // 我们需要判断这个x的状态，他的状态我们是没法拿到的，但是在他的then方法中我们可以拿到他的状态，
        // 用来修改我们创建的新的promise的状态
        return x.then(resolve, reject);
    }
    resolve(x);
}

Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
module.exports = Promise;