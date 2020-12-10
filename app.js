define(['vue','router','store', '@/cus-header/index'], function(Vue, router,store, cusHeader) {
  'use strict';
  // 注册根实例
  new Vue({
    router: router,
    store: store,
    components: {
      'cus-header': cusHeader
    }
  }).$mount('#app');
});
