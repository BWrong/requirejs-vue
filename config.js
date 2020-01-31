// 配置
requirejs.config({
    baseUrl: './', //用于加载模块的根路径
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
    },
    map: {
        '*': {
            'css': 'vender/requirejs/css.min'
        }
    },
    config: {},
    // waitSeconds: 0,
    shim: { // 加载非amd规范的模块
        'swiper': {
            deps: ['css!vender/swiper/swiper.css']
        }
    }
});
// 载入入口
require(['app']);
