<template>
  <div class="todo-header">
    <input type="text" v-model="content" placeholder="请输入你的任务名称，按回车键确认" @keypress.13="addOne"/>
  </div>
</template>

<script>
export default {
  //使用事件绑定和监听后就不需要这里的props了
  // props:{addTodo:Function},
  name: 'todoHeader',
  data(){
    return{
      content:''
    }
  },
  methods:{
    addOne(){
      let todo={status:false,content:this.content}
      // this.addTodo(todo)

      //this.$emit表示触发事件,里面参数是事件名和触发事件传递的数据,见App里面的on 那里是监视事件
      this.$emit('addTodo',todo)
      this.content=''
    }
  }
}
</script>

<style scoped>
.todo-header input {
  width: 560px;
  height: 28px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 7px;
}

.todo-header input:focus {
  outline: none;
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);
}

</style>
