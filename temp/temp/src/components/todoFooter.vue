<template>
  <div class="todo-footer">
    <label>
      <input type="checkbox" v-model="isAllSec"/>
    </label>
    <span>
          <span>已完成{{alerySize}}</span> / 全部{{todos.length}}
        </span>
    <button class="btn btn-danger" @click="delete_select">清除已完成任务</button>
  </div>
</template>

<script>
export default {
  props:{deleteSelect:Function,seleteAll:Function,todos:Array},
  name: 'todoFooter',
  data(){
    return{

    }
  },
  methods:{
    delete_select(){
      if(confirm('确认删除选中吗')){
        this.deleteSelect()
      }
    }
  },

  computed:{

    alerySize(){

      return this.todos.reduce((sum,num)=>{return sum+(num.status?1:0)},0)
    },


    isAllSec:{
      get(){
        return this.alerySize===this.todos.length&&this.todos.length>0
      },

      set(value){
        this.seleteAll(value)
      }
    }
  }
}
</script>

<style scoped>
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
}

.todo-footer label {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}

.todo-footer label input {
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
}

.todo-footer button {
  float: right;
  margin-top: 5px;
}
</style>
