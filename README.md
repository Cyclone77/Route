# Route (单页面路由)

## 前言
> Web手机端网站现在越来越像APP了，传统的页面跳转已经满足不了现在的需求。
就拿Github来说页面跳转刷新的不是整个页面而是其中一部分，但是URL却也改变了，
浏览器的前进后退也可以正常使用。这种技术在HTML5中History可以实现不刷新页面就改变URL。
在不支持HTML5的浏览器可以用hash来实现，类似与锚点#（各大搜索引擎抓去的页面内容不包括URL#后面的内容。用#!来代替!）。

## 为什么要这么做？
- 可以在页面切换间平滑过渡，增加Loading动画。
- 可以在各个页面间传递数据，不依赖URL。
- 可以选择性的保留状态，如音乐网站，切换页面时不会停止播放歌曲。
- 所有的标签都可以用来跳转，不仅仅是a标签。
- 避免了公共JS的反复执行，如无需在各个页面打开时都判断是否登录过等等。
- 减少了请求体积，节省流量，加快页面响应速度。
- 可以让JS代码模块化更有意义

## 实现方式
- History PushState + Ajax
- Hash + Ajax

## 实现过程
- 使用Ajax请求需要新页面
    - 在请求新页面的时候确定是否用缓存加载页面
- 返回的内容渲染在显示的地方
- 利用History或者Hash无刷新改变URL

## 补充

## 用法

``` javascript
Route({
    same: true,  //相同hash值是否重新加载，刷新
    animationClass: "fadeInUp", //路由动画
    applyDom: $("#divSection")[0], //路由渲染Dom
    routeArray: [{
        eventdom: $(".nav.navbar-nav [mark='index']")[0], //触发路由Dom
        ajaxget: true, //是否通过ajax渲染
        ajaxApplyUrl: "tpl/index.html", //通过ajax渲染源
        urlHash: "#!index", //路由hash值
        pageTitle: "主页", //路由后页面标题
        defaultRoute: true, //是否设为默认路由
        applycallback: function (that) {   //当前路由触发结束             
            //require(["page1"], function (page1) {
            //    //alert(sdfx);
            //});
        }
    }],
    onregistered: function (that) {
    	//路由注册结束，在当前路由触发结束事件前执行
    }
})
```