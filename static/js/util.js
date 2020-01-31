define(['require'], function(require) {
  var util = {};
  util.importComponent = function(path) {
    return function(resolve) {
      require([path], resolve);
    };
  };
  return util;
});
