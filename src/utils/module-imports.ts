/**
 * @license
 * Copyright Nga-carousel. All Rights Reserved.
 *
 */
export const moduleImports = {
  scripts: [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/owl.carousel/dist/owl.carousel.js',
  ],
  styles: [
    './node_modules/owl.carousel/dist/assets/owl.carousel.css',
    './node_modules/owl.carousel/dist/assets/owl.theme.default.css',
  ],
};

export const existsModuleImport = (
  modules: string[],
  modulesImport: string,
): boolean | undefined => {
  return modules.indexOf(modulesImport) !== -1 ? true : false;
};
