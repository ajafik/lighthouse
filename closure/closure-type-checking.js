#!/usr/bin/env node
/**
 * @license
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const closureCompiler = require('google-closure-compiler').gulp();
const gulp = require('gulp');
const gutil = require('gulp-util');
const replace = require('gulp-replace');

/* eslint-disable camelcase */
gulp.task('js-compile', function() {
  return gulp.src([
    'closure/typedefs/*.js',
    'closure/third_party/*.js',
    'audits/**/*.js',
    'metrics/performance/first-meaningful-paint.js'
  ])
    // TODO: hack to remove `require`s that Closure currently can't resolve.
    .pipe(replace(
        'const DevtoolsTimelineModel = require(\'devtools-timeline-model\');',
        ''))

    .pipe(closureCompiler({
      compilation_level: 'SIMPLE',
      process_common_js_modules: true,
      new_type_inf: true,
      checks_only: true,
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT5_STRICT',
      warning_level: 'VERBOSE',
      jscomp_warning: [
        // https://github.com/google/closure-compiler/wiki/Warnings
        'accessControls',
        'const',
        'visibility'
        // 'reportUnknownTypes'
      ]
    }))
    .on('end', () => {
      gutil.log('Closure compilation successful.');
    });
});
/* eslint-enable */

gulp.start('js-compile');