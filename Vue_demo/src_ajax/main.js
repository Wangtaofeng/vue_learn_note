import Vue from 'vue'
import App from './App'
//引入插件并声明使用
import VueResource from 'vue-resource'
 Vue.use(VueResource)
new Vue({
  el:'#app',
  components:{App},
  template:'<App/>'
})
