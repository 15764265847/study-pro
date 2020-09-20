// 简答题一
// 1、当我们动态给Vue实例的data属性上添加属性时，这个新添加的属性并不是响应时的，这个时候我们需要调用Vue提供的$set方法设置属性
//     原理：还是Object.defineProperty方法，单独为这个key添加一下Vue实例对于data属性的代理，然后再添加监听和依赖

// 2、diff算法过程
//     1、首先判断当前新旧节点是否有文本节点，如果有则比较是否相同，不相同则修改
//     2、判断当前节点下是否都有子节点，有则对新旧虚拟dom树下的子节点进行判断
//     3、新旧dom树首节点是否相同，相同则继续patchNode，进行递归，无则下一步
//     4、新旧dom树尾节点是否相同，相同则继续patchNode，进行递归，无则下一步
//     5、新树尾结点和旧树首节点是否相同，相同则patchNode新树尾结点和旧树首节点，且移动旧树首节点至旧树末尾，无则下一步
//     6、新树首结点和旧树尾节点是否相同，相同则patchNode新树首结点和旧树尾节点，且移动旧树尾节点至旧树开头，无则下一步
//     7、根据新树节点的key从旧树节点中寻找是否有相同的key，有则判断是否是相同的节点，如果是则patchNode且移动位置，如果不是则创建一个新的dom元素插入到旧树对应的位置
//     8、循环走完3.4.5.6.7五个步骤后，会看新树或者旧树是否已遍历完成
//     9、如果新树完成，旧树没有，说明多余节点需要被移除
//     10、如果旧树完成，新树没有完成，说明新书中有新节点需要插入到旧树的对应位置
//     11、如果新树旧树都完成了，说明没有多与操作了，那么此时可以渲染到真实dom中了


// 编程题二
// 1、实现hash版vue-router
const _Vue = null;

export default class MyRouter {
    static install (Vue) {
        // 判断当前插件是否已被安装
        if (MyRouter.install.installed) {
            return;
        }
        MyRouter.install.installed = true;
        // 将Vue的构造函数注册到全局变量
        _Vue = Vue;
        // 在创建Vue实例的时候我们传入了router对象，我们需要把这个对象挂载到所有的Vue实例上
        // 使用mixin的方式，即混入
        _Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router;
                    this.$options.router.init();
                }
            }
        })
    }
    constructor(options) {
        // 记录实例化时传入的路由配置
        this.options = options;
        // 记录路由路径与组件的对应 key路由地址，即路径 value路由对应的组件
        this.routerMap = {};
        // data是一个响应式的对象，其中记录了我们当前的路由地址，默认是跟路由，即‘/’
        // 这里使用Vue的observable方法将对象设置为一个响应式的对象
        this.data = _Vue.observable({
            // current属性记录当前路由
            current: '/'
        })
    }
    init() {
        this.createRouterMap();
        this.initComponents(_Vue);
        this.initEvent();
    }
    // 用来初始化routerMap对象，以路由路径为key，以组件为value
    createRouterMap() {
        const { routes } = this.options;
        routes.forEach(route => {
            const { path, component } = route;
            this.routerMap[path] = component; 
        })
    }
    // 生成router-link组件
    initComponents(Vue) {
        Vue.component('router-link', {
            props: {
                to: [String, Object]
            },
            // template: '<a :href="to"><slot></slot></a>'
            render(h) {
                // 第一个参数直接写标签就行
                // 第二个参数attr设置标签属性
                // 第三个参数设置元素的子元素，是个数组，
                // 这里我们需要传入默认的slot组件
                return h('a', {
                    attr: {
                        href: this.to
                    },
                    // 添加事件阻止a标签的默认事件
                    on: {
                        click: handleClick
                    }
                }, [this.$slots.default])
            },
            methods: {
                handleClick(e) {
                    location.hash = this.to; 
                    e.preventDefault();
                }
            }
        });

        const self = this;
        Vue.component('router-view', {
             render(h) {
                const { current } = self.data;
                const component = self.routerMap[current];
                // h函数可以直接将一个组件转成虚拟DOM进行渲染
                // 这里我们需要拿到路由对应的组件然后使用h函数渲染                
                return h(component);
            }
        })
    }
    // 添加popstate事件
    initEvent() {
        window.addEventListener('hashchange', () => {
            this.data.current = window.location.hash;
        });
    }
}

