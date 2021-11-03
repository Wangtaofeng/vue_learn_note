import {ADD, DELETE, IsAllSec, DeleteSelect, LOCAL} from './mutations_type'

export default {
  [ADD](state,{todo}) {
    state.todos.unshift(todo)
  },
  [DELETE](state, {index}) {
    state.todos.splice(index, 1)
  },
  [IsAllSec](state, {check}) {
    state.todos.forEach(todo =>{
      todo.status = check
    })
  },
  [DeleteSelect](state) {
    state.todos = state.todos.filter(todo => !todo.status)
  },
  [LOCAL](state, {todos}) {
    state.todos = todos
  }
}
