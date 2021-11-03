function Compile(el, vm) {
    //保存vm
    this.$vm = vm
    //保存el
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    //如果el元素存在
    if (this.$el) {
        //取出el的所有子节点放到虚拟内存中
        this.$fragment = this.node2Fragment(this.$el)
        // 编译fragment中的所有子节点
        this.init()
        //编译完成后初始化显示
        this.$el.appendChild(this.$fragment)

    }

}

Compile.prototype = {
    //创建虚拟节点并将传来的el子节点都放进去
    node2Fragment(el) {
        let fragment = document.createDocumentFragment()
        let child = null
        while (child = el.firstChild) {
            //编译所有层次的子节点,添加到fragment中
            fragment.appendChild(child)
        }
        return fragment
    },
    init() {
        this.compileElement(this.$fragment)
    },
    //这个方法最终会编译处理el的所有层次的子节点,因为里面会递归调用
    compileElement(el) {
        //得到所有子节点
        let chileNodes = el.childNodes,
            //保存vm对象
            me = this
        Array.prototype.slice.call(chileNodes).forEach(node => {
            //保存节点的文本值,如果是文本节点的话,可以用来正则匹配
            let contentText = node.textContent
            //用于匹配{{}}的正则表达式,()里表示匹配到{{}}里的内容并保存起来
            let reg = /\{\{(.*)\}\}/
            //如果是元素节点,需要编译,解析元素节点里面的指令
            if (me.isElementNode(node)) {
                //如果是元素节点,就给元素节点里面的属性(是指令的情况下)绑定
                me.compile(node)
                //如果是文本节点,并且是大括号表达式,就需要处理表达式里的值渲染到fragment里
            } else if (me.isTextNode(node) && reg.test(contentText)) {
                //这里的$1就是刚刚正则匹配到()里保存的值,也就是{{}}里的内容
                //这个方法的最终结果就是,如果是{{}}的文本节点,就把文本节点替换为找到的值
                me.compileText(node, RegExp.$1)
            }
            //如果node还有子节点,继续递归调用方法
            if (node.childNodes) {
                me.compileElement(node)
            }

        })

    },
    //解析指令
    compile(node) {
        //这个方法是解析传来的节点的所有属性,如果是指令的话,就得到它的指令名和指令值,随后调用绑定指令的方法给绑定
        let attrs = node.attributes,
            me = this
        Array.prototype.slice.call(attrs).forEach(attr => {
            //得到属性名
            let name = attr.name // v-on:click
            //需要判断属性名是否是指令
            if (me.isDirective(name)) {
                //attr v-on:click='show'
                //name v-on:click
                //value show
                //得到指令名
                let dir = name.substring(2)// on:click
                //得到属性值
                let exp = attr.value
                //判断是事件指令还是其他指令
                //如果是事件指令
                if (me.isEventDirective(dir)) {
                    //如果是事件指令,就把指令名和指令值传入另一个方法中,由那个方法判断并完成绑定
                    //dir:指令名, exp: 属性值
                    //vm传进去是需要绑定到vm的methods的函数
                    compileUtil.eventHandler(node, dir, exp, me.$vm)
                }
                //如果是普通指令,判断这个指令是否存在后才能去处理
                else {
                    compileUtil[dir] && compileUtil[dir](node, this.$vm, exp)
                }

                //解析完了即处理完了事件指令之后,这个时候元素已经绑定上了对应的事件,因此可以将元素里的v-属性删除了
                //只需要传属性名就行
                node.removeAttribute(name)
            }

        })
    },
    compileText(node, exp) {
        //寻找{{}}里面的name对应vm._data里的值的逻辑
        compileUtil.text(node, this.$vm, exp)
    },
    isElementNode(el) {
        return el.nodeType === 1
    },
    isTextNode(el) {
        return el.nodeType === 3
    },
    //是否为指令属性
    isDirective(name) {
        return name.indexOf('v-') === 0
    },
    //判断是否是事件指令
    isEventDirective(name) {
        return name.indexOf('on') === 0
    }

}
//指令处理集合
let compileUtil = {
    //解析v-text || {{}}
    text(node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },
    //解析v-html
    html(node, vm, exp) {
        this.bind(node, vm, exp, 'html')
    },
    //解析v-class
    class(node, vm, exp) {
        this.bind(node, vm, exp, 'class')
    },
    model(node, vm, exp) {
        // 初始化显示
        this.bind(node, vm, exp, 'model')
        // 初始化显示完只是m-v单项数据绑定
        // 双向数据绑定的话就需要在这里对input进行监听
        let oldVal = this._getVMVal(vm, exp)
        // 给input绑定监听,一旦输入框里的数据发生改变,就会去给data里对应的属性重新赋值
        // 一旦重新赋值,就会被observe里给属性定义的set劫持,就会通知到所有的watcher
        // 在上面的bind初始化显示的时候,就已经给这个input生成了一个watcher
        node.addEventListener('input', (e) =>{
            let newVal = e.target.value
            if(newVal === oldVal){
                return
            }
            this._setVMVal(vm, exp, newVal)
        })

    },
    //绑定指令
    eventHandler(node, dir, exp, vm) {
        //node元素是不可少的,绑定事件监听就是给node元素绑定的
        let eventFn = dir.split(':')[1],
            fn = vm.$option.methods && vm.$option.methods[exp]
        if (eventFn && fn) {
            //这里不能直接传fn函数,因为fn函数里面可能会有读取this(vm)的操作,如果直接传的话,这里的this不出意外就是Window了,因为绑定在了dom元素里面
            //使用bind函数可以强制绑定this为某个对象
            node.addEventListener(eventFn, fn.bind(vm))
        }
    },
    //解析指令的方法,实现初始化显示
    bind(node, vm, exp, dir) {
        let updateFn = updater[dir + 'Updater']
        //如果这个指令存在,这则用来更新节点
        updateFn && updateFn(node, this._getVMVal(vm, exp))
        // 在解析模板时,如果有用到data中数据的时候,就会在这里建立起对应的watcher
        // 这里已经用到了,因为这里解析的就是模板中的表达式
        // 这里的val就是watcher中改变后传递过来的值
        new Watcher(vm, exp, val =>{
            updateFn && updateFn(node, val)
        })

    },
    // 初始化页面显示时得到vm里面对应的值
    _getVMVal(vm, exp) {
        let val = vm._data
        //这里可能是寻找vm.a.b.c,因此需要对vm进行遍历,直到找到最深处的值
        exp = exp.split('.')
        exp.forEach(key => {
            val = val[key]
        })
        return val
    },
    // 双向数据绑定时调用的方法去改变vm里data的值
    // 一旦data里的值发生了改变,那么必然就会根据dependency通知相关的watcher
    // 因此与这个属性相关的所有watcher都会update
    // 这样就实现了双向数据绑定
    _setVMVal(vm, exp, newVal) {
        // 同样的,这里是遍历得到最底层的属性值,即a.b.c这样
        exp = exp.split('.')
        // 用于保存找到包含要改变的属性的对象
        let obj = vm._data
        exp.forEach((key, index) => {
            // 这里需要判断以找到最底层的对象,是对象,不是值,通过对象.属性即可赋值
            // 给这个属性重新赋值
            // 如果还没到最底层,就把当前值(实际上也是一个对象)赋值
            if(index < exp.length-1) {
                obj = obj[key]
            }else{
                // 这个时候的name就是最底层的属性名了, 那么就直接赋值即可
                obj[key] = newVal
            }
        })
    }
}
//用于更新节点信息
let updater = {
    textUpdater(node, value) {
        //上面找到了值,这里更新fragment对应节点的值
        //节点的文本内容等于传来的值,如果为空这处理一下
        node.textContent = typeof value === 'undefined' ? '' : value
    },
    htmlUpdater(node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value
    },
    classUpdater(node, value) {
        let className = node.className
        //这里需要判断原来的node里面有没有设置class\
        node.className = (className ? (className + ' ') : '') + value
    },
    modelUpdater(node, value) {
        // 用于更新双向数据绑定的input
        node.value = typeof value === 'undefined' ? '' : value
    }
}