define(['text!./index.html','vue','vueViewer'], function (template, vue,vueViewer) {
  'use strict';
  vue.use(vueViewer);
  return {
    template: template,
    data: function () {
      return {
        perPage: 6,
        list: ['图片名称1','图片名称2','图片名称3'],
        prefix: 'assets/img/'
      };
    },
    computed: {
      totalPage: function () {
        return Math.ceil(this.list.length / this.perPage);
      }
    },
    methods: {
      getNowPageList: function (page) {
        var start = (page - 1) * this.perPage;
        return this.list.slice(start,start + this.perPage);
      }
    }
  };
});
