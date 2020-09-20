动态路由
    detail/:id
    获取其中的id
        方式一：this.$route.params.id
        方式二：router.js中配置路由的时候使用props属性，如下，设置了props属性为true表示开启props传值，只要在对应组件中配置props接收即可
            const routes = [
                {
                    path: '/path/:id',
                    props: true,
                    components: () => import(.....);
                }
            ]
            组件中使用props接收即可
                props: {
                    id: String,
                    default: ''
                }
    这里推荐使用方式二，不依赖于this.$route.params来获取


nginx配置history路由，主要是配置try_files $uri $uri/ /index.html;，表示尝试寻找web端请求的地址，如果找不到就返回index.html
    server {
        location / {
            root html;
            index index.html index.htm;
            try_files $uri $uri/ /index.html;
        } 
    }

Vue分为两个版本，运行时版本和完整版本
    运行时版本：无法使用template，因为没有编译器，需要打包的时候提前编译
        PS：我们在写vue项目的时候我们会使用vue-loader来将我们的组件转成render函数，使用render生成虚拟DOM，然后转成真实DOM
    完整版本：包含运行时和编译器，会在运行的时候把模板转换为render函数，因为包含编译器，所以比运行时版本答10k

    当我们直接使用vue.component写组件的时候使用运行时版本就会报错
        解决方式：
            1、使用完整版
                在vue的配置文件vue.config.js中配置runtimeCompiler属性为true就可以使用完整版
                    module.exports = {
                        runtimeCompiler: true
                    }
            2、在组件中添加render函数
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
                            }
                        }, [this.$slots.default])
                    }
                })
    