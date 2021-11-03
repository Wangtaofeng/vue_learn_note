const TODOS = 'todo_key'
export default {
  readTodos() {
    return JSON.parse(window.localStorage.getItem(TODOS) ? window.localStorage.getItem(TODOS) : '[]')
  },
  // 这里传来的是todos数组对象,因为触发这个函数的是深度监视,监视改变后的值,也就是添加完属性或者更改某个属性后的值之后的数组对象
  setTodos(todos) {
    window.localStorage.setItem(TODOS, JSON.stringify(todos))
  }
}
