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
export default {
  name: 'App',
  // state里面的值不能再保存到data里了,因为data的数据是在vm初始化前就初始化赋值了
  // 而this.$store可能是在data赋值后才有的,因此会报错(这里不赞同网上博客说的初始化赋值成字面量)
  // data () {
  //   count: this.$store.state.count
  // }
  // 因此这里就需要计算属性了.无论是state的初始状态还是getters里面的其他值,都统一放在计算属性里
  computed: {
    count () {
      // 配置好store并且添加到vm里面之后,所有的组件对象中都会拥有$store属性了
      // 这个属性里就是store暴露出来的对象
      return this.$store.state.count
    },
    evenOrOdd () {
      return this.$store.getters.evenOrOdd
    }
  },
  methods: {
    increment () {
      // 不同的组件里都能操作state,但是操作的方式就通过$store的dispatch方法,里面传上方法名
      // 随后会在action里找到对应的方法并且执行
      // 注意传方法名的时候传的是方法的字符串形式
      this.$store.dispatch('increment')
    },
    decrement () {
      this.$store.dispatch('decrement')
    },
    incrementIfOdd () {
      this.$store.dispatch('incrementIfOdd')
    },
    incrementAsync () {
      this.$store.dispatch('incrementAsync')
    }
  }
}
</script>

<style>

</style>
