
; (function (window, undefined) {

    //构造对象
    function SpaRoute(options) {
        // 是否允许跳转到当前相同URL，相当于刷新
        this.same = false,
        //渲染目标
        this.applyDom = null,
        //触发事件,默认为点击事件
        this.eventType = "click",
        //路由切换渲染目标动画
        this.animationClass = "",
        //是否启用缓存, 针对于浏览器的前进后退
        this.cache = false,
        //路由内容
        this.routeArray = [{
            //触发对象
            eventdom: null,
            //是否通过ajax渲染目标,只对当前路由有效
            ajaxget: false,
            //ajax渲染目标源数据路径, ajaxget = true 有效
            ajaxApplyUrl: null,
            //是否为初始路由
            defaultRoute: false,
            //页面标题
            pageTitle: null,
            //触发后URL的hash值为
            urlHash: null,
            //渲染目标，只对当前路由有效
            applyDom: this.applyDom,
            //渲染后触发回调函数
            applycallback: function () {

            }
        }],
        //路由注册完成后回调
        this.onregistered = null;
        this.init(options);
    };

    //对象原型方法
    SpaRoute.prototype = {
        constructor: SpaRoute,
        //是否触发浏览器的前进后退
        popstate: false,
        //对象初始化
        init: function (options) {
            tool.extend(this, options);
            if (!!this.animationClass) this.animationend();
            this.registerHashEvent();
            this.register();
        },
        //为window添加hash事件
        registerHashEvent: function () {
            var that = this;
            //以urlHash为准，如果存在则hash值改变，不存在，则用a标签的href内容
            tool.addHandler(window, "hashchange", function () {
                that.findHashRouteObj(that);
            });

            //刷新加载
            that.findHashRouteObj(that);
        },
        //查找hash对应的路由对象
        findHashRouteObj: function (that) {
            if (!!window.location.hash) {
                that.routeArray.forEach(function (item) {
                    if (item.urlHash == window.location.hash) {
                        that.routeCurrent = item;
                    }
                });
                if (that.routeCurrent && that.routeCurrent.ajaxget && !!that.routeCurrent.ajaxApplyUrl) {
                    that.ajaxApply(that);
                } else
                    if (!!that.routeCurrent) that.hashCallback(that);
            }
        },
        //hash改变回调
        hashCallback: function (that) {
            //添加路由渲染动画
            if (!!that.animationClass && that.applyDom.classList) that.applyDom.classList.add(that.animationClass);
            //执行路由回调完成事件
            if (!!that.onregistered && tool._typeof(that.onregistered) == "function") {
                that.onregistered(that.routeCurrent, that);
            }
            //执行回调函数
            if (that.routeCurrent.applycallback && tool._typeof(that.routeCurrent.applycallback) == "function") {
                that.routeCurrent.applycallback(that.routeCurrent, that);
                //把当前选中路由对象清空，主要对多次调用对象出现问题解决
                setTimeout(function () {
                    that.routeCurrent = null;
                }, 0);
            }
        },
        //注册路由组件
        register: function () {
            var that = this;
            if (tool._typeof(this.routeArray) == "array" && this.routeArray.length > 0) {
                this.routeArray.forEach(function (item, index) {
                    //只有urlHash存在并且符合规定(#!)才注册事件
                    if (!!item.eventdom && !!item.urlHash && item.urlHash.indexOf("#!") > -1) {
                        //注册事件
                        tool.addHandler(item.eventdom, item.eventType || that.eventType, function (event) {
                            that.eventHander(event, item, that);
                        });
                    }
                    //加载初始路由
                    if (item.defaultRoute && !window.location.hash) {
                        that.eventHander(null, item, that);
                    }
                });
            }
        },
        //事件触发
        eventHander: function (event, routeObj, that) {
            that.routeCurrent = routeObj;
            //移除路由渲染动画
            if (!!that.applyDom && that.applyDom.classList &&
                [].indexOf.call(that.applyDom.classList, that.animationClass) > -1)
                that.applyDom.classList.remove(that.animationClass);
            //更改hash，跳转到当前相同URL，相当于刷新
            if (window.location.hash == routeObj.urlHash && that.same) {
                that.findHashRouteObj(that);
            } else
                window.location.hash = routeObj.urlHash;
        },
        //是否通过ajax渲染目标
        ajaxApply: function (that) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", that.routeCurrent.ajaxApplyUrl, true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    // 姑且认为200-300之间都是成功的请求，304是缓存
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        var title = that.routeCurrent.pageTitle || document.title,
                            html = xhr.responseText;
                    }
                    that.applyPageShow(that, title, html);
                }
            };
            xhr.send();
        },
        applyPageShow: function (that, title, html) {
            document.title = title;

            var element = that.routeCurrent.applyDom || that.applyDom;
            element.innerHTML = html;

            that.hashCallback(that);
        },
        //为渲染目标添加的动画执行结束事件
        animationend: function () {
            var that = this;
            tool.addHandler(that.applyDom,'animationend', function () {
                that.applyDom.classList.remove(that.animationClass);
            });
        },
        //添加前进后退事件
        addPopstate: function(){
            var that = this;
            tool.addHandler(window, "popstate", function () {
                that.popstate = true;
            });
        },
        //添加缓存， 浏览器回话存在有效
        addSession: function(key, val){
            seStor.set(key,JSON.stringify(val));
        }
    };

    //工具箱
    var tool = {
        /*
             *  合并两个对象，浅拷贝
             *  @param {Object} obj1
             *  @param {Object} obj2
             */
        extend: function (obj1, obj2) {
            if (!obj2 && this._typeof(obj2) != "object") return;

            for (var key in obj2) {
                if (obj2.hasOwnProperty(key)) {
                    obj1[key] = obj2[key];
                }
            }

            return obj1;
        },
        /*
            *   获取目标数据类型
            *   @param {Object} obj
            */
        _typeof: function (obj) {
            if (obj == null) {
                return String(obj);
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[class2type.toString.call(obj)] || "object" :
                typeof obj;
        },
        /*
            *   为dom元素添加指定事件
            *   @element {Object} Dom对象
            *   @type {String} 事件名称
            *   @handler {Function} 事件处理函数
            */
        addHandler: function (element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },
        /*
            *   为dom元素删除指定事件
            *   @element {Object} Dom对象
            *   @type {String} 事件名称
            *   @handler {Function} 事件处理函数
            */
        removerHandler: function (element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        }
    };

    //数据类型
    var class2type = {};
    "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function (e, i) {
        class2type["[object " + e + "]"] = e.toLowerCase();
    });

    //sessionStorage 对象操作
    var seStor = {
        /*
        *   保存缓存，页面回话打开期间有效
        *   @key {String} 键
        *   @val {String} 值
        */
        set: function (key, val) {
            //各浏览器支持的 localStorage 和 sessionStorage 容量上限不同。
            //如果达到上限则删除第一个键重新保存
            try {
                sessionStorage.setItem(key, val);
            } catch (e) {
                this.shift();
                this.set(key, val);
            }
        },
        get: function (key) {
            sessionStorage.getItem(key);
        },
        /*
        *   删除指定key值
        *   @key {String} 键名称
        */
        del: function (key) {
            sessionStorage.removeItem(key);
        },
        //返回sessionStorage对象
        getStorage: function () {
            return sessionStorage;
        },
        //删除当前第一个sessionStorage对象的键
        shift: function () {
            this.del(sessionStorage.key(0));
        }
    };

    /*
    *   初始化对象
    *   @param {Object} options
    */
    window.Route = function (options) {
        return new SpaRoute(options);
    };

    //支持amd规范
    if (typeof define === "function" && define.amd) {
        define("Route", [], function () { return Route; });
    }

})(window);