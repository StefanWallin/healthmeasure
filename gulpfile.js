'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var manifest = require('gulp-manifest');
var revall = require('gulp-rev-all');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var minifyHtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var path =  require('path');

var distJS = function(files, fileName) {
  return gulp.src(files)
  // Add transformation tasks to the pipeline here.
  .pipe(concat(fileName + '.js'))
  .pipe(ngAnnotate())
  .pipe(uglify())
  .pipe(gulp.dest(outputFolder + 'js/'));
};

var rootFolder = __dirname;
var bower = rootFolder + '/bower_components/';
var app = rootFolder +  '/js/';
var outputFolder = rootFolder + '/dist/';
var fullUriBase = 'https://xn--hlsomtt-5wan.se/';


var partials = rootFolder + '/partials/*.htm*';
var documents = rootFolder + '/*.htm*';
var css = rootFolder + '/css/*.css*';
var cordova = app + 'cordova*.js';
var cordova_plugins = app + 'plugins/**';
var libs = [
  bower + 'jquery/dist/jquery.js',
  bower + 'angular/angular.js',
  bower + 'angular-route/angular-route.js',
  bower + 'angular-animate/angular-animate.js',
  bower + 'moment/moment.js',
  bower + 'moment/locale/sv.js',
];

var app = [
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
  return gulp.src(rootFolder + '/cdn/**')
  .pipe(manifest({
    hash: true,
    timestamp: false,
    preferOnline: false,
    network: ['*'],
    cache: [
      '/',
      '/js/plugins/org.apache.cordova.vibration/www/vibration.js'
    ],
    filename: 'healthmeasure.appcache',
    exclude: [rootFolder + '/cdn/healthmeasure.appcache']
  }))
  .pipe(gulp.dest(rootFolder + '/cdn'));
});

gulp.task('dist', [
  'dist-js-app',
  'dist-js-dropbox_auth',
  'dist-js-cordova',
  'dist-js-cordova_plugins',
  'dist-css-bundle',
  'dist-html-documents',
  'dist-html-partials'
  ], function(){
  return gulp.src(rootFolder + '/dist/**')
    .pipe(revall({
      ignore: [/^\/index.html/g, /^\/js\/cordova*/g],
      transformFilename: function (file, hash) {
        var ext = path.extname(file.path);
        return path.basename(file.path, ext) + '.rev' + hash.substr(0, 5) + ext;
      }
    }))
    .pipe(gulp.dest(rootFolder + '/cdn'))
    .pipe(revall.manifest({ fileName: 'manifest.json' }))
    .pipe(gulp.dest(rootFolder + '/cdn'));
});

/* JS */
gulp.task('dist-js-app', function() {
  var files = libs.concat(app);
  return distJS(files, 'app');
});
gulp.task('dist-js-dropbox_auth', function() {
  return distJS(dropboxAuth, 'dropbox_auth');
});
gulp.task('dist-js-cordova', function() {
  return gulp.src(cordova)
  .pipe(uglify())
  .pipe(gulp.dest(outputFolder + 'js/'));
});
gulp.task('dist-js-cordova_plugins', function() {
  return gulp.src(cordova_plugins)
  .pipe(uglify())
  .pipe(gulp.dest(outputFolder + 'js/plugins/'));
});

/* CSS */
gulp.task('dist-css-bundle', function() {
  return gulp.src(css)
  // Add transformation tasks to the pipeline here.
  .pipe(concat('app.css'))
  // .pipe(autoprefixer())
  // .pipe(minifyCss())
  .pipe(gulp.dest(outputFolder + 'css/'));
});

/* HTML */
gulp.task('dist-html-documents', function() {
  return gulp.src(documents)
  // .pipe(minifyHtml())
  .pipe(gulp.dest(outputFolder));
});
gulp.task('dist-html-partials', function() {
  return gulp.src(partials)
  // .pipe(minifyHtml())
  .pipe(gulp.dest(outputFolder + "partials/")); 
});
