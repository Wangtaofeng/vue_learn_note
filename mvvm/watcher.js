// watcher订阅者的构造函数,vm用于寻找到data中的值, exp是表达式, cb是回调函数, 找到值后会用于更新
function Watcher(vm, exp, cb) {
    this.cb = cb
    this.vm = vm
    this.exp = exp
    // 这里是用来存放依赖对象的
    this.depIds = {}
    // 注意这里的get
    // 实际上, 依赖对象是一开始就建立好的
    // 在那里的给每个属性的get里会进行和读取这个属性的表达式的watcher进行绑定
    // 那么在这里一旦建立一个watcher就会读取一次对应的表达式的值.一旦读取,那么就建立起了监视属性和watcher的依赖关系
    this.value = this.get()
}

Watcher.prototype = {
    // 用于更新的方法
    update() {
        // 去得到新的值
        // 这个时候就已经建立起了关系了,由于下面的if语句的判断,并不会导致再次建立
        let newVal = this.get()
        let oldVal = this.value
        if (newVal !== oldVal) {
            // 保存新的值
            this.value = newVal
            // 调用回调函数更新页面

            // 给回调函数传参数,为新的值
            this.cb.call(this.vm, newVal)
        }
    },
    // 该方法用于真正建立起当前的watcher与监视的key的关系
    // 在这里定义时因为observe先创建的, 而watcher后建立的
    // 这个方法最终会在observe里调用,watcher读取key时,就会在这里建立起
    addDependency(dep) {
        // 避免重复建立依赖关系
        if (!this.depIds.hasOwnProperty(dep.id)) {
            // 把自己放在依赖对象的sub里面
            dep.addSub(this)
            // 所有和watcher建立起关系的依赖对象都会保存起来
            this.depIds[dep.id] = dep.id
        }
    },
    get() {
        // 保存target用于前面的Dependency判断, 表示这里只是用于创建了watcher的表达式读取data时才会建立起依赖对象
        Dependency.target = this
        let val = this.getVMVal()
        // 读取完需要立即将这个类的原型属性清空
        // 否则的话一直存在,那么其他不是watcher读取时也会创建依赖对象
        Dependency.target = null
        // 返回得到的val
        return val

    },
    getVMVal() {
        // 这里是保存了一个用. 切割的数组,因为表达式不一定是a 可能是a.b.c
        let exp = this.exp.split('.')
        // 保存data, 用于取值,可以取值到最深层
        let val = this.vm._data
        // 如果有多层的话,就一直将新的一层赋值给val
        exp.forEach( k=> val = val[k])
        return val
    }
}