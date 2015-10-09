'use strict';
var gulp = require('gulp'),
  path = require('path');

var sass = require('gulp-sass'),
  compass = require('gulp-compass');

var inputDir = './lib',
  outputDir = './lib';

// 需要操作的文件
var source = {
  sassDir: path.join(inputDir, '/'),
  sassFileDir: path.join(inputDir, '*.scss')
}

// 输出文件
var output = {
  cssDir: path.join(outputDir, '/')
}

// 编译 compass
gulp.task('compass', function() {
  gulp.src(source.sassFileDir)
    .pipe(compass({
      config_file: './config.rb',
      //images: output.imagesDir,
      sass: source.sassDir,
      css: output.cssDir
    }))
    .pipe(gulp.dest(output.cssDir));
});

// watch
gulp.task('compass:watch', function() {
  gulp.watch(source.sassFileDir, ['compass']);
});

gulp.task('build', [
  'compass'
]);

gulp.task('watch', [
  'compass:watch'
]);

gulp.task('default', [
  'build',
  'watch'
]);
