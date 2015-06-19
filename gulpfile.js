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
var path = require('./path.config.js');

// =======================================================================// 
// Individual tasks                                                       //
// =======================================================================//

// Compile less
gulp.task('less', function() {
  return gulp.src(path.CSS + 'style.less')
  .pipe(less())
  .pipe(gulp.dest(path.CSS));
});

// Watch less files for changes
gulp.task('watch-less', function() {
  return gulp.watch(path.CSS + '*.less', ['less']);
});

// Minify css
gulp.task('minify-css', function() {
  return gulp.src(path.CSS + 'style.css')
  .pipe(minifyCSS())
  .pipe(gulp.dest(path.CSS));
});

// Copy unminified vendor files from node_modules to public vendor folder
gulp.task('dev-copy', function() {
  return gulp.src([path.ANGULAR + '/angular.js', path.ANGULAR + '-route/angular-route.js', path.ANGULAR + '-resource/angular-resource.js', path.BOOTSTRAP + '.css'])
  .pipe(gulp.dest(path.VENDOR));
});

// Copy minified vendor files from node_modules to public vendor folder
gulp.task('release-copy', function() {
  return gulp.src([path.ANGULAR + '/angular.min.js', path.ANGULAR + '-route/angular-route.min.js', path.ANGULAR + '-resource/angular-resource.min.js',  path.BOOTSTRAP + '.min.css'])
  .pipe(gulp.dest(path.VENDOR));
});

// Inject references to vendor files into jade templates

gulp.task('js-vendor-reference', function () {
  var target = gulp.src(path.SVR_INCLUDES + 'scripts.jade');
  var sources = gulp.src(path.VENDOR + '*.js').pipe(angularFilesort());
  return target.pipe(inject(sources, { ignorePath: 'public',  }))
    .pipe(gulp.dest(path.SVR_INCLUDES));
});

gulp.task('css-vendor-reference', function () {
  var target = gulp.src(path.SVR_INCLUDES + 'layout.jade');
  var sources = gulp.src(path.VENDOR + '*.css'); 
  return target.pipe(inject(sources, { ignorePath: 'public',  }))
    .pipe(gulp.dest(path.SVR_INCLUDES));
});

// Delete vendor folder and contents
gulp.task('clean', function() {
  return gulp.src(path.VENDOR, { read: false })
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