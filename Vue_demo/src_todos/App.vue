<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
<!--        <todo-header :addTodo="addTodo"/>-->
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
      /**一个复选框或者单选框框,除了value值和vm里面绑定的数据一致会被选中之外
      如果绑定的数据是布尔型的话,那么为 true就是选中,false就是取消选中
     **/
      // todos: [
      //   {status: false,content: "彤彤"},
      //   {status: false,content: "占位"},
      //   {status: false,content: "大哥沙雕"}
      // ]

      //这里的数据是我们写死的，可以试一下在本地储存之后读取
      //关于localstorage这里补充一点就是这里面是将数据都保存成为了字符串的形式，为了格式的统一，我们在存的时候可以选择存为json格式
      //读取的时候解析为json
      //todos还是一个数组，初始化是一个空数组，如果有数据的时候会在本地保存这个数组，无论是空数组还是非空，保存的时候是保存了它的json格式
      //但是使用的时候是解析后的正常的数组，这里就是加了一个存在本地存为json  使用时解析json为数组
      todos:JSON.parse(window.localStorage.getItem('todo_key')||'[]')
    }
  },
//存数据，在todos变化的时候将数据存储到本地
  //这就需要监视todos
  // 问题来了，怎么样算变化，一般的监视只能监视todos这个对象本身是否发生改变
  //但是在这里我在 todos里面添加数据也应该存起来，将todos里面的对象的状态的改变（某个属性）也要保存起来
  //这样就用到了深监视，这样可以监视对象的所有属性以及层层属性的变化
  watch:{
    //监视谁？
    todos:{
      //开启深监视
      deep:true,
      //和之前的监视的区别在于 ，这里深监视的处理函数是在监视的属性内部定义
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
      //数组的过滤,一个回调函数,形参就是数组的每一项的值,需要返回一个布尔值表示根据什么数组的什么来过滤
      //过滤后产生了一个符合条件的新的数组,需要接收这个数组
      this.todos=this.todos.filter(todo=>!todo.status)
    },
    //全选与否是在这里对数组进行操作的,但是是否全选不是这里决定的 , 这里只是根据子组件的传来的状态决定是否全选
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
