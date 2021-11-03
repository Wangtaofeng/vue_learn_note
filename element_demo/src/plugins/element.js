import Vue from 'vue'
import {Button, Loading, Message} from 'element-ui'
Vue.use(Button)
Vue.use(Loading)
Vue.use(Message)
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading
