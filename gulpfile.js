var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  prettify = require('gulp-prettify');

gulp.task('default', ['lint', 'prettify']);

//TODO: update these sources with new file structure
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

gulp.task('prettify', function() {
  gulp.src(sources)
    .pipe(prettify({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./src')) // edit in place
});

gulp.task('lint', function() {
  return gulp.src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
});
