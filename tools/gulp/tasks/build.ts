import { createProject } from 'gulp-typescript';
import { dest, task } from 'gulp';
import { source } from '../config';
const build = createProject('tsconfig.json');

function buildPackage() {
  return build
    .src()
    .pipe(build())
    .pipe(dest(source));
}

task('build', buildPackage);
