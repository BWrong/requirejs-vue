// 配置
requirejs.config({
    // urlArgs: 'yn-course=' + (new Date()).getTime(),
    baseUrl: './', //用于加载模块的根路径
    paths: {
        '~': 'assets',
        '@': 'components',
        '#': 'pages',
        '^': 'data',
        'text': 'assets/lib/requirejs/text',
        'vue': 'assets/lib/vue/vue',
        'vueRouter': 'assets/lib/vue-router/vue-router',
        '$': 'assets/lib/zepto/index',
        'layer': 'assets/lib/layer/index',
        'swiper': 'assets/lib/swiper/swiper.min',
        'vueLazyload': 'assets/lib/vue-lazyload/vue-lazyload',
        'vueSwiper': 'assets/lib/vue-swiper/vue-swiper',
        'videojs': 'assets/lib/videojs/index',
        'viewerjs': 'assets/lib/viewerjs/viewer.min',
        'vueViewer': 'assets/lib/v-viewer/index',
        'vueModel': 'assets/lib/vue-3d-model/vue-3d-model',
        'vueLayer': 'assets/lib/vue-layer/index',
        'headroom': 'assets/lib/headroom/headroom.min',
        'cui': 'assets/lib/cui/dist/cui',
        'filters': 'assets/js/filters',
        'routes': 'assets/js/routes',
        'util': 'assets/js/util',
        'app': 'assets/js/app'
    },
    map: {
        '*': {
            'css': 'assets/lib/requirejs/css.min'
        }
    },
    config: {},
    // waitSeconds: 0,
    deps: ['cui'],
    shim: { // 加载非amd规范的模块
        'swiper': {
            deps: ['css!~/lib/swiper/swiper.css']
        },
        'viewerjs': {
            deps: ['css!~/lib/viewerjs/viewer.css']
        }
        // 'vueViewer': {

        //     exports: 'vueViewer'
        // }
        // 'videojs': {
        //     deps: ['css!~/lib/videojs/videojs.css','assets/lib/videojs/lang/zh-CN.js']
        // }
        // 'underscore': {
        //     exports: '_'
        // },

        // 'backbone': {
        //     deps: ['underscore', 'jquery'],
        //     exports: 'Backbone'
        // }
    }
});
// 载入入口
require(['util'], function (util) {
    // 检测浏览器
    if (util.checkBrowser()) {
        require(['app']);
    } else {
        window.location.href = './pages/browser.html';
    }

});
