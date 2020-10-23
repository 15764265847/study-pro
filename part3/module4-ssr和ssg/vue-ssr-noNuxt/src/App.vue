<template>
  <div id="app">
      <h1>{{ message }}</h1>
      <h1>客户端动态交互</h1>
      <div>
          <input v-model="message" type="text">
      </div>
      <div>
          <button @click="onClick">点击测试</button>
      </div>
  </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            message: '拉钩教育'
        }
    },
    methods: {
        onClick() {
            console.log('Hello World');
        }
    }
}
</script>

<style>

</style>