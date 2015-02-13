var gulp = require('gulp');

var jade = require('gulp-jade');

var stylus = require('gulp-stylus');
var nib = require('nib');
var sourcemaps = require('gulp-sourcemaps');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

var mocha = require('gulp-mocha');

var connect = require('gulp-connect');

var env = process.env.NODE_ENV || 'development';
var devDir = 'build/dev';

gulp.task('jade', function() {
	return gulp.src('src/templates/**/*.jade')
			   .pipe(jade())
			   .pipe(gulp.dest(devDir))
			   .pipe(connect.reload());
});

gulp.task('stylus', function() {
	var config = {
		use: nib()
	};
	if (env === 'production') config.compress = true;
	else config.lineos = true;

	return gulp.src('src/styles/**/*.styl')
		       .pipe(stylus(config))
		       .pipe(sourcemaps.write())
		       .pipe(gulp.dest(devDir + '/css'))
		       .pipe(connect.reload());
});

gulp.task('bundle', function() {
	return browserify('./src/js/main', { debug: env === 'development' }).bundle()
								.pipe(source('bundle.js'))
								.pipe(streamify(gulpif(env === 'production', uglify())))
								.pipe(gulp.dest(devDir + '/js'))
								.pipe(connect.reload());
});

gulp.task('test', function () {
    return gulp.src('src/tests/test.js', {read: false})
			   .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('watch', function() {
	gulp.watch('src/templates/**/*.jade', ['jade']);
	gulp.watch('src/styles/**/*.styl', ['stylus']);
	gulp.watch('src/js/**/*.js', ['bundle']);
	gulp.watch('src/tests/**/*.js', ['test']);
});

gulp.task('connect', function() {
	var port = 8080;

	connect.server({
		root: [devDir],
		port: port,
		livereload: true
	});
});

gulp.task('default', ['jade', 'stylus', 'bundle', 'watch', 'connect']);
