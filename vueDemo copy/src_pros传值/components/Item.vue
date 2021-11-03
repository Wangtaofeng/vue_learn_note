<template>
  <li class="list-group-item">
    <div class="handle">
      <a href="javascript:" @click="deleteItem">删除</a>
    </div>
    <p class="user"><span >{{value.username}}</span><span>说:</span></p>
    <p class="centence">{{value.content}}</p>
  </li>
</template>

<script>
export default {
name: "Item",
  props:{value:Object,deleteComment:Function,index:Number},
  methods:{
    deleteItem(){
      this.deleteComment(this.index)
    }
  }
}
</script>

<style scoped>
.handle {
  width: 40px;
  border: 1px solid #ccc;
  background: #fff;
  position: absolute;
  right: 10px;
  top: 1px;
  text-align: center;
}
.user {
  font-size: 22px;
}
</style>
