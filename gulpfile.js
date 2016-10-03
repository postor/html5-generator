var gulp = require('gulp');

gulp.task('sass', function() {
    var sass = require('gulp-ruby-sass');
    return sass('./statics/sass/') 
    .on('error', function (err) {
      console.error('Error!', err.message);
   })
    .pipe(gulp.dest('./statics/css/'));
});

gulp.task('js-min', function() {
    var uglify = require('gulp-uglify');    
    var rename = require('gulp-rename');

    return gulp.src([
        './statics/bower_components/iscroll/build/iscroll.js',
        './statics/js/view.js',
    ])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(function(file) {
        return file.base;
    }));
});


gulp.task('js-concat',['js-min'], function() {
    var concat = require('gulp-concat');
    return gulp.src([
        './statics/bower_components/zepto/zepto.min.js',
        './statics/bower_components/iscroll/build/iscroll.min.js',
        './statics/js/view.min.js'
    ])
    .pipe(concat('view-all.js'))
    .pipe(gulp.dest('./statics/js/'));
});

gulp.task('default', ['sass','js-concat'], function() {
});