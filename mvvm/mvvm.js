function Mvvm(option) {
    //option就是创建vm实例时里面传来的实参
    // 这里将option保存到vm的属性中
    this.$option = option
    // 这里在_data里面保存实参里的data
    this._data = this.$option.data
    let data = this.$option.data
    //保存this,可能后面会用到
    let me = this
    //这里获取data里的每一个属性名并用下面的函数操作它
    Object.keys(me._data).forEach(key =>{
        me._proxy(key)
    })
    // 对data中的所有数据进行劫持监视
    observe(data, this)
    //进行模板解析,这里需要创建一个模板解析的对象,而不是直接调用这个方法,compile是个对象,就象创建vm一样的new一个对象出来
    this.$compile =new Compile(option.el || document.body,this)


}
Mvvm.prototype._proxy = function (key) {
    let me = this
    //给vm对象定义key属性,这个属性名是上面传过来的动态属性名,即data里面的属性
    Object.defineProperty(me,key,{
        configurable: false,
        enumerable: true,
        //给定义的key属性绑定get,set方法,使得读取vm.key时,返回的是vm._data[key]
        get () {
            //这里必须使用[key]的方式来获取到指定的属性,因为这个属性名是个变量,不能直接打点调用
            return me._data[key]
        },
        //同上,这里是写,当写vm.key = ..时 ,实际上写的是vm._data[key]
        set(value){
            me._data[key] = value
        }
    })
}