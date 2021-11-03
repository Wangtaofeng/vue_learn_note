import Vuex from 'vuex'
import Vue from 'vue'

//Vue需要使用这个插件,并在main的对象中添加暴露的对象
//就类似于使用router一样,先配置好,在main里面使用即可
Vue.use(Vuex)
//状态对象
const state = {
  count: 0
}
//包含更新状态方法的对象
const mutations = {
  //定义直接操作count的方法,按照要实现的效果可知道,count的操作只有+和-
  // *****这里面的参数state是默认为store暴露的对象里的state****
  ADD (state) {
    state.count++
  },
  UNADD (state) {
    state.count--
  }

}
// 包含间接更新状态方法的对象,直接调用的是更新状态的方法,而不在这里进行更新
const actions = {
  // 现在这里面定义的是不同情况调用哪种mutations里面的方法操作state
  increment ({commit}) {
    // 这里的参数{commit}是解构赋值,即将vuex中的commit方法传进来,这里就可以直接调用
    // 调用commit方法的结果就是操作mutations里面的方法
    // 注意无论是哪里,涉及到传方法名的时候,都是传的字符串
    commit('ADD')
  },
  decrement ({commit}) {
    commit('UNADD')
  },
  // 只要需要用到state里面的值,就可以直接传进去
  incrementIfOdd ({commit, state}) {
    if (state.count % 2 === 0) {
      commit('ADD')
    }
  },
  incrementAsync ({commit}) {
    setTimeout(() => {
      commit('ADD')
    }, 1000)
  }
}
//get计算属性方法的集合
const getters = {
  evenOrOdd (state) {
    return state % 2 === 1 ? '奇数' : '偶数'
  }
}
export default new Vuex.Store({
  //管理状态对象
  state,
  //包含n个更新状态的方法
  mutations,
  //间接更新状态的方法
  actions,
  //get计算属性的对象
  getters
})
