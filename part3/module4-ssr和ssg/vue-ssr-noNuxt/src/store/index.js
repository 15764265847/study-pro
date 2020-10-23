import Vue from 'vue';
import vuex from 'vuex';
import axios from 'axios';

Vue.use(vuex);

export const createStore = () => {
    return new vuex.Store({
        state: {
            posts: []
        },
        mutations: {
            setPosts(state, data) {
                state.posts = data;
            }
        },
        actions: {
            async getPosts({ commit }) {
                const { data } = await axios.get('https://cnodejs.org/api/v1/topcs');
                commit('setPosts', data.data);
            }
        }
    })
}