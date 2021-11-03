<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
<!-- **组件间通信:-->
<!--        1,使用props进行,在父组件里给子组件里绑定数据,在子组件里使用props接收即可-->
<!--        <todo-header :addTodo="addTodo"/>-->

<!--        2,使用事件监听,-->
  <!--        在父组件里定义事件并且把这个事件绑定给子组件并且监听子组件-->
  <!--        在子组件里定义何时触发事件-->
  <!--          方式一:直接@或者v-on绑定(常用)-->
      <!--        这里给这个子组件添加了一个自定义事件并且监视,监视就代表着在子组件里某个条件下会触发这个事件-->
      <!--        这个事件是我们自定义的,因此我们需要定义这个事件发生后会发生什么-->
  <!--            <todo-header @addTodo="addTodo"/>-->
  <!--            <todo-header v-on:addTodo="addTodo"/>-->
  <!--          方式二,使用obj.$on方法给组件绑定监听(和上面原理都是一样的)(不常用)-->
  <!--        绑定子组件首先要知道子组件信息吧,前面说的使用ref来标识组件里的标签或者组件,这样就可以使用obj.$ref.值 来访问这个元素对象-->
  <!--        我们需要在下面的实例里给这个组件绑定一个事件监听，什么时候绑定？-->
  <!--        前面说的vue的生命周期,一般是在渲染完成后绑定,即vm和模板都绑定好了之后,即mounted-->
        <todo-header ref="header"/>
<!--            事件监听的缺点就在于,只能父=>子 不能父=>子=>子,也就是说,之间只能隔一级-->
<!--            而第一种方法的props可以实现任意祖先和后代之间的通信,但是每次都要书写props,并且需要一级一级的书写传递-->
<!--            因此还有下面这种方式-->


<!--          3,使用PubSub的subscribe(订阅)和publish(发布)-->
<!--                  PubSub.js是第三方模块,我们需要先下载它,然后import引入,之后就可以使用它里面的subscribe和publish方法-->
<!--                  下面把这个deleteTodo以订阅和发布的方式在组件间通信-->
<!--        !!!!不需要再组件元素中指定事件,直接在钩子里将这个消息订阅了,即等待接收所有组件发布的消息,想要给哪个组件绑定事件,就在哪个组件里发布就行-->
<!--        <todo-list :todos="todos" :deleteTodo="deleteTodo"/>-->
        <todo-list :todos="todos"/>


<!--        上面是一些传递数据的通信方式,接下来还有一个方式是传递标签的-->

<!--        其实很多时候的组件都是会复用的,后面可能会用到,比如这里的一个footer组件只有一个,但是不同的地方显示的又有区别-->
<!--        我们可以理解在这个footer组件上开了好多不同位置插槽,在哪个组件用就把需要的标签插上那个插槽就行-->
<!--        这里的插槽是slot,即留白了,我在这里使用的话 根据slot的name指定这个留白填上什么就可以-->
<!--        <todo-footer :deleteSelect="deleteSelect" :seleteAll="seleteAll" :todos="todos"/>-->
<!--        现在去对应的组件里留下插槽-->
        <todoFooter>
<!--          插槽定义好之后,这里只需要指定插槽里要放什么就行-->
<!--          注意一一对应关系是通过标签里slot属性和插槽的slot值对应上-->
<!--          由于具体内容是在这里定义的,因此需要的数据或者函数都应该在这里定义-->
          <input type="checkbox" v-model="isAllSec" slot="checkAll"/>
          <span slot="count"><span>已完成{{alerySize}}</span> / 全部{{todos.length}}</span>

          <button class="btn btn-danger" slot="clear_btn" @click="delete_select">清除已完成任务</button>
        </todoFooter>
      </div>
    </div>
  </div>
</template>

<script>
import todoHeader from './components/todoHeader'
import todoList from './components/todoList'
import todoFooter from './components/todoFooter'
import PubSub from 'pubsub-js'
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


// 使用vm提供的钩子挂载我们想要绑定的函数
mounted(){
    //这里绑定是不像上面标签里直接绑定事件和事件发生后的函数就行
  //这里是传递两个参数,一个是事件名,另一个是事件发生后如何处理,即一个函数
    this.$refs.header.$on('addTodo',this.addTodo)

  //在这里订阅消息,使用如下的方法
  //这里这个函数接收两个参数,一个是事件名,一个是触发事件后的回调函数
  //该回调函数有两个参数,第一个即事件名(没用,但必须要写上),第二个为数据,可以为其他组件发布时传来的数据\
  //OK 在这里去item组件里发布

  //使用订阅和发布的好处在于,不需要每次都手动指定往哪个组件里传递,只要订阅一下其他组件里想发布就直接接受了
  //而且不局限与父子,祖孙,包括兄弟组件间都可以
  PubSub.subscribe('deleteTodo', (msg,index)=> {
    this.deleteTodo(index)
  })
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
    test(){
      this.localStorage.setItem('111111', 123)
    },


    //来自插槽的方法
    delete_select(){
      if(confirm('确认删除选中吗')){
        this.deleteSelect()
      }
    }
  },


  // 给插槽定义的属性和方法
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
