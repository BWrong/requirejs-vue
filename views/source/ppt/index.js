define(['text!./index.html', 'text!^/source/ppt.json'], function (template, list) {
    'use strict';
    return {
      template: template,
      data: function () {
        return {
          perPage: 1,
          list: JSON.parse(list),
          current: '0-0',
          currentStatus: true
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
        },
        showCurrent: function (chapterIndex, sectionIndex) {
          var indentify = chapterIndex + '-' + sectionIndex;
          this.current = this.current == indentify ? '' : indentify;
        },
        getDownloadName: function (section) {
          return section.title + '.' + section.downloadUrl.substring(section.downloadUrl.lastIndexOf('.') + 1);
        }
      }
    };
  });
