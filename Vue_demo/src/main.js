import App from './App'
import Vue from 'vue'
import router from './router/index'

new Vue({
  el: '#app',
  components: {App},
  template: '<App/>',
  //上面引入这里声明即可
  router: router
})
