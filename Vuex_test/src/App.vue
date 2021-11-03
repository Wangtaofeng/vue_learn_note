<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
        <!--        <todo-header :addTodo="addTodo"/>-->
        <todo-header />
        <todo-list />
        <todo-footer />
      </div>
    </div>
  </div>
</template>

<script>
import todoHeader from './components/todoHeader'
import todoList from './components/todoList'
import todoFooter from './components/todoFooter'

export default {
  name: 'App',
  // 获取后台异步加载的数据应该在mounted里,而且一般来说实在app组件里
  mounted () {
    this.$store.dispatch('read')
  },
  components: {
    todoHeader,
    todoFooter,
    todoList
  }
}
</script>

<style scoped>
.todo-container {
  width: 600px;
  margin: 0 auto;
}

.todo-container .todo-wrap {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
