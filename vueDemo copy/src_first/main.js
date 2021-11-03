import Vue from 'vue'
//注意这里引入需要和组件名一致
import App from './App.vue'
new Vue({
  //入口main需要和入口index绑定,因此需要一个 vue实例来绑定index里的根标签
  el:"#app",
  //组件映射,前面用过,即给组件起一个组件标签名
  components:{
    App:App
  },
  //这里是入口文件特有的,是指定了需要渲染的模板,这个模板就是上面指定的模板,当然标签名要对上
  //这样做之后,index会自动将这个模板标签加到根标签里面
  //其实在vue的声明周期里面有检查是否有template这一步,有的话就自动渲染了
  template:'<App/>'
})
