<template>
  <el-button type="primary" plain @click="notice">主要按钮</el-button>
</template>

<script>
export default {
  methods: {
    notice() {
      this.$message({
        showClose: true,
        message: "恭喜你，这是一条成功消息",
        type: "success",
      })
    },
  },
};
</script>

<style>
</style>