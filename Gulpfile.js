var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if'); // to get source maps in development
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');

var env = process.env.NODE_ENV || 'development';

gulp.task('bundle', function() {
	return browserify('./src/js/main', { debug: env === 'development' }).bundle()
								.pipe(source('bundle.js'))
								.pipe(streamify(gulpif(env === 'production', uglify())))
								.pipe(gulp.dest('build/dev/js'));
});

gulp.task('jade', function() {
	return gulp.src('src/templates/*.jade')
			   .pipe(jade())
			   .pipe(gulp.dest('build/dev'));
});

gulp.task('stylus', function() {
	return gulp.src('src/styles/*.styl')
		       .pipe(stylus())
		       .pipe(gulp.dest('build/dev/css'));
});
