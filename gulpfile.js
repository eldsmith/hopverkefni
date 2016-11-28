require('dotenv').config();

var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  browserSync = require('browser-sync').create();

gulp.task('css', ()=>{
  return gulp.src(['./src/css/main.css'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.cssmin())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.rename({
            suffix: '.min'
        }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('js', ()=>{
  return gulp.src(['./src/js/main.js'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify())
    .pipe(plugins.rename({
            suffix: '.min'
        }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./public/js'));
});

// watch for file changes and run tasks
gulp.task('watch', ()=>{
  gulp.watch(['./src/css/*.css'], ['css']);
  gulp.watch(['./src/js/*.js'], ['js']);
});

gulp.task('browser-sync', ()=>{
  browserSync.init({
      proxy: "http://localhost:" + (process.env.PORT || 5000),
      files: ["public/**/*.*"]
  });
});

gulp.task('nodemon', (cb)=>{
  var started = false;

	return plugins.nodemon({
		script: 'main.js',
    ignore: ['gulpfile.js', './src', './public']
	}).on('start', ()=>{
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('default', ['css', 'js', 'watch', 'nodemon', 'browser-sync']);
