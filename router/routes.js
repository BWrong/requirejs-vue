define(['util'], function(util) {
  'use strict';
  var importComponent = util.importComponent;
  return [
    {
      path: '/home',
      title: '首页',
      name: 'home',
      component: importComponent('./views/home/index')
    },
    {
      path: '/about',
      name: 'about',
      title: '关于',
      component: importComponent('./views/about/index'),
      redirect: '/about/index',
      children: [
        {
          path: 'index',
          title: '关于1',
          component: importComponent('./views/about/about1/index')
        }
      ]
    },
    {
      path: '*',
      redirect: '/home'
    }
  ];
});
