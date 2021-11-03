<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
        <todo-header @addTodo="addTodo"/>
        <todo-list :todos="todos" :deleteTodo="deleteTodo"/>
        <todo-footer :deleteSelect="deleteSelect" :seleteAll="seleteAll" :todos="todos"/>
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
  data(){
    return{
      todos:JSON.parse(window.localStorage.getItem('todo_key')||'[]')
    }
  },
//存数据，在todos变化的时候将数据存储到本地
  watch:{
    todos:{
      deep:true,
      handler:function (value) {
        window.localStorage.setItem('todo_key',JSON.stringify(value))
      }

    }
  },
  components: {
    todoHeader,
    todoFooter,
    todoList
  },
  methods:{
    addTodo(todo){
      this.todos.unshift(todo)
    },
    deleteTodo(index){
      this.todos.splice(index,1)
    },
    deleteSelect(){
      this.todos=this.todos.filter(todo=>!todo.status)
    },
    seleteAll(status){
      this.todos.forEach(todo=>todo.status=status)
    },
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
