var gulp = require('gulp');
var sass = require('gulp-ruby-sass');

gulp.task('sass', function() {
    return sass('./statics/sass/') 
    .on('error', function (err) {
      console.error('Error!', err.message);
   })
    .pipe(gulp.dest('./statics/css/'));
});


gulp.task('default', ['sass'], function() {
});