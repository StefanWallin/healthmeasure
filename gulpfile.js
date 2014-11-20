'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var manifest = require('gulp-manifest');
var rev = require('gulp-rev');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var minifyHtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var revCollector = require('gulp-rev-collector');

var getOutputFilename = function (fileName) {
	var version = 0.1;
	var name = 'hm';
	return fileName + '.' + version + '.min';
};

var distJS = function(files, fileName) {
	return gulp.src(files)
	// Add transformation tasks to the pipeline here.
	.pipe(concat(getOutputFilename(fileName + '.js') ))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(rev())
	.pipe(gulp.dest(outputFolder + 'js/'))
	.pipe(rev.manifest())
	.pipe(gulp.dest('rev/js'));
};

var rootFolder = __dirname;
var bower = rootFolder + '/bower_components/';
var app = rootFolder +  '/js/';
var outputFolder = rootFolder + '/dist/';
var fullUriBase = 'https://xn--hlsomtt-5wan.se/';


var partials = rootFolder + '/partials/*.htm*';
var documents = rootFolder + '/*.htm*';
var css = rootFolder + '/css/*.css*';
var libs = [
	bower + 'jquery/dist/jquery.js',
	bower + 'angular/angular.js',
	bower + 'angular-route/angular-route.js',
	bower + 'angular-animate/angular-animate.js',
	bower + 'moment/moment.js',
	bower + 'moment/locale/sv.js',
];

var app = [
	app + 'cordova.js',
	app + 'index.js',
	app + 'translation.js',
	app + 'settings.js',
	app + 'activities.js',
	app + 'initialize.js'
];

var dropboxAuth = [
	bower + 'jStorage/jStorage.js',
	bower + 'jStorage/jStorage.dropbox.js',
];

gulp.task('default', ['deploy'], function () {
	return;
});
gulp.task('deploy', ['manifest'], function() {
	return;
});
gulp.task('manifest', ['dist'], function() {
	var outputs = gulp.src(outputFolder + '**')
	.pipe(manifest({
		hash: true,
		timestamp: false,
		preferOnline: false,
		network: ['*'],
		cache: [
			'https://xn--hlsomtt-5wan.se/',
			'https://xn--hlsomtt-5wan.se/js/plugins/org.apache.cordova.vibration/www/vibration.js'
		],
		filename: 'app.manifest',
		exclude: [rootFolder + '/manifest/app.manifest']
	}))
	.pipe(gulp.dest(rootFolder + '/manifest'));
});

gulp.task('dist', [
	'dist-js-app',
	'dist-js-dropbox_auth',
	'dist-css-bundle',
	'dist-html-documents',
	'dist-html-partials'
	], function(){
	return;
});

/* JS */
gulp.task('dist-js-app', function() {
	var files = libs.concat(app);
	return distJS(files, 'app');
});
gulp.task('dist-js-dropbox_auth', function() {
	return distJS(dropboxAuth, 'dropbox_auth');
});

/* CSS */
gulp.task('dist-css-bundle', function() {
	return gulp.src(css)
	// Add transformation tasks to the pipeline here.
	.pipe(concat(getOutputFilename('app') + '.css'))
	.pipe(autoprefixer())
	.pipe(minifyCss())
	.pipe(rev())
	.pipe(gulp.dest(outputFolder + 'css/'));
});

/* HTML */
gulp.task('dist-html-documents', function() {
	return gulp.src(documents)
	.pipe(minifyHtml())
	.pipe(revCollector())
	.pipe(rev())
	.pipe(gulp.dest(outputFolder));
});
gulp.task('dist-html-partials', function() {
	return gulp.src(partials)
	.pipe(minifyHtml())
	.pipe(rev())
	.pipe(gulp.dest(outputFolder + "partials/")); 
});
