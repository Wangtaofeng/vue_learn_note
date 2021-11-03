// 和后台交互是放在actions里的
import localStorage from '../utils/localStorage'
import {ADD, DELETE, IsAllSec, DeleteSelect, LOCAL} from './mutations_type'

export default {

  addTodo({commit}, todo) {
    // 这里的commit里面的方法名不应该在这里指定,应该需要一个管理方法名的模块
    // 这样的话,actions引入后直接使用,而mutations里也是引入后直接使用,就会出现乱套的现象
    // commit('ADD',{todo})
    // 传给mutation的数据不管是什么类型的,都要用{}包起来表示传递了一个对象
    commit(ADD, {todo})
  },
  deleteTodo({commit},index) {
    commit(DELETE, {index})
  },
  isAllSec({commit}, check){
    commit(IsAllSec, {check})
  },
  deleteSelect({commit}) {
    commit(DeleteSelect)
  },
  //这里得到后台获取的数据,然后处理这些数据,并将处理好的数据传给mutation来决定对于state的处理
  read({commit}) {
    // 获取后台数据
    const todos = localStorage.readTodos()
    // 将处理好的数据交给mutation来决定对state的处理
    commit(LOCAL, {todos})
  }
}
