<template>
  <div>
    <div class="row">
      <div class="col-xs-offset-2 col-xs-8">
        <div class="page-header"><h2>Router Basic - 01</h2></div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-2 col-xs-offset-2">
        <div class="list-group">
          <!--          这里定义router-link标签就表示该标签点击后会访问to对应的路由,-->
          <router-link to="/about" class="list-group-item">about</router-link>
          <router-link to="/home" class="list-group-item">home</router-link>
        </div>
      </div>
      <div class="col-xs-6">
        <div class="panel">
          <div class="panel-body">
            <!--            路由的视图会在这里生成-->
            <!--            keep-alive可以使得路由之间切换的时候上一个路由的数据不会死亡,会被暂存下来-->
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    test() {
      console.log(11)
    }
  }
}
</script>

<style scoped>
/*路由组件在当前对应的路由时,会有一个router-link-active的class,否则就移除,可以抓住这个class对其设置样式*/
.router-link-active {
  color: red;
}
</style>
