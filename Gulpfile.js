var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var jade = require('gulp-jade');

gulp.task('bundle', function() {
	return browserify('./src/js/main', { debug: true }).bundle()
								.pipe(source('bundle.js'))
								.pipe(streamify(uglify()))
								.pipe(gulp.dest('build/dev/js'));
});

gulp.task('jade', function () {
	return gulp.src('src/templates/*.jade')
			   .pipe(jade())
			   .pipe(gulp.dest('build/dev'));
});
