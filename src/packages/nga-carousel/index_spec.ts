/**
 * @license
 * Copyright Nga-carousel. All Right Reserved.
 *
 */
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { latestVersions } from '../../utils/latest-versions';
import { experimental } from '@angular-devkit/core';
import { moduleImports } from '../../utils/module-imports';

describe('ng add schematic', () => {
  const runnerSchematic = new SchematicTestRunner(
    '@schematics/angular',
    require.resolve('../../collection.json'),
  );

  const workspaceOptions = {
    name: 'bar',
    version: '6.0.0',
    newProjectRoot: 'projects',
  };

  const ngAddOptions = {
    name: 'bar',
  };

  it('Should create all files of a workspace', async () => {
    const tree = await runnerSchematic
      .runSchematicAsync('workspace', { ...workspaceOptions })
      .toPromise();
    const files = tree.files;

    expect(files).toEqual(
      jasmine.arrayContaining(['/angular.json', '/package.json']),
    );
  });

  let appTree: UnitTestTree;
  let packageObj: any;
  let angularObj: experimental.workspace.WorkspaceSchema;
  beforeEach(async () => {
    appTree = await runnerSchematic
      .runSchematicAsync('workspace', { ...workspaceOptions })
      .toPromise();
    appTree = await runnerSchematic
      .runSchematicAsync('ng-add', { ...ngAddOptions }, appTree)
      .toPromise();
    const packageContent = appTree.readContent('./package.json');
    packageObj = JSON.parse(packageContent);

    const angularContent = appTree.readContent('./angular.json');

    angularObj = JSON.parse(angularContent);
  });

  it('Name is valid', async () => {
    expect(packageObj.name).toEqual(ngAddOptions.name);
  });

  it('Should exists package in devDependencies', async () => {
    expect(packageObj.devDependencies['jquery']).toEqual(latestVersions.Jquery);
    expect(packageObj.devDependencies['owl.carousel']).toEqual(
      latestVersions.OwlCarousel,
    );
    expect(packageObj.devDependencies['ngx-owl-carousel']).toEqual(
      latestVersions.NgxOwlCarousel,
    );
  });

  it('Should exists module in angular.json file', async () => {
    for (const moduleImport of moduleImports.scripts) {
      expect(
        angularObj?.projects[
          ngAddOptions.name
        ]?.architect?.build?.options?.scripts.indexOf(moduleImport),
      ).not.toEqual(-1);
    }
  });
});
