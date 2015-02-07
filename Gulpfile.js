var gulp = require('gulp');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

var jade = require('gulp-jade');

var stylus = require('gulp-stylus');
var nib = require('nib');
var sourcemaps = require('gulp-sourcemaps');

var env = process.env.NODE_ENV || 'development';
var devDir = 'build/dev';

gulp.task('bundle', function() {
	return browserify('./src/js/main', { debug: env === 'development' }).bundle()
								.pipe(source('bundle.js'))
								.pipe(streamify(gulpif(env === 'production', uglify())))
								.pipe(gulp.dest('build/dev/js'));
});

gulp.task('jade', function() {
	return gulp.src('src/templates/*.jade')
			   .pipe(jade())
			   .pipe(gulp.dest(devDir));
});

gulp.task('stylus', function() {
	var config = {
		use: nib()
	};
	if (env === 'production') config.compress = true;
	else config.lineos = true;

	return gulp.src('src/styles/*.styl')
		       .pipe(stylus(config))
		       .pipe(sourcemaps.write())
		       .pipe(gulp.dest(devDir + '/css'));
});
