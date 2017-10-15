'use strict';

(function (window, document) {

    // for debug
    const log = console.log.bind(console)

    // cache
    const w = window,
          d = document

    /**
     * hQuery构造函数，可以直接h()调用
     * @class
     * @param {String|DOM} selector - querySelectAll的选择器
     * @param {DOM=} [context = document] - 选择器的根节点
     * @return {hQuery} - hQuery对象
     */
    function hQuery(selector, context) {
        return new hQuery.prototype.init(selector, context)
    }

    hQuery.prototype = {
        constructor: hQuery,
        length: 0,
        prevObject: null,

        init: function (selector, context) {
            if (!selector) {
                return this
            }

            if (selector.constructor === hQuery) {
                return selector
            }

            // HANDLE: h(DOMElement)
            if (selector.nodeType) {
                this[0] = selector
                this.length = 1
                return this
            }

            context = context || d
            let nodes = context.querySelectorAll(selector)

            Object.assign(this, nodes)
            this.length = nodes.length
        }
    }

    hQuery.prototype.init.prototype = hQuery.prototype

    // 将hQuery挂载在window对象上
    w.hQuery = hQuery

    // selector methods

    /**
     * 以当前对象的第一个节点为根节点，返回符合选择器的子节点
     * @param {string} selector - 选择器
     * @return {hQuery} - 全新的hQuey对象
     */
    hQuery.prototype.find = function (selector) {
        let ret = new hQuery(selector, this[0])
        ret.prevObject = this
        return ret
    }

    /**
     * 返回hQuery对象中的第一个节点
     * @return {hQuery} - 全新的hQuey对象
     */
    hQuery.prototype.first = function () {
        return this.eq(0)
    }

    /**
     * 返回hQuery对象中的最后一个节点
     * @return {hQuery} - 全新的hQuery对象
     */
    hQuery.prototype.last = function () {
        return this.eq(-1)
    }

    /**
     * 返回hQuery对象中的第n个节点
     * @param {number} num - 从0开始指定第num个节点，可接受负数
     * @return {hQuery} - 全新的hQuery对象
     */
    hQuery.prototype.eq = function (num) {
        num = num < 0 ? this.length - num : num
        let ret = new hQuery(this[num])
        ret.prevObject = this
        return ret
    }

    /**
     * 返回hQuery对象中每一个节点的父节点集合
     * @return {hQuery} - 全新的hQuery对象
     */ 
    hQuery.prototype.parent = function () {
        let ret = new hQuery()
        for (let i = 0; i <  this.length; i++) {
            ret[i] = this[i].parentNode
        }
        ret.prevObject = this
        return ret
    }

    /**
     * 返回hQuery对象中第一个节点的直接子节点
     * @param {number=} - 指定第几个子节点
     * @return {hQuery} - 全新的hQuery对象
     */     
    hQuery.prototype.children = function (num) {
        let ret;
        let children = this[0].children
        if (num !== undefined) {
            num = num < 0 ? children.length - num : num
            ret = new hQuery(children[num])
        } else {
            ret = new hQuery()
            for (let i = 0; i < children.length; i++) {
                ret[i] = children[i]
            }
            ret.length = children.length
        }
        ret.prevObject = this
        return ret
    }
    
    /**
     * 返回hQuery对象中所有节点的下一个兄弟节点的集合
     * @return {hQuery} - 全新的hQuery对象
     */  
    hQuery.prototype.next = function () {
        let index = 0;
        let ret = new hQuery()
        for (let i = 0; i < this.length; i++) {
            let sibling = this[i].nextElementSibling
            if (sibling) {
                ret[index++] = sibling
            }
        }
        ret.length = index
        ret.prevObject = this
        return ret
    }

    /**
     * 返回hQuery对象中所有节点的上一个兄弟节点的集合
     * @return {hQuery} - 全新的hQuery对象
     */  
    hQuery.prototype.prev = function () {
        let index = 0;
        let ret = new hQuery()
        for (let i = 0; i < this.length; i++) {
            let sibling = this[i].previousElementSibling
            if (sibling) {
                ret[index++] = sibling
            }
        }
        ret.length = index
        ret.prevObject = this
        return ret
    }

    /**
     * 返回[start, end)的节点集合
     * @param {number} start - 起点
     * @param {number} end - 终点
     * @return {hQuery} - 全新的hQuery对象
     */  
    hQuery.prototype.slice = function (start, end) {
        let ret = [].slice.apply(this, arguments)
        ret.prevObject = this
        return ret
    }

    /**
     * 返回满足筛选函数的节点
     * @param {function} fn - 用作筛选的函数，应返回boolean值
     * @return {hQuery} - 全新的hQuery对象
     */  
    hQuery.prototype.filter = function (fn) {
        let index = 0;
        let ret = new hQuery()
        for (let i = 0; i < this.length; i++) {
            let val = fn.call(this[i], i, this[i])
            if (val) {
                ret[index++] = this[i]
            }
        }
        ret.length = index
        ret.prevObject = this
        return ret
    }

    /**
     * 回溯到链上的上一个hQuery对象
     * @return {hQuery} 全新的hQuery对象
     * @example
     * h('#id').find('.class').end() // 会被回溯到h('#id')
     */  
    hQuery.prototype.end = function () {
        return this.prevObject || this
    }

    // html methods

    /**
     * 返回或者设置节点的html
     * @param {string=} html - 要设置的html
     * @return {string|hQuery} - 返回html内容或者自身
     */  
    hQuery.prototype.html = function (html) {
        for (let i = 0; i < this.length; i++) {
            if (html === undefined) {
                return this[0].innerHTML
            }
            this[i].innerHTML = html
        }
        return this
    }

    /**
     * 返回或者设置节点的text
     * @param {string=} text - 将要设置的text值
     * @return {string|hQuery} - 返回text内容或者自身
     */  
    hQuery.prototype.text = function (text) {
        for (let i = 0; i < this.length; i++) {
            if (text === undefined) {
                return this[0].textContent
            }
            this[i].textContent = text
        }
        return this
    }

    /**
     * 返回或者设置节点的value
     * @param {string=} value - 要设置的value
     * @return {string|hQuery} - 返回value内容或者自身
     */  
    hQuery.prototype.val = function (val) {
        for (let i = 0; i < this.length; i++) {
            if (val === undefined) {
                return this[0].value
            }
            this[i].value = val
        }
        return this
    }

    /**
     * 返回或者设置节点的属性
     * @param {string|object} attr - 想取得或者将要设置的attr值，可传入{ attr: value }的对象
     * @param {string=} value - 要设置的attr值
     * @return {string|hQuery} - 返回属性值或者自身
     */  
    hQuery.prototype.attr = function (attr, val) {
        for (let i = 0; i < this.length; i++) {
            if (typeof attr === 'string') {
                if (arguments.length === 1) {
                    return this[0].getAttribute(attr)
                }
                this[i].setAttribute(attr, val)
            } else {
                for (let a in attr) {
                    this[i].setAttribute(a, attr[a])
                }
            }
        }
        return this
    }

    /**
     * 在节点的子节点末尾添加html
     * @param {string|DOM} - 要添加的html或者节点，DOM可传入多个
     * @return {hQuery} - 返回自身
     */
    hQuery.prototype.append = function (html) {
        for (let i = 0; i < this.length; i++) {
            if (typeof html === 'string') {
                this[i].insertAdjacentHTML('beforeend', html)
            }
            else {
                this[i].append(...arguments);
            }
        }
        return this
    }
    
    /**
     * 在节点的子节点开头添加html
     * @param {string|DOM} - 要添加的html或者节点，DOM可传入多个
     * @return {hQuery} - 返回自身
     */
    hQuery.prototype.prepend = function (html) {
        for (let i = 0; i < this.length; i++) {
            if (typeof html === 'string') {
                this[i].insertAdjacentHTML('afterbegin', html)
            }
            else {
                this[i].prepend(...arguments);
            }
        }
        return this
    }

    /**
     * 删除所有节点
     * @return {hQuery} - 返回自身
     */
    hQuery.prototype.remove = function () {
        for (let i = 0; i < this.length; i++) {
            this[i].remove()
        }
        return this
    }

    /**
     * 替代当前节点
     * @param {string|DOM} - 用以替换的html或者DOM，DOM可传入多个
     * @return {hQuery} - 返回自身
     */
    hQuery.prototype.replaceWith = function (html) {
        for (let i = 0; i < this.length; i++) {
            if (typeof html === 'string') {
                this[i].outerHTML = html
            } else {
                this[i].replaceWith(...arguments)
            }
        }
        return this
    }

    /**
     * 隐藏节点
     * @return {hQuery} - 返回自身
     */
    hQuery.prototype.hide = function () {
        for (let i = 0; i < this.length; i++) {
            this[i].style.display = 'none'
        }
        return this
    }

    /**
     * 显示节点
     * @return {hQuery} - 返回自身
     */
    hQuery.prototype.show = function () {
        for (let i = 0; i < this.length; i++) {
            this[i].style.display = ''
        }
        return this
    }

    /**
     * 切换隐藏和显示的状态
     * @return {hQuery} - 返回自身
     */
    hQuery.prototype.toggle = function () {
        for (let i = 0; i < this.length; i++) {
            this[i].style.display = this[i].style.display === 'none' ? '' : 'none'
        }
        return this
    }


    // css methods

    /**
     * 返回或者设置节点的css
     * @param {string|object} attr - 取得或者将要设置的css值，可传入{ attr: value }的对象
     * @param {string=} value - 要设置的css值
     * @return {string|hQuery} - 返回属性值或者自身
     */  
    hQuery.prototype.css = function (attr, val) {
        for (let i = 0; i < this.length; i++) {
            if (typeof attr === 'string') {
                if (arguments.length === 1) {
                    return w.getComputedStyle(this[0], null)[attr]
                }
                this[i].style[attr] = val
            } else {
                for (let a in attr) {
                    this[i].style[a] = attr[a]
                }
            }
        }
        return this
    }

    /**
     * 检测节点是否有该class
     * @param {string} className - 检测的类名
     * @return {boolean}
     */  
    hQuery.prototype.hasClass = function (className) {
        return this[0].classList.contains(className)
    }

    /**
     * 为节点添加class
     * @param {string} className - 增加的类名
     * @return {hQuery} - 返回自身
     */  
    hQuery.prototype.addClass = function (className) {
        for (let i = 0; i < this.length; i++) {
            this[i].classList.add(className)
        }
        return this
    }

    /**
     * 为节点去除class
     * @param {string} className - 去除的类名
     * @return {hQuery} - 返回自身
     */  
    hQuery.prototype.removeClass = function (className) {
        for (let i = 0; i < this.length; i++) {
            this[i].classList.remove(className)
        }
        return this
    }

    /**
     * 切换class
     * @param {string} className - 切换的类名
     * @param {boolen=} force - 可选切换方式，true表示增加，false表示去除
     * @return {hQuery} - 返回自身
     */  
    hQuery.prototype.toggleClass = function (className, force) {
        /*
            When a second argument is present:
            If the second argument evaluates to true, add specified class value,
            and if it evaluates to false, remove it.
         */
        for (let i = 0; i < this.length; i++) {
            this[i].classList.toggle(...arguments)
        }
        return this
    }

    // Event Listener methods

    /**
     * 增加绑定事件
     * @param {string} event - 事件名
     * @param {function} handler - 回调函数，记得处理this绑定
     * @return {hQuery} - 返回自身
     */  
    hQuery.prototype.on = function (event, handler) {
        for (let i = 0; i < this.length; i++) {
            this[i].addEventListener(event, handler);
        }
        return this
    }

    /**
     * 去除绑定事件
     * @param {string} event - 事件名
     * @param {function} handler - 回调函数
     * @return {hQuery} - 返回自身
     */  
    hQuery.prototype.off = function (event, handler) {
        for (let i = 0; i < this.length; i++) {
            this[i].removeEventListener(event, handler);
        }
        return this
    }

    /**
     * 增加绑定事件，该事件在触发一次后会被移除
     * @param {string} event - 事件名
     * @param {function} handler - 回调函数，记得处理this绑定
     * @return {hQuery} - 返回自身
     */  
    hQuery.prototype.one = function (event, handler) {
        for (let i = 0; i < this.length; i++) {
            let fn = (e) => {
                handler(e)
                this[i].removeEventListener(event, fn);
            }
            this[i].addEventListener(event, fn);
        }
        return this
    }


    // other methods

    /**
     * 对每一个节点调用处理函数
     * @param {function} fn - 处理函数，如果返回false会中断后续执行
     * @return {hQuery} - 返回自身
     */  
    hQuery.prototype.each = function (fn) {
        for (let i = 0; i < this.length; i++) {
            let val = fn.call(this[i], i, this[i])
            if (val === false) break
        }
        return this
    }

    /**
     * 在hQuery的原型链上扩展新的方法
     * @param {name} name - 新增的方法名
     * @param {function} fn - 新增的方法
     */  
    hQuery.extend = function (name, fn) {
        if (arguments.length === 2) {
            hQuery.prototype[name] = fn
        } else {
            for (let n in name) {
                hQuery.prototype[n] = name[n]
            }
        }
    }

    
    // Ajex methods

    /**
     * Ajax的GET方法
     * @param {string} url - 请求资源的地址
     * @param {function} callback - 回调函数
     */  
    hQuery.get = function (url, callback) {
        let xhr = new XMLHttpRequest
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(xhr)
            }
        }
        xhr.open("GET", url, true)
        xhr.send()
    }

    /**
     * Ajax的POST方法
     * @param {string} url - 请求资源的地址
     * @param {form} data - POST的数据
     * @param {function} callback - 回调函数
     */      
    hQuery.post = function (url, data, callback) {
        let xhr = new XMLHttpRequest
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(xhr)
            }
        }
        xhr.open("POST", url, true)
        xhr.send(data)
    }

    // Animations
    // TODO:

})(window, document);