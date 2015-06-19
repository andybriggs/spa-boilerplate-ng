// =======================================================================// 
// Load plugins                                                           //
// =======================================================================// 

var gulp = require('gulp');
var less = require('gulp-less');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var nodemon = require('gulp-nodemon');
var minifyCSS = require('gulp-minify-css');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');


// =======================================================================// 
// Individual tasks                                                       //
// =======================================================================//

// Compile less
gulp.task('less', function() {
  return gulp.src('./public/css/style.less')
  .pipe(less())
  .pipe(gulp.dest('./public/css/'));
});

// Watch less files for changes
gulp.task('watch-less', function() {
  return gulp.watch('./public/css/*.less', ['less']);
});

// Minify css
gulp.task('minify-css', function() {
  return gulp.src('./public/css/style.css')
  .pipe(minifyCSS())
  .pipe(gulp.dest('./public/css/'));
});

// Copy unminified vendor files from node_modules to public vendor folder
gulp.task('dev-copy', function() {
  return gulp.src(['./node_modules/angular/angular.js','./node_modules/angular-route/angular-route.js','./node_modules/angular-resource/angular-resource.js','./node_modules/bootstrap/dist/css/bootstrap.css'])
  .pipe(gulp.dest('./public/vendor/'));
});

// Copy minified vendor files from node_modules to public vendor folder
gulp.task('release-copy', function() {
  return gulp.src(['./node_modules/angular/angular.min.js', './node_modules/angular-route/angular-route.min.js','./node_modules/angular-resource/angular-resource.min.js', './node_modules/bootstrap/dist/css/bootstrap.min.css'])
  .pipe(gulp.dest('./public/vendor/'));
});

// Inject references to vendor files into jade templates

gulp.task('js-vendor-reference', function () {
  var target = gulp.src('./server/includes/scripts.jade');
  var sources = gulp.src('./public/vendor/*.js').pipe(angularFilesort());
  return target.pipe(inject(sources, { ignorePath: 'public',  }))
    .pipe(gulp.dest('./server/includes/'));
});

gulp.task('css-vendor-reference', function () {
  var target = gulp.src('./server/includes/layout.jade');
  var sources = gulp.src('./public/vendor/*.css'); 
  return target.pipe(inject(sources, { ignorePath: 'public',  }))
    .pipe(gulp.dest('./server/includes/'));
});

// Delete vendor folder and contents
gulp.task('clean', function() {
  return gulp.src('./public/vendor', { read: false })
  .pipe(clean());
});

// Use nodemon to watch for dev updates
gulp.task('start', function() {
  return nodemon({ 
    script: 'server.js', 
    ext: 'js html', 
    env: { 'NODE_ENV': 'development' }
  });
});

// =======================================================================// 
// Build tasks                                                            //
// =======================================================================//

// Run a clean on vendor folder and pipe in unminified versions
gulp.task('develop', function() {
  runSequence('clean','dev-copy', 'css-vendor-reference', 'js-vendor-reference', 'less');
});

// Run a clean on unminified code and copy dist vendor files into public vendor folder
gulp.task('release', function() {
  runSequence('clean','release-copy', 'css-vendor-reference', 'js-vendor-reference', 'minify-css');
});

// =======================================================================// 
// Default task                                                           //
// =======================================================================//

// Default task sets up develoment environment
gulp.task('default', function(){
  gulp.start('develop', 'start', 'watch-less', function() {
    console.log('All tasks complete. Nodemon watching server, less watch running...');
  });
});