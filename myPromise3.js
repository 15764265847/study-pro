const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
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
        if (this.status !== PENDING) return;
        this.status = FULFILLED;
        this.value = value;
        while(this.successCallback.length) this.successCallback.shift()();
    };
    reject = reason => {
        if (this.status !== PENDING) return;
        this.status = REJECTED;
        this.reason = reason;
        while(this.failCallback.length) this.failCallback.shift()();
    };
    then(successCallback, failCallback) {
        successCallback = typeof successCallback === 'function' ? successCallback : (value => value);
        failCallback = typeof failCallback === 'function' ? failCallback : typeof (reason => {throw reason});
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = successCallback(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error)
                    }
                });
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error)
                    }
                });
            }
            if (this.status === PENDING) {
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    });
                });
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    });
                });
            }
        });
        return promise2;
    };
    catch(failCallback) {
        return this.then(null, failCallback);
    };
    static finally(callback) {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value);
        }, () => {
            return MyPromise.resolve(callback()).then(null, () => {throw reason});
        });
    };
    static resolve(value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise((resolve, reject) => {
            resolve(value);
        });
    };
    static reject(reason) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise((resolve, reject) => {
            reject(reason);
        });
    };
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
            for (let i = 0; i < arr.length; i ++) {
                let current = arr[i];
                if (current instanceof MyPromise) {
                    current.then(value => addData(i, value), reject);
                } else {
                    addData(i, current);
                }
            }
        })
    };
    static race(arr) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < arr.length; i ++) {
                let current = arr[i];
                if (current instanceof MyPromise) {
                    current.then(resolve, reject);
                } else {
                    resolve(current);
                }
            }
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('自己调用自己'));
    }
    if (x instanceof MyPromise) {
        return x.then(resolve, reject);
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
module.exports = MyPromise;