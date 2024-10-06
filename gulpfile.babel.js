import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del"; 
import ws from "gulp-webserver";
import image from "gulp-image";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoPrefixer from 'gulp-autoprefixer'; // compatibility of old browsers
import miniCSS from 'gulp-csso';
import bro from 'gulp-bro'; // helps browser understand node.js modules
import babel from 'babelify'; // babel converts modern javascript into backward-compatible JS code 
                            // so it can run on older engines. Developers get to enjoy the newest syntax.


const sass = gulpSass(dartSass);
 
const routes = {
    pug:{
        watch: "src/**/*.pug", // watch ALL the files
        src: "src/*.pug", // only compiling pug files in src file, not the ones inside src/**/*.pug/
        dest: "build"
    },
    img:{
        src: "src/img/*",
        dest: "build/img"
    },
    scss:{
        watch: "src/scss/**/*.scss",
        src: "src/scss/style.scss",
        dest: "build/css"
    },
    js:{
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "build/js"
    }
};

const pug = () => 
    gulp
        .src(routes.pug.src)  //compile pug file
        .pipe(gpug())
        .pipe(gulp.dest(routes.pug.dest));


const clean = () => del(["build"]);

const webserver = () =>  gulp.src("build").pipe(ws({livereload: true, open: true }));

const img = () => 
    gulp
        .src(routes.img.src)
        .pipe(image())
        .pipe(gulp.dest(routes.img.dest));

const styles = () => 
    gulp
        .src(routes.scss.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer())
        .pipe(miniCSS())
        .pipe(gulp.dest(routes.scss.dest)); // files starting with _ are used but not compiled


const js = () => 
    gulp
        .src(routes.js.src)
        .pipe(bro({
            transform: [
              babel.configure({ presets: ['@babel/preset-env'] }), // smart preset that choosees the latest JS
              [ 'uglifyify', { global: true } ]
            ]
          }))
        .pipe(gulp.dest(routes.js.dest));          

const watch = () => {
    gulp.watch(routes.pug.watch, pug); // watch the directory and perform pug
    gulp.watch(routes.img.src, img); // be wise, watching images can take much time
    gulp.watch(routes.scss.watch, styles); // call styles if something changes.
    gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]); //optimizing images could take time, so process it early
const assets = gulp.series([pug, styles, js]);
const postDev = gulp.parallel([webserver, watch]); // when there are more than one task, use parallel

export const dev = gulp.series([prepare, assets, postDev]);