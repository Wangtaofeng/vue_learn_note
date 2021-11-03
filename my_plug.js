//插件一般定义为匿名函数并且向外暴露某个属性,因为是匿名函数,因此访问不到函数体内部
//这里调用时候将window传进去方便将某个属性暴露为window的属性
// 好吧现在还不理解是干嘛的 插个眼
(function (window) {
    //先声明一个向外暴露的对象
    const My_plug={}
    //固定格式,给这个对象添加一个install属性,该属性是一个函数,函数需要将(Vue,options)作为参数
    My_plug.install=function (Vue,option) {
        //将Vue作为参数传进来之后,这个Vue就表示Vue的构造函数
        //可以直接向Vue构造函数里添加全局方法
        Vue.test_f=()=>{
            console.log("这是构造函数的全局方法");
        }
        Vue.directive("my-test",(el,binding)=>{
            el.textContent="这是自定义指令"
        })
        //也可以像原型对象里添加方法,这样vm就可以使用
        Vue.prototype.$test_fff=()=>{
            console.log('这是原型对象的方法');
        }
    }
    //将这个对象暴露为window的属性
    window.My_plug=My_plug

})(window)