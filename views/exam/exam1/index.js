define(['text!../exam.html','$'], function (template,$) {
  'use strict';
    return {
      template: template,
      data: function() {
        return {
          data: {},
          prefix: ''
        };
      },
      created:function() {
        // 加载试题文件;
        var basePath = './data' + this.$route.path;
        var self = this;
        $.get(basePath + '/index.json', function (res) {
          self.data = typeof res === 'object' ? res : JSON.parse(res);
          self.prefix = basePath;
        },'json');
      },
      methods: {
        // submit: function (score) {
        //   this.$layer.alert('您的分数：' + score, { icon: 6,title: '提示'  });
        // },
        // reset: function () {
        //   // console.log('reset');
        //  }
      }
  };
});
