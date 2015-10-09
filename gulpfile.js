'use strict';

var swig = require('gulp-swig');
var data = require('gulp-data');

var gulp = require('gulp'),
  path = require('path');

var sass = require('gulp-sass'),
  jade = require('gulp-jade'),
  compass = require('gulp-compass'),
  coffee = require('gulp-coffee');

var gutil = require('gulp-util'),
  clean = require('gulp-clean'),
  gulpSequence = require('gulp-sequence').use(gulp);


var livereload = require('gulp-livereload');

var inputDir = './lib',
  outputDir = './static';

// 需要操作的文件
var source = {
  sassDir: path.join(inputDir, 'sass'),
  htmlDir: path.join(inputDir, 'jade'),
  coffeeDir: path.join(inputDir, 'coffee'),
  imagesDir: path.join(inputDir, 'images'),

  sassFileDir: path.join(inputDir, 'sass/*.scss'),
  htmlFileDir: path.join(inputDir, 'html/*.tpl'),
  coffeeFileDir: path.join(inputDir, 'coffee/*.coffee'),
  imagesFileDir: path.join(inputDir, 'images/*.*'),
  jslibFileDir: path.join(inputDir, 'jslib/*.js')
}

// 输出文件
var output = {
  cssDir: path.join(outputDir, 'css'),
  htmlDir: path.join(outputDir, 'html'),
  jsDir: path.join(outputDir, 'js'),
  jslibDir: path.join(outputDir, 'js'),
  imagesDir: path.join(outputDir, 'images')
}



var getJsonData = function(file) {
  return require('./lib/json/' + file + '.json');
};

gulp.task('zhTmp', function() {
  return gulp.src(source.htmlFileDir)
    .pipe(data(getJsonData('zh-cn')))
    .pipe(swig())
    .pipe(gulp.dest('zh-cn'));
});
gulp.task('enTmp', function() {
  return gulp.src(source.htmlFileDir)
    .pipe(data(getJsonData('en-us')))
    .pipe(swig())
    .pipe(gulp.dest('en-us'));
});

// 清空文件夹
gulp.task('clean', function() {
  gulp.src(outputDir, {
      read: false
    })
    .pipe(clean());
});

//复制 图片 和 公共js
gulp.task('copy:images', function() {
  gulp.src(source.imagesFileDir)
    .pipe(gulp.dest(output.imagesDir));
});
gulp.task('copy:jslib', function() {
  gulp.src(source.jslibFileDir)
    .pipe(gulp.dest(output.jslibDir));
});

gulp.task('copy', ['copy:images', 'copy:jslib']);

// 编译 sass
gulp.task('sass', function() {
  gulp.src(source.sassFileDir)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(output.cssDir));
});

// 编译 compass
gulp.task('compass', function() {
  gulp.src(source.sassFileDir)
    .pipe(compass({
      config_file: './config.rb',
      images: output.imagesDir,
      sass: source.sassDir,
      css: output.cssDir
    }))
    .pipe(gulp.dest(output.cssDir));
});

// 编译 coffee
gulp.task('coffee', function() {
  gulp.src(source.coffeeFileDir)
    .pipe(coffee({
      bare: true
    }).on('error', gutil.log))
    .pipe(gulp.dest(output.jsDir))
});

// watch
gulp.task('compass:watch', function() {
  gulp.watch(source.sassFileDir, ['compass']);
});

gulp.task('coffee:watch', function() {
  gulp.watch(source.coffeeFileDir, ['coffee']);
});

gulp.task('copy:images:watch', function() {
  gulp.watch(source.imagesFileDir, ['copy:images']);
});
gulp.task('copy:jslib:watch', function() {
  gulp.watch(source.jslibFileDir, ['copy:jslib']);
});
gulp.task('zhTmp:watch', function() {
  gulp.watch(source.htmlFileDir, ['zhTmp']);
});

gulp.task('build', [
  'copy',
  'coffee',
  'compass',
  'zhTmp',
  'enTmp'
]);

gulp.task('watch', [
  'copy',
  'zhTmp:watch',
  'compass:watch',
  'coffee:watch'
  /*'copy:images:watch',
  'copy:jslib:watch',
  'jade:watch',
  'coffee:watch'*/
]);

gulp.task('default', [
  'build',
  'watch'
]);