// 2、模拟v-html和v-on指令
class Compiler {
    // ...
    htmlUpdater(node, key, value) {
        node.innerHTML = value;
        new Watcher(this.vm, key, newVal => {
            node.innerHTML = newVal;
        });
    };
    onUpdater(node, type, key) {
        node.addEventListener(type, this.vm[key].bind(this.vm));
    };
    compileElement(node) {
        const attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
            const attrName = attr.name;
            if (this.isDirective(attrName)) {
                const key = attr.value;
                if (attrName.startWith('v-on')) {
                    this.onUpdater(node, attrName.split(':')[1], key);
                } else {
                    const attrRealName = attrName.substr(2);
                    this.update(node, key, attrRealName);
                }
            }
        })
    }
}

// 3、利用sanbbdom实现电影列表

import { h } from 'snabbdom/build/package/h'
import { init } from 'snabbdom/build/package/init'
import { styleModule } from 'snabbdom/build/package/modules/style';
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'

const patch = init([styleModule, eventListenersModule]);

let moviesYds = [
    { rank: 1, title: 'This is an', desc: 'Lorem ipsum dolor sit amet, sed pede integer vitae bibendum, accumsan sit, vulputate aenean tempora ipsum. Lorem sed id et metus, eros posuere suspendisse nec nunc justo, fusce augue placerat nibh purus suspendisse. Aliquam aliquam, ut eget. Mollis a eget sed nibh tincidunt nec, mi integer, proin magna lacus iaculis tortor. Aliquam vel arcu arcu, vivamus a urna fames felis vel wisi, cursus tortor nec erat dignissim cras sem, mauris ac venenatis tellus elit.' },
    { rank: 2, title: 'example of', desc: 'Consequuntur ipsum nulla, consequat curabitur in magnis risus. Taciti mattis bibendum tellus nibh, at dui neque eget, odio pede ut, sapien pede, ipsum ut. Sagittis dui, sodales sem, praesent ipsum conubia eget lorem lobortis wisi.' },
    { rank: 3, title: 'Snabbdom', desc: 'Quam lorem aliquam fusce wisi, urna purus ipsum pharetra sed, at cras sodales enim vestibulum odio cras, luctus integer phasellus.' },
    { rank: 4, title: 'doing hero transitions', desc: 'Et orci hac ultrices id in. Diam ultrices luctus egestas, sem aliquam auctor molestie odio laoreet. Pede nam cubilia, diam vestibulum ornare natoque, aenean etiam fusce id, eget dictum blandit et mauris mauris. Metus amet ad, elit porttitor a aliquet commodo lacus, integer neque imperdiet augue laoreet, nonummy turpis lacus sed pulvinar condimentum platea. Wisi eleifend quis, tristique dictum, ac dictumst. Sem nec tristique vel vehicula fringilla, nibh eu et posuere mi rhoncus.' },
    { rank: 5, title: 'using the', desc: 'Pede nam cubilia, diam vestibulum ornare natoque, aenean etiam fusce id, eget dictum blandit et mauris mauris. Metus amet ad, elit porttitor a aliquet commodo lacus, integer neque imperdiet augue laoreet, nonummy turpis lacus sed pulvinar condimentum platea. Wisi eleifend quis, tristique dictum, ac dictumst. Sem nec tristique vel vehicula fringilla, nibh eu et posuere mi rhoncus.' },
    { rank: 6, title: 'module for hero transitions', desc: 'Sapien laoreet, ligula elit tortor nulla pellentesque, maecenas enim turpis, quae duis venenatis vivamus ultricies, nunc imperdiet sollicitudin ipsum malesuada. Ut sem. Wisi fusce nullam nibh enim. Nisl hymenaeos id sed sed in. Proin leo et, pulvinar nunc pede laoreet.' },
    { rank: 7, title: 'click on ar element in', desc: 'Accumsan quia, id nascetur dui et congue erat, id excepteur, primis ratione nec. At nulla et. Suspendisse lobortis, lobortis in tortor fringilla, duis adipiscing vestibulum voluptates sociosqu auctor.' },
    { rank: 8, title: 'the list', desc: 'Ante tellus egestas vel hymenaeos, ut viverra nibh ut, ipsum nibh donec donec dolor. Eros ridiculus vel egestas convallis ipsum, commodo ut venenatis nullam porta iaculis, suspendisse ante proin leo, felis risus etiam.' },
    { rank: 9, title: 'to witness', desc: 'Metus amet ad, elit porttitor a aliquet commodo lacus, integer neque imperdiet augue laoreet, nonummy turpis lacus sed pulvinar condimentum platea. Wisi eleifend quis, tristique dictum, ac dictumst.' },
    { rank: 10, title: 'the effect', desc: 'Et orci hac ultrices id in. Diam ultrices luctus egestas, sem aliquam auctor molestie odio laoreet. Pede nam cubilia, diam vestibulum ornare natoque, aenean etiam fusce id, eget dictum blandit et mauris mauris' },
];

