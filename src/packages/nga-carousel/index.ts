/**
 * @license
 * Copyright Nga-carousel. All Rights Reserved.
 *
 */

import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  SchematicsException,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Package } from './package';
import { experimental } from '@angular-devkit/core';
import { latestVersions } from '../../utils/latest-versions';
import { moduleImports, existsModuleImport } from '../../utils/module-imports';
import { addDependencies } from '../../utils/add-dependency';
/**
 *
 * @param _options
 *
 *
 * @example
 *
 * const recoder = host.beginUpdate(options.path);
 * recoder.insertLeft(100, 'test');
 * host.commitUpdate(recoder);
 *
 *
 */
export default function(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      updatePackageJson('package.json'),
      updateAngularJson('angular.json'),
      installDependencies(),
    ])(tree, _context);
  };
}

function updatePackageJson(path: string): Rule {
  return (host: Tree) => {
    const packageBuf = host.read(path);
    if (!packageBuf) {
      throw new SchematicsException('Cound not find file package.json');
    }
    const packageContent = packageBuf.toString();
    const packageObj: Package = JSON.parse(packageContent);
    addDependencies(packageObj, [
      { name: 'jquery', version: latestVersions.Jquery },
      { name: 'owl.carousel', version: latestVersions.OwlCarousel },
      { name: 'ngx-owl-carousel', version: latestVersions.NgxOwlCarousel },
    ]);
    host.overwrite(path, JSON.stringify(packageObj, null, '\t'));
    return host;
  };
}

function updateAngularJson(path: string) {
  return (host: Tree) => {
    const workspaceConfigBuf = host.read(path);
    if (!workspaceConfigBuf) {
      throw new SchematicsException('Cound not find file angular.json');
    }
    const workspaceContent = workspaceConfigBuf.toString();

    const workspaceObject: experimental.workspace.WorkspaceSchema = JSON.parse(
      workspaceContent,
    );

    const projectName: string | undefined = workspaceObject.defaultProject;

    if (!projectName) {
      throw new SchematicsException('Cound not find default name of project');
    }

    const workspaceOptions =
      workspaceObject?.projects[projectName]?.architect?.build?.options;

    if (!workspaceOptions) {
      throw new SchematicsException(
        'Cound not find property options in angular.json file',
      );
    }

    for (const script of moduleImports.scripts) {
      if (!existsModuleImport(workspaceOptions.scripts, script)) {
        workspaceOptions.scripts.push(script);
      }
    }

    for (const style of moduleImports.styles) {
      if (!existsModuleImport(workspaceOptions.styles, style)) {
        workspaceOptions.styles.push(style);
      }
    }

    host.overwrite(path, JSON.stringify(workspaceObject, null, '\t'));
    return host;
  };
}

function installDependencies() {
  return (host: Tree, _context: SchematicContext) => {
    _context.addTask(new NodePackageInstallTask());
    return host;
  };
}
