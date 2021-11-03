function Observer(data) {
    // 保存传递过来的data对象(要监视属性的对象)
    this.data = data
    this.walk(data)

}
Observer.prototype = {
    walk(data){
        // 保存this
        let me = this
        // 遍历传递过来的data对象的每一个属性,因为监视是设计到所有属性的变化
        // 之所以除了传递属性名还传属性值是由于属性值可能也是个对象
        Object.keys(data).forEach(key => me.convert(key, data[key]))
    },
    convert(key, val){
      // 对每个属性实现数据绑定,
        // this.data表示是哪个对象下的key, 后面的数据劫持需要, val用于判断是否还是对象
      this.defineReactive(this.data, key, val)
    },
    defineReactive(data, key, val){
        // 创建一个依赖关系的对象,这个对象相当于一个容器,将这里observe的监视的属性和watcher关联起来
        // 一旦这里监视的属性发生改变,那么就通知所有watcher发生了改变,watcher实际上是每个属性相关的表达式对应的对象
        // 它直接与页面相关联, 监视的属性发生改变时, 就同时使用这个属性的所有表达式,以便更新页面
        let dependency = new Dependency()
        // 如果val还是一个对象,那么就继续创建对应的observe
        observe(val)
        // 给现在监视的对象下的属性进行监视(get方法用于绑定watcher,set方法用于数据劫持,如果数据变化就通知所有绑定的watcher)
        Object.defineProperty(data, key,{
            enumerable: true,
            configurable: false,
            get: function (){
                // 这里用Dependency.target判断是是否是watcher读取的data,否则就直接返回val
                // 并且Dependency.target保存的就是当前读取属性的watcher
                if(Dependency.target){
                    // 当页面中表达式读取被监视的属性值时,就会建立正在读取这个属性的watcher的关系
                    dependency.buildDepend()
                }
                // get就是得到val, 那就返回val
                return val
            },
            // 监视属性值改变,一旦改变,就根据依赖对象通知到所有的watcher,它接收到通知后,就会更新页面
            set: function(newVal){
                // 如果没变化就不作为
                if(newVal === val){
                    return
                }
                val = newVal
                // 监视新的值,防止新的值还是对象
                observe(newVal)
                // 由于初始化页面时所有的表达式需要建立起关系的就已经建立好了
                // 就直接调用notice方法通知所有watcher该更新了
                dependency.notice()
            }
        })
    }
}

// 创建给属性创建observe对象并监视的入口
function observe(data, vm){
    // 监视的是一个对象的属性,如果不是对象的话,那么就没法监视,直接返回
    if(!data || typeof data !== 'object'){
        return
    }
    return new Observer(data)
}

// 依赖对象的构造函数
// 使用一个变量, 识别每一个不同的依赖对象
// 由于这个模块只会执行一次,也就是说一个组件里只有一个uid, 可以保证唯一性
let uid = 0
function Dependency() {
    // 一个依赖对象的唯一标识
    this.id = uid++
    // 用于存放watcher的数组
    this.subs = []
}
Dependency.prototype = {
    buildDepend() {
        // 这里去通知watcher建立关系
        Dependency.target.addDependency(this)
    },
    addSub(sub){
        // 上面通知watcher之后,会调用这里的方法,用于把watcher添加到依赖对象的subs里
        this.subs.push(sub)
    },
    notice(){
        // 通知所有watcher即调用所有watcher的更新方法
        this.subs.forEach(watcher => watcher.update())
    }
}
// 先设置为null 避免不是模板解析时的表达式读取建立关系
Dependency.target = null

























