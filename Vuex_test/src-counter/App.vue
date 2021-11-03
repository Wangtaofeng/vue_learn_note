<template>
  <div id="app">
    <p>{{count}} times and is {{evenOrOdd}}</p>
    <button @click="increment">+</button>
    <button @click="decrement">+</button>
    <button @click="incrementIfOdd">increment if odd</button>
    <button @click="incrementAsync">increment async</button>
  </div>
</template>

<script>
// 可以通过vuex提供的map...方法来简化下面注释中的代码
// 该方法的作用就是传进两个参数,将一个为this.参数1,一个为对应的store里面的方法或属性
// 随后返回这两个参数映射的对象
// 具体可以看下代码
import {mapActions, mapGetters, mapState} from 'vuex'

export default {
  name: 'App',
  computed: {
    // count () {
    //   return this.$store.state.count
    // },

    // ...是对象解构赋值,会将后面的返回的对象映射到这里
    // 方法的返回值为 this.count : fn
    ...mapState({count: 'count'}),

    // evenOrOdd () {
    //   return this.$store.getters.evenOrOdd
    // }

    //同上,但是如果只有一个对象并且this里面要设置的对象和store里面映射的是同名时,可以使用一下简化写法(most choice)
    ...mapGetters(['evenOrOdd'])
  },
  methods: {
    // increment () {
    //   this.$store.dispatch('increment')
    // },
    // decrement () {
    //   this.$store.dispatch('decrement')
    // },
    // incrementIfOdd () {
    //   this.$store.dispatch('incrementIfOdd')
    // },
    // incrementAsync () {
    //   this.$store.dispatch('incrementAsync')
    // }

    //采用上述那种数组传值的方式会更加简单
    //这种方式似乎不行
    // ...mapActions([{'increment': increment}, {decrement: 'decrement'}, {incrementIfOdd: 'incrementIfOdd'}, {incrementAsync: 'incrementAsync'}])
    ...mapActions(['increment', 'decrement', 'incrementIfOdd', 'incrementAsync'])
  }
}
</script>

<style>

</style>
