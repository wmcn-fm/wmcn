var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify')

var paths = {
  dev: {
    scripts: 'public/javascripts/*.js',
    scss: 'public/scss/*.scss',
    images: 'public/images'
  },
  build: {
    js: 'public/build/js',
    css: 'public/build/css',
    images: 'public/build/images'
  }

}

var handleError = function(err) { console.log(err); if (this.emit) { this.emit('end'); }};

gulp.task('clean', function(cb) {
  del([paths.build.js, paths.build.css, paths.build.images], cb);
});

gulp.task('sass', function () {
  del([paths.build.css], function(err) {
    if (err) handleError;
    gulp.src(paths.dev.scss)
      .pipe(sass({onError: handleError}))
      .pipe(concat('style.css'))
      .pipe(minifyCss())
      .pipe(rename({extname: '.min.css'}))
      .pipe(gulp.dest(paths.build.css));
  });
});

gulp.task('js', ['browserify'], function () {
  del([paths.build.js, '!public/build/js/bundle.min.js'], function(err) {
    if (err) handleError(err);
    gulp.src([paths.dev.scripts, '!public/javascripts/has_require.js'])
      .pipe(concat('scripts.js'))
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest(paths.build.js));
  });
});

gulp.task('browserify', function() {
  del('public/build/js/bundle.min.js', function(err) {
    if (err) handleError(err);
    gulp.src('public/javascripts/has_require.js')
      .pipe(browserify())
      .pipe(uglify() )
      .pipe(rename('bundle.min.js'))
      .pipe(gulp.dest(paths.build.js));
  })

})

gulp.task('watch', function() {
  gulp.watch(paths.dev.scripts, ['js']);
  // gulp.watch(paths.images, ['images']);
  gulp.watch(paths.dev.scss, ['sass']);
});


gulp.task('build', ['sass', 'js'], function () {
  console.log('\nbuild succeeded!\n');
});


gulp.task('default', ['watch', 'build'], function() {
  console.log('starting gulp');
});
