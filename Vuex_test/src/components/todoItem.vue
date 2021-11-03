<template>
  <li @mouseenter="showBtn(true)" @mouseleave="showBtn(false)" :style="{backgroundColor:bg}">
    <label>
      <input type="checkbox" v-model="todo.status"/>
      <span>{{ todo.content }}</span>
    </label>
    <button class="btn btn-danger" v-show="isShow" @click="delOne">删除</button>
  </li>
</template>

<script>
export default {
  props: {todo: Object, index: Number},
  name: 'todoItem',
  data() {
    return {
      bg: 'white',
      isShow: false
    }
  },
  methods: {
    showBtn(flag) {
      if (flag) {
        this.bg = 'grey'
        this.isShow = !this.isShow
      } else {
        this.bg = 'white'
        this.isShow = !this.isShow
      }
    },
    delOne() {
      if (confirm(`确认删除${this.todo.content}吗`)) {
        this.$store.dispatch('deleteTodo',this.index)
      }
    }
  }
}
</script>

<style scoped>
li {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}

li label {
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}

li button {
  float: right;
  margin-top: 3px;
}

li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}
</style>
