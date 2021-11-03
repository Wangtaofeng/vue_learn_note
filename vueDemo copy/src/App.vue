<template>
  <div class="waterfall wf-wrap" ref="waterfall">
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
          <p
            style="
              height: 48px;
              line-height: 48px;
              font-size: 16px;
              background-color: red;
            "
          >
            {{ item.tittle }}
          </p>
        </li>
      </transition-group>
    </ul>
  </div>
</template>
<script>
import getList from "@/api/demo"

export default {
  name: "Waterfall",
  data () {
    return {
      // 放图片的列表
      waterfallList: [],
      // 列数
      waterfallCol: 3,
      // 定宽
      // colWidth: 236,
      // 间距
      marginRight: 10,
      marginBottom: 10,
      // 高度列表
      colHeights: [],
      // 是否加载
      // loading: false,
      // 测试用数据, 用于模拟后端该返回多少数据
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
      // 模拟从api获取数据
      getList(index).then(res => {
        // 返回的图片数组
        let images = res
        // n个promise
        let promiseAll = [],
          // 存放图片对象的数组
          imgs = [],
          // 图片总数, 用于下面遍历
          total = images.length
        // 请求图片数量
        this.apiIndex = images.length + 1

        for (let i = index - 1; i < total; i++) {
          promiseAll[i] = new Promise(resolve => {
            // 图片对象
            imgs[i] = new Image()
            console.log(total)
            imgs[i].src = images[i].image_url
            // 图片加载完成, 此时图片的宽高已经有值了
            imgs[i].onload = () => {
              // 存放图片数据
              let imgData = {}
              // 高度按照宽度变化的比例进行计算, 不计算的话, 获取不到正确的高度, 只能获取到原始的高度
              // 虽然高度是随着宽度正常变化的, 但是我们拿不到变化后的值, 因为没法监听随着宽度自动计算完后的值
              // 因此这里按照比例来计算高度 old高 / old宽 === new高 / new宽  ===>> new高 = (old高 * new宽) / old宽
              imgData.height = ((imgs[i].height * this.colWidth) / imgs[i].width) + 48
              imgData.width = this.colWidth
              imgData.src = images[i].image_url
              imgData.tittle = images[i].tittle
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
          this.observe()
        })
      })
      // }
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
    observe () {
      let imgs = document.getElementsByClassName('wf-item')
      // 观察最后一行的第一个被渲染的元素, 不管它所在的高度如何, 它在最后一行第一个被渲染
      // 那么它渲染之前所在的列是最低高度, 那么它就会是最后一行第一个出现在可视区的
      // 那么就可以观察它的出现, 这是就可以进行请求了
      // 上面的情况是刚好渲染够每一列, 如果最后一行没有渲染满, 就不能这样计算了
      // 那么就将多的那一列去掉, 再计算
      // let index = this.waterfallList.length - this.waterfallCol + 1
      let index = this.waterfallList.length - (this.waterfallList.length % this.waterfallCol) - this.waterfallCol + 1
      // 创建一个观察者对象, 这个对象会在观察物出现和离开可视区执行构造函数中的回调函数
      // 回调函数中两个参数, 一个是被观察对象触发时的各种数据, 一个是观察者实例对象
      const obser = new IntersectionObserver((config, observe) => {
        // 这里面是触发后的回调函数
        // config[0].intersectionRatio属性记录了元素的在可视区的比例
        // 最开始会执行一次, 因为比例是0, 当出现在可视区后, 它的比例 > 0, 具体要看一次滑动出现了多少
        // 懒加载这样的思路是, 被观察的元素(第一次加载渲染到页面上的最后一行的最高位置的元素出现在可视区, 说明下面一行没了, 且即将出现空白)
        // 就可以进行请求了, 同时移除这个观察者, 观察新的一批
        // console.log('触发了', config)
        if (config[0].intersectionRatio > 0 && document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && this.waterfallList.length >= 15) {
          // unobserve()停止观察某个对象
          observe.unobserve(imgs[index])
          //disconnect停止观察, 观察者失效
          // observe.disconnect(imgs[index])
          // 重新执行load方法, 且这个观察方法也是在那里调用的, 会增加新的观察对象
          this.loadImgs(this.apiIndex)
        }
      })
      // 观察一个dom(也可以多个)
      // obser.observe(imgs[0], imgs[0])
      obser.observe(imgs[index])
    }
  }
}
</script>

<style scoped>
ul li {
  list-style: none;
}

.wf-wrap {
  position: relative;
  width: 60%;
  margin: 0 auto;
}
.wf-item {
  position: absolute;
  height: 100%;
}
.wf-item img {
  width: 100%;
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

