<template>
      <div class="col-md-4">
        <form class="form-horizontal">
          <div class="form-group">
            <label>用户名</label>
            <input type="text" class="form-control" placeholder="用户名" v-model="username">
          </div>
          <div class="form-group">
            <label>评论内容</label>
            <textarea class="form-control" rows="6" placeholder="评论内容" v-model="content"></textarea>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <button type="button" class="btn btn-default pull-right" @click="add">提交</button>
            </div>
          </div>
        </form>
      </div>
</template>

<script>
export default {
  //这里将方法接收过来之后就成了这里组件对象的方法了
  props:{commentsAdd:Function},
  name: "Add",
  data(){
    return{
        content:"",
        username:"",
    }
  },
  methods:{
    add(){
      let{content,username,commentsAdd}=this
      if(!content||!username){
        alert("null")
        return
      }
      let comment={
        content,
        username,
      }
      commentsAdd(comment)
    }
  }
}
</script>

<style scoped>

</style>
