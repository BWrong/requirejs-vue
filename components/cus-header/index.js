define(['util', 'text!./index.html'], function (util, template) {
    return {
        template: template,
        data: function () {
            return {
                isOpen: false,
                showIndex: '' // 移动端当前打开的一级菜单索引
            };
        },
        computed: {
            // 菜单
            nav: function () {
                var routes = this.$router.options.routes || [];
                routes = util.deepClone(routes);
                return this.fomartRoute(routes);
            },
            // 根路由
            rootPath: function () {
                return util.parseRootPath(this.$route.path);
            }
        },
        methods: {
            // 格式化处理路由
            fomartRoute: function (routes) {
                var route = routes.filter(function (item) {
                    if (item.children && !item.isHide) {
                        var children = item.children.filter(function (subItem) {
                            subItem.fullPath = subItem.path.match(/^\//) ? subItem.path : item.path + '/' + subItem.path;
                            return !subItem.isHide;
                        });
                        item.children = children;
                    };
                    return !item.isHide;
                });
                return route;
            },
            // 显示/隐藏菜单
            toggle: function () {
                if (!this.$isMobile) {
                return;
                }
                if (this.isOpen) {
                    util.modalHelper.beforeClose();
                    this.isOpen = false;
                } else {
                    this.showIndex = '';
                    this.isOpen = true;
                    util.modalHelper.afterOpen();
                }
            },
            // 切换子菜单
            chang: function (event, item, index) {
                this.showIndex = this.$isMobile ? index : '';
                if (!this.$isMobile || !(item.children && item.children.length > 1)  || item.path.match(/^\/scos/)) {
                    this.$router.push(item.path);
                    this.toggle();
                    return;
                };
            },
            // 计算是否子菜单显示
            isShow: function (index, item) {
                var showIndex = this.showIndex;
                return showIndex ? index === showIndex : item.path === this.rootPath;
            }
        }
    };
});
