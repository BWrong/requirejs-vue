define(['text!./index.html','css!./index.css'], function (template) {
    return {
        template: template,
        data: function () {
            return {
                menu: [{
                    title: '首页',
                    path:'/home'
                },{
                    title: '关于',
                    path:'/about'
                }]
            };
        }
    };
});
