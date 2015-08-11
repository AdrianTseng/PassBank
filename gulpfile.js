/* gulpfile.js */

var gulp = require('gulp'),

    //自动刷新
    browserSync = require('browser-sync'),
    reload = browserSync.reload,

    //样式表
    autoPrefixer = require('gulp-autoprefixer'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),

    //脚本
    ngAnnotate = require('gulp-ng-annotate'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),

    //清理
    del = require('del');

var sources = {
    Scripts: ['Scripts/*.js', 'Scripts/**/*.js'],
    Stylus: 'Styles/*.styl'
};

var watch = {
    scripts: sources.Scripts,
    stylus: [sources.Stylus, "Styles/**/*.styl"],
    template: ['Server/templates/**/*.html', 'Server/templates/*.html', 'Server/blueprints/**/templates/*.html']
};

var results = {
     js: 'static/js/',
     css: 'static/css/'
};

gulp.task('browser-sync', function () {
     browserSync({
         proxy: '127.0.0.1:5000'
     })
});

gulp.task('css', function(){
     return gulp.src(sources.Stylus).
         pipe(stylus({
             use: nib(),
             compress: true
         })).
         pipe(autoPrefixer('last 5 version', 'safari 6', 'ie 9', 'opera 12.1', 'ios 6', 'android 3')).
         pipe(gulp.dest(results.css)).
         pipe(reload({stream: true}));
});

gulp.task('js', function(){
     return gulp.src(sources.Scripts)
         .pipe(ngAnnotate())
         .pipe(uglify({outSourceMap: false}))
         .pipe(concat('app.min.js'))
         .pipe(gulp.dest(results.js))
         .pipe(reload({stream: true}));
});

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('clean', function (){
    del([results.css + "**", results.js + "**"]);
});

gulp.task('default', ['clean', 'css', 'js', 'browser-sync'], function () {
    gulp.watch(watch.stylus, ['css']);
    gulp.watch(watch.scripts, ['js']);
    gulp.watch(watch.template, ['reload']);
});

gulp.task('build', ['clean', 'css', 'js']);

