<template>
  <ul class="todo-main">
    <todo-item v-for="(todo,index) in todos" :key="index" :todo="todo" :index="index" :deleteTodo="deleteTodo"/>
  </ul>
</template>

<script>
import todoItem from "./todoItem"
export default {
  name: 'todoList',
  props: {todos: Array,deleteTodo:Function},
  components: {todoItem}
}
</script>

<style scoped>
.todo-main {
  margin-left: 0px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0px;
}

.todo-empty {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-left: 5px;
  margin-top: 10px;
}
</style>
