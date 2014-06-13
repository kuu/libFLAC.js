'use strict';

// Load gulp
var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();

// Lint
gulp.task('lint', function () {
    return gulp.src('src/**/*.js')
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe($.size());
});

// Unit test
gulp.task('test', function () {
    return gulp.src('test/spec/**/*.js')
        .pipe($.jasmine());
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['dest/*'], {read: false}).pipe($.clean());
});
