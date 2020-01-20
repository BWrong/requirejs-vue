define(function () {
   var filters = {};
   // 字符截取
   filters.intercept = function (str, length) {
      return !str ? '' : str.length < length ? str : str.slice(0, length) + '...';
   };
   // 数字转字母
   filters.letter = function (num) {
      return String.fromCharCode(65 + parseInt(num));
   };
   // 字母转大写
   filters.uppercase = function (str) {
      return String(str).toUpperCase();
   };
   // 字母转小写
   filters.lowercase = function (str) {
      return String(str).toLowerCase();
   };
   return filters;
});
