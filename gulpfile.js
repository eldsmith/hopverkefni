require('dotenv').config();

var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  browserSync = require('browser-sync').create();

gulp.task('css', ()=>{
  return gulp.src(['./src/css/**/*.css'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.cssmin())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.concat('main.css'))
    .pipe(plugins.rename({
            suffix: '.min'
        }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('js', ()=>{
  return gulp.src(['./src/js/**/*.js'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({
            suffix: '.min'
        }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./public/js'));
});

// watch for file changes and run tasks
gulp.task('watch', ()=>{
  gulp.watch(['./src/**/*.css'], ['css']);
  gulp.watch(['./src/**/*.js'], ['js']);
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
