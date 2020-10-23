<template>
    <div></div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
export default {
    computed: {
        // 第一种写法，使用命名空间后这么写，第一个参数表示是哪一个命名空间
        // 第二个参数表示，使用属性
        ...mapState('products', ['products'])
        ...mapState({ // 第二种写法
            products: state => state.products
        })
        ...mapState(['products']) // 第三种写法
        ...mapState({ prod: 'products' }) // 第四种写法
    }
}
</script>