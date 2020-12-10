define(['vue', 'vueRouter','routes'], function(Vue, VueRouter,routes) {
  'use strict';
  // 注册路由
  Vue.use(VueRouter);
  var router = new VueRouter({
    routes: routes,
    scrollBehavior: function(to, from) {
      return { x: 0, y: 0 };
    },
    linkActiveClass: 'active'
  });
  // 全局路由守卫
  router.beforeEach(function(to, from, next) {
    next();
  });
  router.afterEach(function () { });
  return router;
});
