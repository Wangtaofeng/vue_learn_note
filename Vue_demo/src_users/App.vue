<template>
  <div class="container">
   <Search/>
    <UserMain/>
  </div>
</template>

<script>
import Search from './components/Search'
import UserMain from "./components/UserMain"
export default {
name: "App",
  components:{
    Search,
    UserMain
  }
}
</script>

<style scoped>

</style>
