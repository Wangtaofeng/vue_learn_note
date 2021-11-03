<template>
  <section class="jumbotron">
    <h3 class="jumbotron-heading">Search Github Users</h3>
    <div>
      <input type="text" placeholder="enter the name you search" v-model="searchName"/>
      <button @click="search">Search</button>
    </div>
  </section>
</template>

<script>
//如果在这里点击search发请求,那么就需要将请求后的结果传递给其他组件
//这里并不能处理请求的结果,因此还是决定哪里需要请求并且处理请求结果就让哪里去发送好了
//这里只是告诉它什么时候去发送即可
import PubSub from 'pubsub-js'
export default {
  name: "Search",
  data(){
    return{
      searchName:''
    }
  },
  methods:{
    search(){
      PubSub.publish('search',this.searchName)
    }
  }
}
</script>

<style scoped>

</style>
