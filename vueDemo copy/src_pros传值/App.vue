<template>
  <div>
    <header class="site-header jumbotron">
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <h1>请发表对React的评论</h1>
          </div>
        </div>
      </div>
    </header>
    <div class="container">

      <Add :commentsAdd="commentsAdd"/>
<!--      这里就需要组件之间进行通信,List要访问App组件的数据-->
<!--      这里可以在下面定义好数据之后,直接给组件标签绑定即可传输到指定组件里-->
<!--      但是组件接收到数据之后,需要引用声明一下才能使用-->
<!--      (在组件对象里声明props对象里写上组件名和组件值)-->
      <List :comments="comments" :deleteComment="deleteComment"/>
    </div>
  </div>
</template>

<script>
import Add from "./components/Add";
import List from "./components/List";
export default {
  //这里面不是vm,而是一个组件对象,用法和v几乎一致,但是不需要el绑定,因为已经默认和组件绑定了
  //要操作的对象在哪个组件,操作对象方法就定义在哪个组件里,通过一层一层传递到对应的组件
name: "App",
  data(){
    return{
      comments:[
        {
          username:"fff",
          content:"vue真不错"
        },
        {
          username:"ttt",
          content:"js真不错"
        },
        {
          username:"hhh",
          content:"算法好难学"
        }
      ]
    }
  },
  methods:{
  //数组方法shift()删除并返回数组的第一个元素
    //unshift()在数组头部添加一个元素并返回新长度
    commentsAdd(comment){
      this.comments.unshift(comment)
    },
    deleteComment(index){
      //splice()从数组中添加或删除或修改元素(一般用作删除或修改)
      this.comments.splice(index,1)
    }
  },
  components:{
    Add,
    List
  }
}
</script>

<style scoped>

</style>
