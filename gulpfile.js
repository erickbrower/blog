var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');  

gulp.task('default', ['lint']);

gulp.task('lint', function() {
  var sources = [
    './lib/**/*.js',
    './lib/**/*.js',
    './src/js/components_data/**/*.js',
    './src/js/components_ui/**/*.js',
    './src/js/page/**/*.js',
    './src/js/main.js',
    './build.js',
    './server.js'
  ];
  return gulp.src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
});
