<template>
  <ul>
    <li>
      <p>id: {{massageDetail.id}}</p>
      <p>title: {{massageDetail.title}}</p>
      <p>content: {{massageDetail.content}}</p>
      <p>{{msg}}</p>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'massageDetail',
  props: {
    msg: String
  },
  data() {
    return {
      massageDetail: {}
    }
  },
  mounted() {
    setTimeout(() => {
      const massageDetail = [
        {
          id: 1,
          title: 'massage01',
          content: 'massage001 content'
        },
        {
          id: 2,
          title: 'massage02',
          content: 'massage002 content'
        },
        {
          id: 3,
          title: 'massage03',
          content: 'massage003 content'
        }
      ]
      this.massageD=massageDetail
      // $route是当前路由路由组件所激活使用的，里面保存的是当前路由组件的信息，比如query params等信息
      //而$router是管理所有路由的，它里面会保存所有的路由信息，以及提供了一些管理路由的方法
      //这里需要直接获取路由路径里面的id  可以通过vm的$route的方法来得到路由路径的信息
      //*1是为了转化为数字
      const id = this.$route.params.id * 1
      //这里需要对比路径中的id 从而返回不同的结果 但是结果是一个对象而不是数组,因此不能用filter方法,find方法是返回数组中满足条件的元素
      this.massageDetail = this.massageD.find(detail => detail.id === id)
    }, 1000)
  },
  //但是存在一个问题就是,这里的路由组件只会执行一次mounted,因为是同一个路由,只是参数id变化了,所以只会对比一次
  //因此这里需要再监视一下路由的变化,不然的话只会执行一次上面的mounted函数,也就是只会对比一次
  watch:{
    //注意这里是route 是路由,而router是路由器 是在index里面配置的
    $route:function (value) {
      const id = value.params.id * 1
      this.massageDetail = this.massageD.find(detail => detail.id === id)
    }
  }
}
</script>

<style scoped>

</style>
