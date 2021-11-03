export default {
  allCount(state) {
    return state.todos.length
  },
  // 这里需要一个初始值0,因为一开始这个sum是没有值的,如果让它默认等于第一个的话,第一个并不是一个数值
  alreadyCount(state) {
    return state.todos.reduce((sum, num) => {
      return sum + (num.status ? 1 : 0)
    },0)
  },
  // 当getters里面的方法需要其他方法的返回值的时候, 可以直接在参数里添加上getters
  orNot(state, getters) {
    return getters.allCount === getters.alreadyCount && state.todos.length > 0
  }

}
