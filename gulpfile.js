var gulp = require('gulp');
var sass = require('gulp-sass');
var wait = require('gulp-wait');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');
var uncss = require('gulp-uncss');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(wait(500))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(uncss({html: ['app/index.html']}))
    .pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 8',], {cascade: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browser-sync', function(){
  browserSync({
    server:{
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('clean', function(){
  return del.sync('dist');
}); 
gulp.task('clear', function(){
  return cache.clearAll();
}); 
gulp.task('img', function(){
  return gulp.src('app/images/**/*')
        .pipe(cache(imagemin({
           interlaced: true,
           progressive: true,
           svgoPlugins: [{removeViewbox: false}],
           use: [pngquant()]
         })))
        .pipe(gulp.dest('dist/images'))
}); 
gulp.task('watch',['browser-sync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build',['clean', 'sass', 'img'], function(){
  var buildCss = gulp.src('app/css/styles.css')
                .pipe(gulp.dest('dist/css'));
  var buildFonts = gulp.src('app/fonts/**/*')
                  .pipe(gulp.dest('dist/fonts'));
  var buildImages = gulp.src('app/images/**/*')
                   .pipe(gulp.dest('dist/images'));
  var buildHtml = gulp.src('app/*.html')
                .pipe(gulp.dest('dist'));
  var buildJs = gulp.src('app/js/**/*')
              .pipe(gulp.dest('dist/js'))
});

gulp.task('default', ['watch']);