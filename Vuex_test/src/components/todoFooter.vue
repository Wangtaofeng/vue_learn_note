<template>
  <div class="todo-footer">
    <label>
      <input type="checkbox" v-model="isAllSec"/>
    </label>
    <span>
          <span>已完成{{ alreadyCount }}</span> / 全部{{ allCount }}
        </span>
    <button class="btn btn-danger" @click="delete_select">清除已完成任务</button>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'todoFooter',
  data() {
    return {}
  },
  methods: {
    delete_select() {
      if (confirm('确认删除选中吗')) {
        this.$store.dispatch('deleteSelect')
      }
    }
  },

  computed: {
    ...mapGetters(['allCount', 'alreadyCount']),
    //这种set和get计算属性的,需要vuex里不同的方法,并且在这里只能通过get和set调用这些方法
    isAllSec: {
      get() {
        return this.$store.getters.orNot
      },

      set(value) {
        this.$store.dispatch('isAllSec', value)
      }
    }
  }
}
</script>

<style scoped>
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
}

.todo-footer label {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}

.todo-footer label input {
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
}

.todo-footer button {
  float: right;
  margin-top: 5px;
}
</style>
