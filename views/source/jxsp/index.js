define(['text!./index.html', 'text!^/source/jxsp.json'], function (template, list) {
  'use strict';
  return {
    template: template,
    data: function () {
      return {
        perPage: 6,
        list: JSON.parse(list)
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
