const myPlugin = store => {
    store.subscribe((muttation, state) => {
        // mutations.type表示当前的mutation是哪一个，如果有命名空间则前面会拼上命名空间
        if (mutations.type.startWith('cart/')) {

        }
    })
}

export default new Vuex.Store({
    modules: {
        ...{}
    },
    plugin: [myPlugin]
})