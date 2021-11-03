import Vue from 'vue'
import VueRouter from 'vue-router'
//这里是配置路由器,在这里定义和管理路由,main里面是使用我们这里配置好的
//因此需要在这里就使用插件VueRouter
import about from '../views/about'
import home from '../views/home'
import news from '../views/news'
import massage from '../views/massage'
import massageDetail from '../views/massageDetail'
//上面是引入路由对应的路由组件
Vue.use(VueRouter)
export default new VueRouter({
  //不同的路由对应着不同路由组件,现在依旧是单页面开发
  routes: [
    {
      path: '/about',
      component: about
    },
    {
      path: '/home',
      component: home,
      children: [
        {
          path: 'news',
          component: news
        },
        {
          path: 'massage',
          component: massage,
          children: [
            {
              path: 'massageDetail/:id',
              component: massageDetail
            }
          ]
        },
        {
          path: '',
          redirect: 'news'
        }
      ]
    },
    //这里需要一个一开始就默认的路由组件
    //这里将默认的重定向为home对应的组件
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
//路由器配置好了,可以在main里面使用这个路由器了
