<template>
  <div>
    <h2>home</h2>
    <div>
      <ul class="nav nav-tabs">
        <router-link to="/home/news"> News</router-link>
        <router-link to="/home/massage">Message</router-link>
      </ul>
      <div style="margin-top: 10px">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home"
}
</script>

<style scoped>
</style>
