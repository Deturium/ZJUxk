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

        init: function (selector, context) {
            if (!selector) {
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


    // html methods
    H.prototype.find = function (selector) {
        return new H(selector, this[0])
    }

    H.prototype.first = function () {
        return new H(this[0])
    }

    H.prototype.last = function () {
        return new H(this[this.length-1])
    }

    H.prototype.eq = function (num) {
        num = num < 0 ? num : this.length - num
        return new H(this[num])
    }

    // todo: if this[0] is undefined ?
    H.prototype.html = function (html) {
        if (!html) {
            return this[0].innerHTML
        }
        this[0].innerHTML = html
        return this
    }

    H.prototype.text = function (text) {
        if (!text) {
            return this[0].textContent
        }
        this[0].textContent  = text
        return this
    }

    H.prototype.attr = function (attr, val) {
        if (!val) {
            return this[0].getAttribute(attr)
        }
        for (let i = 0; i < this.length; i++) {
            this[i].setAttribute(attr, val)
        }
        return this
    }

    H.prototype.append = function (html) {
        if (typeof html === 'string') {
            let temp = document.createElement('div');
            temp.innerHTML = html;
            let frag = document.createDocumentFragment();
            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }
            this[0].appendChild(frag);
        }
        else {
            this[0].appendChild(html);
        }
        return this
    }

    H.prototype.remove = function () {
        for (let i = 0; i < this.length; i++) {
            this[i].parentNode.removeChild(this[i])
        }
        return this
    }

    H.prototype.replaceWith = function (html) {
        for (let i = 0; i < this.length; i++) {
            this[i].outerHTML = html
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
            if (val) {
                return w.getComputedStyle(this[i], null)[attr]
            }
            this[i].style[attr] = val
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
    H.prototype.on = function (eventName, eventHandler) {
        for (let i = 0; i < this.length; i++) {
            this[i].addEventListener(eventName, eventHandler);
        }
        return this
    }

    H.prototype.off = function (eventName, eventHandler) {
        for (let i = 0; i < this.length; i++) {
            this[i].removeEventListener(eventName, eventHandler);
        }
        return this
    }


    // other methods
    H.prototype.each = function (callback) {
        for (let i = 0; i < this.length; i++) {
            let val = callback.call(this[i], i, this[i])
            if (val === false) break
        }
        return this
    }

    H.prototype.extend = function (name, func) {
        H.prototype[name] = func
    }

})(window, document);