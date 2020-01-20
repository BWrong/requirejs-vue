define(['text!./index.html', 'text!^/source/syzd.json'], function (template, list) {
    'use strict';
    return {
      template: template,
      data: function () {
        return {
          list: JSON.parse(list),
          showIndex: 0
        };
      },
      computed: {
        src: function () {
          return this.list[this.showIndex].src;
        }
      },
      methods: {
        showVideo: function (index) {
          this.showIndex = index;
        }
      }
    };
  });
