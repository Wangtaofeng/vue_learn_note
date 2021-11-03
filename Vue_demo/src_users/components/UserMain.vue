<template>

<!--  //vue的组件里只有一个根元素,也就是需要有一个容器将所有包起来-->
  <div>
    <h2 v-if="firstView">输入用户名搜索</h2>
    <h2 v-if="loading">LOADING...</h2>
    <h2 v-if="errorMsg">{{errorMsg}}</h2>
    <div v-show="users" class="row">
      <div class="card" v-for="(user,index) in users"  :key="index">
        <a :href="user.url" target="_blank">
          <img :src="user.avatar_url" style='width: 100px'/>
        </a>
        <p class="card-text">{{user.name}}</p>
      </div>
    </div>
  </div>

</template>

<script>
import PubSub from 'pubsub-js'
import axios from 'axios'
export default {
  name: "UserMain",
  data(){
    return{
      firstView:true,
      loading:false,
      errorMsg:'',
      users:null
    }
  },
  //从一开始就要给这里绑定监听,而不是后来才绑定
  mounted() {
    PubSub.subscribe('search',(msg,searchName)=>{
      this.firstView=false
      this.loading=true
      this.users=null
      axios({
          method:'get',
          url:`https://api.github.com/search/users?q=${searchName}`

        }).then((data)=>{
          this.users=data.data.items.map((item)=>{
            return{
              url: item.html_url,
              avatar_url: item.avatar_url,
              name: item.login
            }
          })
        this.loading=false
      }).catch((err)=>{
        this.errorMsg=err
        this.loading=false
      })
    })
  }

}
</script>

<style scoped>
.card {
  float: left;
  width: 33.333%;
  padding: .75rem;
  margin-bottom: 2rem;
  border: 1px solid #efefef;
  text-align: center;
}

.card > img {
  margin-bottom: .75rem;
  border-radius: 100px;
}

.card-text {
  font-size: 85%;
}

</style>
