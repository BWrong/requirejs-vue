const { src, dest, parallel, series, watch } = require('gulp'),
  del = require('del'),
  fs = require('fs'),
  path = require('path'),
  through2 = require('through2'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  minify = require('html-minifier').minify,
  zip = require('gulp-zip'),
  notify = require('gulp-notify'),
  browserSync = require('browser-sync').create();
const PORT = 3000;
// 清除目录
const clearDir = (...path) => del(path);
// 启动server
function server(cb) {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: PORT,
    files: [
      './assets/{img,js}/*',
      './assets/lib/cui/dist/*',
      './assets/lib/**/*.js',
      './components/**/*.{js,html,jpg,png,gif}',
      './config/*',
      './pages/**/*',
      './SCOs/**/*.{js,html,jpg,png,gif}',
      './index.html'
    ],
    watch: false
  });
  watch(['./assets/scss/*.scss', './components/**/*.scss'], globSass);
  watch(['./assets/scss/_*.scss', './SCOs/**/scss/*.scss'], scosSass);
  watch(['./assets/lib/cui/src/**/*.scss'], cuiStyle);
  watch(['./assets/lib/cui/src/**/img/*'], cuiImg);
  watch(['./assets/lib/cui/src/**/*.js', './assets/lib/cui/src/**/*.html'], cuiJs);
}
// 编译全局sass
function globSass() {
  return src('./assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./assets/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
}
// 编译积件sass
function scosSass() {
  const out = './';
  return src('./SCOs/**/scss/*.scss', { base: './' })
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(rename(path => (path.dirname += '../../css')))
    .pipe(dest(out))
    .pipe(browserSync.stream({ match: '**/*.css' }));
}
function buildSass() {
  return parallel(globSass, scosSass);
}

// 构建cui组件 -> /dist/cui.js
function cuiJs() {
  let cuiScript = '';
  return src('./assets/lib/cui/src/**/*.js')
    .pipe(
      through2.obj((file, _, cb) => {
        if (file.isBuffer()) {
          let { base, path: _path, contents } = file;
          let compFolder = _path.replace(`${base}\\`, '').match(/^[^\\]*/);
          let compName = _path.replace(`${base}\\`, '').match(/[^\\]*(?=\.js)/);
          let contentStr = contents.toString();
          let dir = path.join(base, compFolder + '');
          contentStr = contentStr.replace(/_import\(("|').*?\1\)/gim, function(str) {
            let templateFile = str.match(/(?<=_import\(("|')).*?(?=\1\))/gi);
            let templatePath = path.join(dir, templateFile + '');
            if (!fs.existsSync(templatePath)) {
              console.log(
                `\n ❗❗❗  错误：组件【${compFolder}/${compName}】缺少模板文件${templatePath}；errCode: ${str} ❗❗❗ \n`
              );
              return '""';
            }
            let template = fs.readFileSync(templatePath, { encoding: 'utf-8' });
            template = minify(template, {
              removeComments: true,
              collapseWhitespace: true,
              minifyJS: true,
              minifyCSS: true
            });
            template = JSON.stringify(template);
            return `${template}`;
          });
          cuiScript += `\n/*****组件：cui / ${compFolder} / ${compName} *****/\n;${contentStr}`;
        }
        cb(null, file);
      })
    )
    .on('end', () => {
      cuiScript = `define(function(require,exports,module) {
                ${cuiScript}
            });`;
      fs.writeFileSync('./assets/lib/cui/dist/cui.js', cuiScript, { encoding: 'utf8' });
    });
}
// 打包组件css -> /dist/cui.css
function cuiStyle() {
  const out = './assets/lib/cui/dist';
  return (
    src('./assets/lib/cui/src/**/*.scss')
      // .pipe(newer(out + '/cui.scss'))
      .pipe(sourcemaps.init())
      .pipe(concat('cui.scss'))
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('./'))
      .pipe(dest(out))
      .pipe(browserSync.stream({ match: '**/*.css' }))
  );
}
// 拷贝组件图片 -> /dist/img
function cuiImg() {
  const out = './assets/lib/cui/dist/img';
  return src(['./assets/lib/cui/src/**/img/*'])
    .pipe(rename(path => (path.dirname = ''))) // 清空原始目录信息
    .pipe(dest(out));
}
// 压缩zip
function creatZip() {
  return src([
    './{assets,components,data,pages,SCOs}/**/*',
    'index.html',
    '浏览网站.exe',
    '!./**/*.scss'
  ])
    .pipe(zip('course.zip'))
    .pipe(dest('./'))
    .pipe(
      notify({
        title: 'Gulp 通知',
        message: '♪(＾∀＾●)ﾉ  恭喜，打包成功！'
      })
    );
}
exports.default = server;
exports.zip = creatZip;
