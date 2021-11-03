<template>
<!--  根组件里必须要有一个根标签用于存放子组件的-->
  <div>
    <img src="./assets/logo.png">
    <Hollow/>
  </div>
</template>

<script>
    //引入需要的子组件,经过测试需要引入使用的名需要和子组件名一致
    import Hollow from "./components/Hollow";
    export default {
      components: {Hollow},
      // comments:{
      //   //原本应该是组件标签名:引入的组件名
      //   //如果二者一样可以直接简写
      //   H
      // }
    }
</script>

<style>
  img{
    display: block;
    height: 100px;
    width:100px;
  }
</style>
