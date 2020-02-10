/**
 * @license
 * Copyright Goolge Inc. All Rights Reserved.
 *
 *  Using with purpose testing.
 *  @see https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/workspace/index.ts
 *
 */
import { strings } from '@angular-devkit/core';
import {
  Rule,
  apply,
  applyTemplates,
  filter,
  mergeWith,
  noop,
  url,
} from '@angular-devkit/schematics';
import { latestVersions } from '../../utils/latest-versions';
import { Schema as WorkspaceOptions } from './schema';

export default function(options: WorkspaceOptions): Rule {
  const minimalFilesRegExp = /(.editorconfig|tslint.json)\.template$/;

  return mergeWith(
    apply(url('./files'), [
      options.minimal ? filter(path => !minimalFilesRegExp.test(path)) : noop(),
      applyTemplates({
        utils: strings,
        ...options,
        dot: '.',
        latestVersions,
      }),
    ]),
  );
}
