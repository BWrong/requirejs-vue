define([
    '$',
    'vue',
    'layer',
    'vueRouter',
    'filters',
    'routes',
    'util',
    '@/cus-header/index',
    '@/cus-footer/index',
    '@/cus-gotop/index'
], function ($, Vue, layer, VueRouter, filters, routes, util, cusHeader, cusFooter, cusGotop) {
        'use strict';
    // var layer = vueLayer(Vue);
    // 将设备信息绑定到Vue原型
    Vue.prototype.$os = $.os;
    Vue.prototype.$browser = $.browser;
    Vue.prototype.$width = $(window).width();
    Vue.prototype.$layer = layer;
    Vue.prototype.$isMobile = $(window).width() < 1200;
    /*****************/
    Object.freeze(routes);
    // 注册全局过滤器
    for (var key in filters) {
        filters.hasOwnProperty(key) && Vue.filter(key, filters[key]);
    }
    // 注册路由
    Vue.use(VueRouter);
    var router = new VueRouter({
        routes: util.createRouter(routes.mainRoutes),
        scrollBehavior: function (to, from) {
            return { x: 0,y: 0 };
        },
        linkActiveClass: 'active'
    });
    // 全局路由守卫
    router.beforeEach(function (to, from, next) {
        layer.load(2);
        next();
    });
    router.afterEach(function () {
        layer.closeAll();
    });
    // 注册根实例
    new Vue({
        router: router,
        // 注入设备信息，可在组件使用inject选择接受
        provide: {
            os: $.os,
            browser: $.browser,
            isMobile: $(window).width() < 1200,
            width: $(window).width()
        },
        components: {
            'cus-footer': cusFooter,
            'cus-header': cusHeader,
            'cus-gotop': cusGotop
        }
    }).$mount('#app');
});
