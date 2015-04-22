var gulp = require('gulp');
var sass = require('gulp-sass');

var handleError = function(err) { console.log(err); if (this.emit) { this.emit('end'); }};

gulp.task('sass', function () {
  gulp.src('./public/scss/*.scss')
    .pipe(sass({onError: handleError}))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('default', ['sass']);
