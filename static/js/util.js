define(['$', 'routes', 'require'], function($, routes, require) {
  var util = {};
  var indexName = routes.indexName;
  var scosName = routes.scosName;
  var columnPrefix = 'column';
  var itemPrefix = 'item';
  util.checkBrowser = function() {
    // 检测兼容性
    var browser = $.browser;
    var version = parseInt(browser.version);
    return !(browser.ie && version < 10);
  };
  // 创建路由
  util.createRouter = function(routes) {
    var _this = this;
    var columnCount = 0;
    // 自动加载路由
    routes.map(function(item) {
      var itemCount = 0;
      item.component = _this.resolveModule('#/frame');
      item.meta = {
        title: item.title
      };
      columnCount++;
      item.path = item.path || '/' + columnPrefix + columnCount;
      item.children &&
        item.children.map(function(subitem) {
          subitem.meta = {
            title: subitem.title
          };
          itemCount++;
          subitem.path = subitem.path || itemPrefix + itemCount;
          subitem.component = _this.resolveModule('#' + item.path + '/' + subitem.path, true);
        });
    });
    //
    routes.unshift({
      path: '/home',
      title: indexName,
      component: _this.resolveModule('#/home')
    });
    routes.push({
      path: '/scos',
      title: scosName,
      component: _this.resolveModule('#/frame'),
      children: [
        {
          path: 'list',
          isHide: true,
          component: _this.resolveModule('#/scos/list')
        },
        {
          path: 'content',
          isHide: true,
          component: _this.resolveModule('#/scos/content')
        },
        {
          path: 'search',
          isHide: true,
          component: _this.resolveModule('#/scos/search')
        }
      ]
    });
    // 处理重定向到子路由
    routes = _this.setRedirect(routes);
    // 排序
    routes.sort(function(a, b) {
      var prevSort = a.sort || 0;
      var nextSort = b.sort || 0;
      return prevSort - nextSort;
    });
    // 未知路由定位到首页
    routes = routes.concat({
      path: '*',
      redirect: '/home',
      isHide: true
    });
    return routes;
  };
  // 处理路由重定向
  util.setRedirect = function(routes, prefix) {
    var _this = this;
    prefix = prefix || '';
    routes.map(function(item) {
      if (item.children && item.children.length && !item.redirect) {
        var path = item.path.match(/^\//) ? item.path : '/' + item.path;
        path = prefix + path;
        var childPath = item.children[0].path || '';
        item.redirect = childPath.match(/^\//) ? childPath : path + '/' + childPath;
        return _this.setRedirect(item.children, path);
      }
      return item;
    });
    return routes;
  };
  // 解析路由组件
  util.resolveModule = function(path, isGlobal) {
    var path = isGlobal ? path + '/index' : path;
    return function(resolve) {
      require([path], resolve);
    };
  };
  // 根据路由解析根路由
  util.parseRootPath = function(path) {
    return path ? path.match(/^\/[^/?#]*/i) + '' : '';
  };
  // 根据path获取同级路由
  util.getBrotherRoutesByPath = function(routes, path) {
    var rootPath = util.parseRootPath(path);
    var rootRoute = {};
    routes.map(function(item) {
      if (item.path === rootPath) {
        rootRoute = item;
      }
    });
    return rootRoute.children || [];
  };
  // 函数防抖
  util.debounce = function(fn, delay) {
    var timer = null;
    return function() {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        fn.apply(this, arguments);
      }, delay);
    };
  };
  // 函数节流
  util.throttle = function(fn, cycle) {
    var start = Date.now();
    var now;
    var timer;
    return function() {
      now = Date.now();
      clearTimeout(timer);
      if (now - start >= cycle) {
        fn.apply(this, arguments);
        start = now;
      } else {
        timer = setTimeout(function() {
          fn.apply(this, arguments);
        }, cycle);
      }
    };
  };
  // 获取类型
  util.getType = function(obj) {
    //tostring会返回对应不同的标签的构造函数
    var toString = Object.prototype.toString;
    var map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    };
    if (obj instanceof Element) {
      return 'element';
    }
    return map[toString.call(obj)];
  };
  // 对象深拷贝
  util.deepClone = function(data) {
    var type = util.getType(data);
    var obj;
    if (type === 'array') {
      obj = [];
    } else if (type === 'object') {
      obj = {};
    } else {
      //不再具有下一层次
      return data;
    }
    if (type === 'array') {
      for (var i = 0, len = data.length; i < len; i++) {
        obj.push(util.deepClone(data[i]));
      }
    } else if (type === 'object') {
      for (var key in data) {
        obj[key] = util.deepClone(data[key]);
      }
    }
    return obj;
  };
  // 解决滚动穿透，阻止滚动：afterOpen，恢复滚动：beforeClose
  util.modalHelper = (function() {
    // var scrollTop;
    var bodyCls = 'modal-open';
    return {
      afterOpen: function(fn) {
        scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add(bodyCls);
        $('video').hide();
        fn && fn();
        // document.body.style.top = -scrollTop + 'px';
      },
      beforeClose: function(fn) {
        document.body.classList.remove(bodyCls);
        $('video').show();
        fn && fn();
        // scrollTop lost after set position:fixed, restore it back.
        // document.scrollingElement.scrollTop = scrollTop;
      }
    };
  })();
  return util;
});
