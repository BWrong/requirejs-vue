define([
    'text!./frame.html',
    '@/cus-search/index',
    'css!~/css/frame.css'
], function (template,cusSearch) {
    return {
        name: 'frame',
        template: template,
        computed: {
            // 二级菜单
            // subNav: function () {
            //     var routes = this.$router.options.routes;
            //     var path = this.$route.fullPath;
            //     return util.getBrotherRoutesByPath(routes,path);
            // }
            isScos: function () {
                if (this.$route.path.indexOf('list') !== -1 || this.$route.path.indexOf('search') !== -1) {
                    return true;
                }
                return false;
            }
        },
        components: {
            cusSearch: cusSearch
        },
        beforeRouteEnter: function (to, from, next) {
            // 加载一级模块的css
            next(function (vm) {
                if(to.path.match(/^\/scos/)) {
                    return;
                }
                require(['css!~/css/global.css']);
                // var rootPath = util.parseRootPath(to.fullPath);
                // rootPath = rootPath.replace(/^\//, '');
                // require(['css!~/css/' + rootPath + '.css']);
            });
        },
        beforeRouteUpdate: function (to, from, next) {
            next();
            to.path !== '/scos/search' && this.$refs.search && this.$refs.search.reset();
        }
    };
});
