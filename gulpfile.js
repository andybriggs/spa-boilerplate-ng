// =======================================================================// 
// Load plugins                                                           //
// =======================================================================// 

var gulp = require('gulp');
var less = require('gulp-less');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

// =======================================================================// 
// Individual tasks                                                       //
// =======================================================================//

// Compile less
gulp.task('less', function() {
  return gulp.src('./node_modules/bootstrap/less/bootstrap.less')
  .pipe(less())
  .pipe(gulp.dest('./public/vendor/'));
});

// Copy unminified vendor files from node_modules to public vendor folder
gulp.task('copy-dev', function() {
  return gulp.src('./node_modules/angular/angular.js')
  .pipe(gulp.dest('./public/vendor/'));
});

// Copy minified vendor files from node_modules to public vendor folder
gulp.task('copy-release', function() {
  return gulp.src(['./node_modules/angular/angular.min.js','./node_modules/bootstrap/dist/css/bootstrap.min.css'])
  .pipe(gulp.dest('./public/vendor/'));
});

// Delete vendor folder and contents
gulp.task('clean', function() {
  return gulp.src('./public/vendor', { read: false })
  .pipe(clean());
});

// =======================================================================// 
// Build tasks                                                            //
// =======================================================================//

// Run a clean on vendor folder and pipe in unminified versions
gulp.task('develop', function() {
  runSequence('clean','copy-dev', 'less');
});

// Run a clean on unminified code and copy dist vendor files into public vendor folder
gulp.task('release', function() {
  runSequence('clean','copy-release');
});

// =======================================================================// 
// Default task                                                           //
// =======================================================================//

// Default task sets up develoment environment
gulp.task('default', function(){
  gulp.start('develop', function() {
    console.log('All tasks complete.');
  });
});