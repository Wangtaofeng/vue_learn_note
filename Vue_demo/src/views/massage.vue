<template>
  <div>
    <ul>
      <li v-for="massage in massages" :key="massage.id">
<!--        这里首先to需要一个双引号,因为这是在html里面,接着需要模板字符串转化为可以写的js语言去拼接-->
        <router-link :to="`/home/massage/massageDetail/${massage.id}`">{{massage.title}}</router-link>
<!--        -->
<!--        在页面不跳转的情况下使用上面的link声明式路由导航很方便也很友好-->
<!--        但是在页面需要跳转的情况下,router-view就没地方写了,需要编程式路由导航-->
<!--        这个意思就是调用$router里面管理路由的方法去进行跳转-->
<!--        其中push和replace的区别就是,一个是跳转到新的路由, 并且添加上一个路由到栈里,可以通过回退按钮返回-->
<!--        一个是直接替换当前的路由,不会保存被替换掉的路由信息-->
<!--        还有一个是go()里面传上参数,表示回到历史记录的哪里,传-1就回到栈顶路由-->
<!--        1在有前进按钮的前提下前进到下一个路由,go用的并不多-->
        <button @click="push(massage.id)">push查看</button>
        <button @click="replace(massage.id)">replace查看</button>
      </li>
      <button @click="back()">返回</button>
      <button @click="lastOne()">返回上一层</button>
    </ul>
<!--    还有一种传递信息的方式就是在router-view里面传递一个msg,这样的话,每个对应的view就会收到这个msg-->
<!--    就和之前的组件标签里传递消息一样,在对应的组件里还需要接收一下-->
    <router-view msg="abc"></router-view>

  </div>
</template>

<script>
export default {
  name: "massage",
  data() {
    return {
      massages: []
    }
  },
  mounted(){
    setTimeout(()=>{
      const massages = [
        {
          id: 1,
          title: "massage1",
          content: "massage1 content"
        },
        {
          id: 2,
          title: "massage2",
          content: "massage2 content"
        },
        {
          id: 3,
          title: "massage3",
          content: "massage3 content"
        }
      ]
      this.massages=massages
    },1000)
  },
  methods: {
    push(id){
      //这里是写上把哪个路由压栈'
      //而不是直接就压栈了
      this.$router.push(`/home/massage/massageDetail/${id}`)
    },
    replace(id){
      this.$router.replace(`/home/massage/massageDetail/${id}`)
    },
    back(){
      this.$router.back()
    },
    lastOne(){
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
