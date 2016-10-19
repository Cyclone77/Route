require.config({
    paths: {
        jquery: "../lib/jquery",
        bootstrap: "../lib/bootstrap",
        Route: "../lib/Route"
    },
    shim: {
        "bootstrap": {
            deps: ['jquery']
        }
    }
});

require(["jquery", "bootstrap", "Route"], function ($, _, Route) {
    Route({
        same: true,
        animationClass: "fadeInUp",
        applyDom: $("#divSection")[0],
        routeArray: [{
            eventdom: $(".nav.navbar-nav [mark='index']")[0],
            ajaxget: true,
            ajaxApplyUrl: "tpl/index.html",
            urlHash: "#!index",
            pageTitle: "主页",
            defaultRoute: true,
            applycallback: function (that) {                
                //require(["page1"], function (page1) {
                //    //alert(sdfx);
                //});
            }
        }, {
            eventdom: $(".nav.navbar-nav [mark='tag']")[0],
            ajaxget: true,
            ajaxApplyUrl: "tpl/tag.html",
            urlHash: "#!tag",
            applycallback: function (that) {

            }
        }, {
            eventdom: $(".nav.navbar-nav [mark='about']")[0],
            ajaxget: true,
            ajaxApplyUrl: "tpl/about.html",
            urlHash: "#!about",
            applycallback: function (that) {

            }
        }],
        onregistered: function (that) {
            $(that.eventdom).closest("li").addClass("active").siblings("li").removeClass("active");
        }
    });
});