const { add } = require("lodash");

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject);
        } catch (error) {
            this.reject(error);
        }
    }
    status = PENDING;
    value = void 0;
    reason = void 0;
    successCallback = [];
    failCallback = [];
    resolve = value => {
        if (this.status !== PENDING) return ;
        this.status = FULFILLED;
        this.value = value;
        while (this.successCallback.length) {
            this.successCallback.shift()();
        }
    }
    reject = reason => {
        if (this.status !== PENDING) return ;
        this.status = REJECTED;
        this.reason = reason;
        while (this.failCallback.length) {
            this.failCallback.shift()();
        }
    }
    then(successCallback, failCallback) {
        successCallback = successCallback || (value => value);
        failCallback = failCallback || (reason => { throw reason });
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
                        let x = failCallback(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
                // failCallback(this.reason);
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
                            let x = failCallback(this.value);
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
    finally(callback) {
        return this.then((value) => {
            return MyPromise.resolve(callback()).then(() => value);
        }, (reason) => {
            return MyPromise.resolve(callback()).then(() => { throw reason });
        })
    }
    catch(failCallback) {
        return this.then(void 0, failCallback);
    }
    static all(array) {
        let result = [];
        let index = 0;
        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value;
                index++;
                if (index === array.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < array.length; i++) {
                let current = array[i];
                if (current instanceof MyPromise) {
                    current.then(value => addData(key, value), reason => reject(reason));
                } else {
                    addData(i, current);
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
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('自己调用自己'));
    }
    if (x instanceof MyPromise) {
        x.then(resolve, reject);
    } else {
        resolve(x);
    }
}

module.exports = MyPromise;

let hanshu = () => {}

Promise.then(1).then(2).then(value => { Promise.resolve(3) }).then(console.log);
Promise.then(1).then(2).then(hanshu()).then(console.log);