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
  //这里需要用到计算属性,因为这里已完成的需要统计所有的todo的状态 而不单单是一个变量
    //这里的所有状态需要实时根据实际状态去改变,而在data里定义的数据只能是定义的,并不能通过其他的属性来计算
    //要根据所有的已选中的todo来更新下面的数据 但是todo是我们的一个属性,因此需要计算属性
    //总结来说就是当需要的数据是独立的时候, 可以定义为data里面
    // 但是当需要的数据是根据其他已存在的数据(即属性)计算而来的时候,就需要用到计算属性

    //这里定义已完成的数据
    alerySize(){
      //这里需要说明一下这个reduce函数 , 该数组的方法接收两个参数
      //先说第二个参数,该参数是可以不传,但是不传值的那么该值就默认是数组的第一项,
      // 同时reduce返回的类型也和数组的第一项相同
      //传值的话 ,该值就作为reduce计算的初始值并且返回值类型需要和这里保持一致

      //接着就说第一个参数
      //这里一般使用一个函数作为参数,函数里的参数有好些个,暂且只介绍两个常用的
      //第一个参数用于保存累加计算的和,其初始值为上上述说的第二个参数,并且从数组的第一项开始计算
      // 当上上述参数没有传的时候,该参数初始值就为数组的第一项,并且计算时就默认已经计算过第一项了,从从第二项开始计算
      return this.todos.reduce((sum,num)=>{return sum+(num.status?1:0)},0)
    },

    //这里很简单的做了一个判断来决定全选复选框是否需要根据状态打上√
    //但是这里也仅仅只能去判断,因为只能根据其他属性的状态来决定是都已经选中了
    //即这只是一个可读,根据读取别人的状态来改变自己的状态,这个暂时先不用了,功能达不到所需要
    // isAllSec(){
    //   if(this.alerySize===this.todos.length&&this.todos.length>0){
    //     return true
    //   }else{
    //     return false
    //   }
    // }
    //但是全选框应该也可以去设置啊,即可以手动改变自己的状态,而不是只能通过读取别人的
    //并且有一点是,当它主动改变了自己的状态的时候,也可以去改变其他属性的状态,在App里已经定义了改变其他属性的方法
    //这里只需要指定当自己改变的时候,怎么样去改变其他属性

    //上述这么说的意思就是,这里的复选框既可以通过读取其他属性的状态来决定自己是否被选中
    //同样的也可以监视通过自己的改变从而对其他属性造成什么影响

    //即这样就想到了getter 和 setter 一个是读取,只读,通过读取自己的或别人的来决定返回什么
    //一个是监视,监视当自己改变的时候(手动选中或者取消)对自己或者对其他属性造成什么影响
    isAllSec:{
      get(){
        return this.alerySize===this.todos.length&&this.todos.length>0
      },

      //这里的value之前也介绍过,value就是被监视的对象变化后的值
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
