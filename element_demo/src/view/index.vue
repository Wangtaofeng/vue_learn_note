<template>
  <div>
    <first />
    <el-button @click="open1">消息</el-button>
  </div>
</template>

<script>
import first from "../components/first.vue";
export default {
  components: {
    first,
  },
  methods: {
    open1() {
      this.$loading.service({
        text: "加载中……",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
  },
};
</script>

<style>
</style>