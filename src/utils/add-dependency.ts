/**
 * @license
 * Copyright Nga-carousel. All Rights Reserved.
 *
 */
import { Package } from '../packages/nga-carousel/package';

/**
 * Import new name package to dependecies of package.json file.
 *
 *
 * @param packageObj (content of package.json file)
 * @param dependencies (dependency need add to package.json file)
 *
 * @return {Package}
 *
 *
 * @public
 */
export const addDependencies = (
  packageObj: Package,
  dependencies: { name: string; version: string }[],
): Package => {
  // loop dependencies
  for (const depend of dependencies) {
    if (packageObj.dependencies.hasOwnProperty(depend.name)) {
      delete packageObj.dependencies[depend.name];
    }
    if (packageObj.devDependencies.hasOwnProperty(depend.name)) {
      delete packageObj.devDependencies[depend.name];
    }
    packageObj.devDependencies[depend.name] = depend.version;
  }

  return packageObj;
};
