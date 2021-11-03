<template>
  <ul class="todo-main">
<!--    <todo-item v-for="(todo,index) in todos" :key="index" :todo="todo" :index="index" :deleteTodo="deleteTodo"/>-->
<!--    不需要传递和接收deleteTodo了,方法都是公用的-->
    <todo-item v-for="(todo,index) in todos" :key="index" :todo="todo" :index="index"/>
  </ul>
</template>

<script>
import todoItem from './todoItem'
import {mapState} from 'vuex'
import localStorage from '../utils/localStorage'

export default {
  name: 'todoList',
  computed: {
    ...mapState(['todos'])
  },
  // 只要有todos的地方都能去监视todos的变化
  watch: {
    todos: {
      deep: true,
      // handler: function (value) {
      //   // 这里直接更新到本地就行, 不需要对state进行操作, 因为会有vuex里已经设置了read函数来读取本地的todos
      //   // 另外这里不需要担心mounted里读取执行几次,因为变化的todos会直接更新到state里 这里的保存本地和读取本地只是在最开始加载的时候读取一次
      //   localStorage.setTodos(value)
      // }
      // 上述的方法等同于这个,注意handler属性是一个函数值,这里直接写上对应的定义好的函数值即可,并不需要调用,因为不需要我们去调用
      handler: localStorage.setTodos
    }
  },
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
