var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

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

gulp.task('sass', ['clean'], function () {
  gulp.src(paths.dev.scss)
    .pipe(sass({onError: handleError}))
    .pipe(minifyCss())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(paths.build.css));
});

gulp.task('watch', function() {
  // gulp.watch(paths.scripts, ['scripts']);
  // gulp.watch(paths.images, ['images']);
  gulp.watch(paths.dev.scss, ['sass']);
});



gulp.task('default', ['watch', 'sass'], function() {
  console.log('\nbuild succeeded!\n');
});
