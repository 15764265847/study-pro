// const man = {
//   name: 'jscoder',
//   age: 22
// };

// const proxy = new Proxy(man, {
//   get(target, key, receiver) {
//     if (target[key]) {
//       return Reflect.get(target, key, receiver);
//     }
//     throw new Error(`${ key } does not exit`);
//   }
// });

// console.log(proxy.name);
// console.log(proxy.age);
// console.log(proxy.location);

const red = () => console.log('red')
const green = () => console.log('green')
const yellow = () => console.log('yellow')

const light = () => {
  new Promise((resolve) => {
    setTimeout(() => {
      red();
      resolve();
    }, 3000);
  }).then(() => new Promise((resolve) => {
    setTimeout(() => {
      green();
      resolve();
    }, 1000);
  })).then(() => new Promise((resolve) => {
    setTimeout(() => {
      yellow();
      resolve();
    }, 2000);
  }));
}

light();

setInterval(() => {
  light();
}, 6000);

for (var i = 0; i < 10; i ++) {
  (function (i) {
    setTimeout(() => {
      console.log(i);
    });
  })(i);
}

for (var i = 0; i < 10; i ++) {
  function a(i) {
    setTimeout(() => console.log(i));
  }
  a(i);
}

Function.prototype.myBind = function (context, ...rest) {
  let self = this;
  return function (...args) {
    return self.apply(context, args.concat(rest));
  }
}