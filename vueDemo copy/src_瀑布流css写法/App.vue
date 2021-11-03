<template>
  <div class="cointer">
    <div class="item" v-for="(li, index) in list" :key="index">
      <img :src="li" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.List()
  },
  methods: {
    List () {
      let list = []
      for (let i = 1; i <= 41; i++) {
        list.push(`/static/img/${i}.png`)
        this.list = list
      }
    }
  }
}
</script>

<style>
.cointer {
  width: 800px;
  height: auto;
  columns: 5;
  column-gap: 10px;
  row-gap: 10px;
  margin: 0 auto;
}
.item img {
  width: 100%;
}
</style>