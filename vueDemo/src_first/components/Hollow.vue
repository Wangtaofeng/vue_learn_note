<!--一个组件的三要素包含组件模板,js文件 , 和样式 ,-->
<!--其中js文件时需要向外部暴露一个default对象的-->
<template>
  <div>
    <p class="hollow">hollow world</p>
    <p>{{msg}}</p>
    <button onclick="test(this)">测试</button>
  </div>
</template>

<script>
  //组件里好像没法使用原生js,后续看看理解了再说吧
   function test(obj) {
      alert(obj)
    }
  export default {
    //这里就按照着之前书写vue来写,可以理解暴露的default就是一个vm吧
    //但是之前的按照属性书写的方式这里都不适用,需要使用属性同名的函数的方式,
    //在内部return就行,
    //比如之前data属性里面是一个对象,那么这里return返回一个对象即可
      data(){
        return{
          msg:"sdads"
        }
      }
  }
</script>

<style>
  .hollow{
    font-size: 30px;
    color: red;
  }
</style>