let oldNode = null;

const getContainer = () => {
    return h('div.container', [btnVnode(), vMovieListBox()]);
}

const vMovieListBox = () => {
    return h('ul.movie-list', [...vMovieList(moviesYds)]);
}

const vMovieList = movies => {
    return movies.map(movie => {
        return h(
                'li',
                {style: {lineHeight: '20px', listStyle: 'none', marginBottom: '20px'}},
                [
                    h('span', {style: { display: 'inline-block', width: '5%', verticalAlign: 'top' }}, movie.rank),
                    h('span', {style: { display: 'inline-block', width: '10%', verticalAlign: 'top' }}, movie.title),
                    h('span', {style: { display: 'inline-block', width: '85%', verticalAlign: 'top' }}, movie.desc)
                ]
            )
    })
}

const btnVnode = () => {
    const eventHandlerList = ['sortForRank', 'sortForTitle', 'sortForDesc', 'sortForReset']
    const btnList = ['Rank', 'Title', 'Desc', 'Reset'].map((key, i) => {
        return h('span', {
            style: { 
                display: 'inline-block', 
                width: '100px', 
                lineHeight: '30px' ,
                cursor: 'pointer'
            },
            on: {
                click: eventHandler[eventHandlerList[i]]
            }
        }, key);

    });
    return h('div.btn', {}, [
        h('span', {style: { 
            display: 'inline-block', 
            width: '100px', 
            lineHeight: '30px' 
        }}, 'Sort By:'), 
        ...btnList
    ])
}

const sort = (key) => {
    moviesYds.sort((a, b) => {
        if (key === 'rank') {
            return b.rank - a.rank;
        }
        return a[key].localeCompare(b[key], 'zh');
    });
}

const sortForReset = () => {
    moviesYds.sort((a, b) => {
        return a.rank - b.rank;
    });
    oldNode = patch(oldNode, getContainer());
}

const sortForRank = () => {
    sort('rank');
    oldNode = patch(oldNode, getContainer());
}

const sortForTitle = () => {
    sort('title');
    oldNode = patch(oldNode, getContainer());
}

const sortForDesc = () => {
    sort('desc');
    oldNode = patch(oldNode, getContainer());
}

const eventHandler = {
    sortForRank,
    sortForTitle,
    sortForDesc,
    sortForReset
}

const firstRender = () => {
    const div = document.querySelector('#app');
    oldNode = patch(div, getContainer());
}

// firstRender();
