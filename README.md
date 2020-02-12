# RequireJS + Vue
本项目是基于`requirejs`和`vuejs2.0`搭建的项目开发框架，在不依赖构建工具的情况下，支持vue全家桶，上手非常简单。
## 目录规划
首先我们规划一下项目的结构，可以参考一下`VueCli`生成的结构，大概如下：
```js
|- components // 组件
|- router // 路由
|- static // 资源
|- store // 状态管理
|- vender // 第三方依赖，需要支持AMD规范
|- views // 路由视图
|- app.js
|- config.js // requirejs配置文件
|- index.html
```
## 模板
由于我们不使用构建工具，而浏览器又不支持`.vue`文件，所以这里不能使用单文件组件。但是这样有一个问题，`requireJS`模块默认是`js`文件，我们的模板总不能用字符串拼接写在js里面吧。这里我们可以使用`require-text`插件来实现模板加载：
```js
// 定义组件
// 在加载的文件夹前加上text!
define(['text!./index.html'], function (template) {
  'use strict';
  return {
    template: template,
    data(){
      return{}
    }
  };
});
```
当然，这个插件除了html，其他的文本文件，比如json，也是可以的。

类似，`css`文件同样有此问题，不过也有对应的插件（`require-css`）处理:
```js
define(['css!./index.css'], function () {
  'use strict';
  return {
    data(){
      return{}
    }
  };
});
```
## 路径
在`config.js`我们可以配置路径别名：
```js
paths: {
        '~': 'static',
        '@': 'components',
        '#': 'views',
        'text': 'vender/requirejs/text',
        'vue': 'vender/vue/vue',
        'vueRouter': 'vender/vue-router/vue-router',
        'vuex': 'vender/vuex/vuex',
        'util': 'static/js/util',
        'router': 'router/index',
        'routes': 'router/routes',
        'store': 'store/index',
        'app': 'app'
    }
```
## 路由
当我们的项目路由比较多的时候，可能会有路由懒加载的需求，在`util.js`中提供了如下方法：
```js
 util.importComponent = function(path) {
    return function(resolve) {
      require([path], resolve);
    };
  };
```
在注册路由的时候，我们可以通过如上方法实现懒加载：
```js
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
```
