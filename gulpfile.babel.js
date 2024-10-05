import gulp from "gulp";
import pug from "gulp-pug";

const routes = {
    pug:{
        src: "src/*.pug" // only compiling pug files in src file, not the ones inside src/**/*.pug/
    }
};

export const pug = () => gulp.src("routes.pug.src");

export const dev = () => console.log("I will dev");