<template>
  <div class="col-md-8">
    <h3 class="reply">评论回复：</h3>
    <h2 style='display: none'>暂无评论，点击左侧添加评论！！！</h2>
    <ul class="list-group">
<!--      这里的:key是必须的!!!!!!!!!!!!!!!!!!!!!-->
      <Item v-for="(value,index) in comments" :key="index" :value="value" :index="index" :deleteComment="deleteComment"/>
    </ul>
  </div>
</template>

<script>
import Item from "./Item";
export default {
name: "List",
  //在App组件那里已经将comments数据通过标签传过来了,这里只需要声明一下即可使用
  props:{comments:Array,deleteComment:Function},
  components:{Item}
}
</script>

<style scoped>
.reply {
  margin-top: 0px;
}

li {
  transition: .5s;
  overflow: hidden;
}


.handle a {
  display: block;
  text-decoration: none;
}

.list-group-item .centence {
  padding: 0px 50px;
}


</style>
