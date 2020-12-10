const { src, dest, watch } = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create();
const PORT = 3000;
// server
function server(cb) {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: PORT,
    files: [
      './static/{img,css,js}/*',
      './components/**/*',
      './router/**/*',
      './store/**/*',
      './vender/*',
      './views/**/*',
      './app.js',
      './config.js',
      './index.html'
    ],
    watch: false
  });
  watch(['./static/scss/*.scss'], buildSass);
}
// sass
function buildSass() {
  return src('./static/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./static/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
}



exports.default = server;
