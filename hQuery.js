'use strict';

(function (window, document) {

    // for debug
    let log = console.log.bind(console)

    let w = window,
        d = document

    let H = function (selector, context) {
        return new H.prototype.init(selector, context)
    }

    H.prototype = {
        constructor: H,
        length: 0,
        prevObject: null,

        init: function (selector, context) {
            if (!selector) {
                return this
            }

            if (selector.constructor === H) {
                Object.assign(this, selector)
                return this
            }

            // HANDLE: H(DOMElement)
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

    H.prototype.init.prototype = H.prototype

    w.hQuery = H


    // selector methods
    H.prototype.find = function (selector) {
        let ret = new H(selector, this[0])
        ret.prevObject = this
        return ret
    }

    H.prototype.first = function () {
        let ret = new H(this[0])
        ret.prevObject = this
        return ret
    }

    H.prototype.last = function () {
        let ret = new H(this[this.length-1])
        ret.prevObject = this
        return ret
    }

    H.prototype.eq = function (num) {
        num = num > 0 ? num : this.length - num
        let ret = new H(this[num])
        ret.prevObject = this
        return ret
    }

    H.prototype.parent = function () {
        let ret = new H(this[0].parentNode)
        ret.prevObject = this
        return ret
    }

    H.prototype.children = function (num) {
        let ret;
        let children = this[0].children
        if (num !== undefined) {
            num = num > 0 ? num : children.length - num
            ret = new H(children[num])
        } else {
            ret = new H()
            for (let i = 0; i < children.length; i++) {
                ret[i] = children[i]
            }
            ret.length = children.length
        }
        ret.prevObject = this
        return ret
    }

    H.prototype.next = function () {
        let index = 0;
        let ret = new H()
        for (let i = 0; i < this.length; i++) {
            let sibling = this[i].nextSibling
            // ignore TEXT_NODE
            while (sibling && sibling.nodeType === 3) {
                sibling = sibling.nextSibling
            }
            if (sibling) {
                ret[index++] = sibling
            }
        }
        ret.length = index
        ret.prevObject = this
        return ret
    }

    H.prototype.prev = function () {
        let index = 0;
        let ret = new H()
        for (let i = 0; i < this.length; i++) {
            let sibling = this[i].previousSibling
            while (sibling && sibling.nodeType === 3) {
                sibling = sibling.previousSibling
            }
            if (sibling) {
                ret[index++] = sibling
            }
        }
        ret.length = index
        ret.prevObject = this
        return ret
    }

    H.prototype.filter = function (fn) {
        let index = 0;
        let ret = new H()
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

    H.prototype.end = function () {
        return this.prevObject
    }

    // html methods
    H.prototype.html = function (html) {
        for (let i = 0; i < this.length; i++) {
            if (html === undefined) {
                return this[0].innerHTML
            }
            this[i].innerHTML = html
        }
        return this
    }

    H.prototype.text = function (text) {
        for (let i = 0; i < this.length; i++) {
            if (text === undefined) {
                return this[0].textContent
            }
            this[i].textContent = text
        }
        return this
    }

    H.prototype.val = function (val) {
        for (let i = 0; i < this.length; i++) {
            if (val === undefined) {
                return this[0].value
            }
            this[i].value = val
        }
        return this
    }

    H.prototype.attr = function (attr, val) {
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

    H.prototype.append = function (html) {
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
    
    H.prototype.prepend = function (html) {
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

    H.prototype.remove = function () {
        for (let i = 0; i < this.length; i++) {
            this[i].remove()
        }
        return this
    }

    H.prototype.replaceWith = function (html) {
        for (let i = 0; i < this.length; i++) {
            if (typeof html === 'string') {
                this[i].outerHTML = html
            } else {
                this[i].replaceWith(...arguments)
            }
        }
        return this
    }

    H.prototype.hide = function () {
        for (let i = 0; i < this.length; i++) {
            this[i].style.display = 'none'
        }
        return this
    }

    H.prototype.show = function () {
        for (let i = 0; i < this.length; i++) {
            this[i].style.display = ''
        }
        return this
    }

    H.prototype.toggle = function () {
        for (let i = 0; i < this.length; i++) {
            this[i].style.display = this[i].style.display === 'none' ? '' : 'none'
        }
        return this
    }


    // css methods
    H.prototype.css = function (attr, val) {
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

    H.prototype.hasClass = function (className) {
        return this[0].classList.contains(className)
    }

    H.prototype.addClass = function (className) {
        for (let i = 0; i < this.length; i++) {
            this[i].classList.add(className)
        }
        return this
    }

    H.prototype.removeClass = function (className) {
        for (let i = 0; i < this.length; i++) {
            this[i].classList.remove(className)
        }
        return this
    }

    H.prototype.toggleClass = function (className, force) {
        /*
            When a second argument is present:
            If the second argument evaluates to true, add specified class value,
            and if it evaluates to false, remove it.
         */
        for (let i = 0; i < this.length; i++) {
            this[i].classList.toggle(className, force)
        }
        return this
    }

    // Event Listener methods
    H.prototype.on = function (event, handler) {
        for (let i = 0; i < this.length; i++) {
            this[i].addEventListener(event, handler);
        }
        return this
    }

    H.prototype.off = function (event, handler) {
        for (let i = 0; i < this.length; i++) {
            this[i].removeEventListener(event, handler);
        }
        return this
    }


    // other methods
    H.prototype.each = function (fn) {
        for (let i = 0; i < this.length; i++) {
            let val = fn.call(this[i], i, this[i])
            if (val === false) break
        }
        return this
    }

    // extend method on instance or prototype
    H.extend = H.prototype.extend = function (name, fn) {
        if (arguments.length === 2) {
            H.prototype[name] = fn
        } else {
            for (let n in name) {
                H.prototype[n] = name[n]
            }
        }
    }

})(window, document);