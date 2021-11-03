<template>
  <div>
    <p v-if="!name">正在加载</p>
    <p v-else v-text="name"></p>
  </div>
</template>

<script>
export default {
  name: "App",
  data () {
    return {
      name: ''
    }
  },
  //这里使用created或者mounted都是一样的效果,本身应该是created是在页面渲染之前请求获取数据的,这里好像没有达到那个效果,后续再跟进说明吧
  created () {
    //vue-resource插件可以实现post和get请求
    //使用插件需要声明使用 即用vm实例声明  vm在main里
    const url = 'https://api.github.com/search/repositories?q=v&sort=stars'
    // this.$http.get(url)
    // .then(data=>{
    //   this.name=data.data.items[0].name
    // })
    // .catch(error=>{
    //   alert("出错")
    // })
    //和axios使用一样,都是返回一个promise对象,但是包括axios在内,还有一种处理异常的方式
    //就是在then里面的回调函数接收两个回调函数,第一个是成功,第二个是失败,这样可以不用使用catch
    this.$http.get(url).then(
      data => {
        this.name = data.data.items[0].name
      },
      error => {
        alert(error)
      }
    )
  }

}
</script>

<style scoped>
</style>
