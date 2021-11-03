<template>
  <div class="waterfall wf-wrap" ref="waterfall" @scroll="onScroll">
    <ul>
      <transition-group name="list" tag="li">
        <li
          v-for="(item, index) in waterfallList"
          :key="index"
          class="wf-item"
          :style="{
            top: item.top + 'px',
            left: item.left + 'px',
            width: item.width + 'px',
            height: item.height + 'px',
          }"
        >
          <img :src="item.src" />
        </li>
      </transition-group>
    </ul>
  </div>
</template>
<script>
import { getList } from "@/api/demo"

export default {
  name: "Waterfall",
  data () {
    return {
      // 放图片的列表
      waterfallList: [],
      // 列数
      waterfallCol: 5,
      // 定宽
      colWidth: 236,
      // 间距
      marginRight: 10,
      marginBottom: 10,
      // 高度列表
      colHeights: [],
      // 请求参数
      // listQuery: {
      //   page: 1,
      //   limit: 5,
      //   sort: "+id"
      // },
      // 是否加载
      loading: false,
      // 测试用数据, 用于计算该发送多少
      apiIndex: 1
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 初始化时，每栏高度都为0
      // 创建几列
      this.colHeights = new Array(this.waterfallCol)
      for (let i = 0; i < this.colHeights.length; i++) {
        // 初始化高度数组为0
        this.colHeights[i] = 0
      }
      // 计算列宽, 计算方法: (容器宽度 - 几个边距) / 列数
      this.colWidth =
        (this.$refs.waterfall.clientWidth -
          (this.waterfallCol - 1) * this.marginRight) /
        this.waterfallCol

      // 去执行方法了
      this.loadImgs(this.apiIndex)
    },

    // 加载图片对象, 只是图片对象, 还不是dom
    loadImgs (index) {
      this.loading = true
      // 从api获取数据
      getList(index).then(res => {
        // 返回的图片数组
        let images = res
        // n个promise
        let promiseAll = [],
          // 存放图片对象的数组
          imgs = [],
          // 图片总数, 用于下面遍历
          total = images.length
          this.apiIndex = images.length + 1

        for (let i = 0; i < total; i++) {
          promiseAll[i] = new Promise(resolve => {
            // 图片对象
            imgs[i] = new Image()
            imgs[i].src = images[i].image_uri
            // 图片加载完成, 此时图片的宽高已经有值了
            imgs[i].onload = () => {
              // 存放图片数据
              let imgData = {}
              // 高度按照宽度变化的比例进行计算, 不计算的话, 获取不到正确的高度, 只能获取到原始的高度
              // 虽然高度是随着宽度正常变化的, 但是我们拿不到变化后的值, 因为没法监听随着宽度自动计算完后的值
              // 因此这里按照比例来计算高度 old高 / old宽 === new高 / new宽  ===>> new高 = (old高 * new宽) / old宽
              imgData.height = (imgs[i].height * this.colWidth) / imgs[i].width
              imgData.width = this.colWidth
              imgData.src = images[i].image_uri
              // 随后集成宽, 高, src等信息的对象放在带渲染的列表中
              this.waterfallList.push(imgData)
              // 调用该方法, 计算偏移量, 同样封装到这个对象中
              this.rankImgs(imgData)
              // 返回成功回调
              resolve(imgs[i])
            }
          })
        }
        // 执行所有promise, 调用加载的函数
        Promise.all(promiseAll).then(() => {
          this.loading = false
          this.loadMore()
        })
      })
    },

    // 计算最小高度, 并调用rankImgs开始让图片到指定位置
    loadMore () {
      if (
        // 如果可视高度 + 滚动距离顶端的距离 (即全部高度) 已经大于了最小的高度
        // 即说明最小的高度已经到了可视区域, 需要再次加载图片, 继续执行
        this.$refs.waterfall.clientHeight + this.$refs.waterfall.scrollTop >
        this.filterMin().minHeight && this.loading == false  // 这里放置一个loading是为了预防一直重复请求的情况
        // 只有上一次请求结束了, 这里才会继续触发
      ) {
        this.loading = true
        setTimeout(() => {
          this.loadImgs(this.apiIndex)
        }, 200)
      }
    },

    // 图片偏移的计算, 这些偏移量都保存在了imgData这个对象中, 页面会直接找到这个对象中的数据进行渲染
    // 尽量不要在vue的js代码中操作style以及获取元素的属性(尤其是随时更新的元素)
    // 会有各种意想不到的结果, vue挂载不是一次性挂载完成的, 在nextTick中执行代码, 虽然说dom已经挂载, 但是很多时候获取元素的属性还是会出问题
    // 这里将宽, 高, 以及利用宽高等计算的偏移量全都保存为变量, 封装在data的属性中, dom渲染直接拿数据就行
    // 切记避开利用dom的属性来计算值, 随后再渲染到dom上(传统js写法)
    rankImgs (imgData) {
      // 得到最小高度以及对应的索引
      let min = this.filterMin()
      // 偏移量计算
      imgData.top = min.minHeight
      imgData.left = min.minIndex * (this.colWidth + this.marginRight)
      // 更新高度数组
      this.colHeights[min.minIndex] += imgData.height + this.marginBottom
    },

    // 返回最小高度
    filterMin () {
      // 返回数组中的最小值
      let minHeight = Math.min.apply(null, this.colHeights)
      // 返回一个对象
      return {
        minHeight: minHeight,
        minIndex: this.colHeights.indexOf(minHeight)
      }
    },

    // 监听滚动
    onScroll () {
      this.loadMore()
    }
  }
}
</script>

<style lang="scss" scoped>
ul li {
  list-style: none;
}

.wf-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
}
.wf-item {
  position: absolute;
}
.wf-item img {
  width: 100%;
  height: 100%;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>

