const state = {
    products: []
};
const mutations = {
    doSomething(state, payload) {
        state.products = payload;
    }
};
const actions = {
    doAnything(ctx, data) {
        const { commit } = ctx;
        commit('doSomething', data);
    }
};
const getters = {}

exports default {
    state,
    getters,
    mutations,
    actions
};