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
    Object.keys(me._data).forEach(key => {
        me._proxy(key)
    })
    // 对data中的所有数据进行劫持监视
    observe(data, this)
    //进行模板解析,这里需要创建一个模板解析的对象,而不是直接调用这个方法,compile是个对象,就象创建vm一样的new一个对象出来
    this.$compile = new Compile(option.el || document.body, this)


}

Mvvm.prototype._proxy = function (key) {
    let me = this
    //给vm对象定义key属性,这个属性名是上面传过来的动态属性名,即data里面的属性
    Object.defineProperty(me, key, {
        configurable: false,
        enumerable: true,
        //给定义的key属性绑定get,set方法,使得读取vm.key时,返回的是vm._data[key]
        get() {
            //这里必须使用[key]的方式来获取到指定的属性,因为这个属性名是个变量,不能直接打点调用
            return me._data[key]
        },
        //同上,这里是写,当写vm.key = ..时 ,实际上写的是vm._data[key]
        set(value) {
            me._data[key] = value
        }
    })
}

// Observe: 在初始化得到属性时创建observe对象,对数据劫持以及get中绑定对应的watcher
function Observer(data) {
    // 保存传递过来的data对象(要监视属性的对象)
    this.data = data
    this.walk(data)

}

Observer.prototype = {
    walk(data) {
        // 保存this
        let me = this
        // 遍历传递过来的data对象的每一个属性,因为监视是设计到所有属性的变化
        // 之所以除了传递属性名还传属性值是由于属性值可能也是个对象
        Object.keys(data).forEach(key => me.convert(key, data[key]))
    },
    convert(key, val) {
        // 对每个属性实现数据绑定,
        // this.data表示是哪个对象下的key, 后面的数据劫持需要, val用于判断是否还是对象
        this.defineReactive(this.data, key, val)
    },
    defineReactive(data, key, val) {
        // 创建一个依赖关系的对象,这个对象相当于一个容器,将这里observe的监视的属性和watcher关联起来
        // 一旦这里监视的属性发生改变,那么就通知所有watcher发生了改变,watcher实际上是每个属性相关的表达式对应的对象
        // 它直接与页面相关联, 监视的属性发生改变时, 就同时使用这个属性的所有表达式,以便更新页面
        let dependency = new Dependency()
        // 如果val还是一个对象,那么就继续创建对应的observe
        observe(val)
        // 给现在监视的对象下的属性进行监视(get方法用于绑定watcher,set方法用于数据劫持,如果数据变化就通知所有绑定的watcher)
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get() {
                // 这里用Dependency.target判断是是否是watcher读取的data,否则就直接返回val
                // 并且Dependency.target保存的就是当前读取属性的watcher
                if (Dependency.target) {
                    // 当页面中表达式读取被监视的属性值时,就会建立正在读取这个属性的watcher的关系
                    dependency.buildDepend()
                }
                // get就是得到val, 那就返回val
                return val
            },
            // 监视属性值改变,一旦改变,就根据依赖对象通知到所有的watcher,它接收到通知后,就会更新页面
            set(newVal) {
                // 如果没变化就不作为
                if (newVal === val) {
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
function observe(data, vm) {
    // 监视的是一个对象的属性,如果不是对象的话,那么就没法监视,直接返回
    if (!data || typeof data !== 'object') {
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
    addSub(sub) {
        // 上面通知watcher之后,会调用这里的方法,用于把watcher添加到依赖对象的subs里
        this.subs.push(sub)
    },
    notice() {
        // 通知所有watcher即调用所有watcher的更新方法
        this.subs.forEach(watcher => watcher.update())
    }
}
// 先设置为null 避免不是模板解析时的表达式读取建立关系
Dependency.target = null

// Compile: 创建虚拟DOM来进行页面的初始化显示,绑定事件指令,表达式则去取值渲染到页面并给表达式创建watcher添加到对应的属性的dependency中
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
        node.addEventListener('input', (e) => {
            let newVal = e.target.value
            if (newVal === oldVal) {
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
        new Watcher(vm, exp, val => {
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
            if (index < exp.length - 1) {
                obj = obj[key]
            } else {
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

// Watcher: 数据绑定的具体实现,每一个用到vm里属性的dom元素都会被创建一个watcher,当属性值改变时,通过通知watcher完成对应的页面更新
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
        exp.forEach(k => val = val[k])
        return val
    }
}






















