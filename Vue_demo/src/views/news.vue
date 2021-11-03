<template>
  <ul>
    <li v-for="(new_one,index) in news" :key="index">{{new_one}}</li>
  </ul>
</template>

<script>
export default {
name: "news",
  data(){
    return{
      news: ["massage1","massage2","massage3"]
    }
  }
}
</script>

<style scoped>

</style>
