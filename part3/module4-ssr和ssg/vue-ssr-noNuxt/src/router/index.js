import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const createRouter = () => {
    const router = new VueRouter({
        // 服务端渲染不能使用hash模式，因为服务端不会将hash作为请求
        // 但是history会
        mode: 'history', 
        routes: [
            {
                path: '/',
                name: 'home',
                component: () => import('@/pages/Home.vue') 
            }
        ]
    });
    return router;
}