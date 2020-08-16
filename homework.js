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
        if (value instanceof MyPromise) {
            return value;
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

Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
module.exports = Promise;