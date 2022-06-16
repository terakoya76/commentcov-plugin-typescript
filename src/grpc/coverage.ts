import * as grpc from '@grpc/grpc-js';
import * as path from 'path';
import * as ts from 'typescript';

import * as coverage from '../ast/coverage';
import * as visitor from '../ast/visitor';
import {CommentcovPluginHandlers} from '../generated/commentcov/plugin/CommentcovPlugin';
import {MeasureCoverageIn} from '../generated/commentcov/plugin/MeasureCoverageIn';
import {MeasureCoverageOut} from '../generated/commentcov/plugin/MeasureCoverageOut';
import {CoverageItem} from '../generated/commentcov/plugin/CoverageItem';

/**
 * Implements CommentcovPlugin.
 * @type {CommentcovPluginHandlers}
 */
export const pluginImplementation: CommentcovPluginHandlers = {
  MeasureCoverage(
    call: grpc.ServerUnaryCall<MeasureCoverageIn, MeasureCoverageOut>,
    callback: grpc.sendUnaryData<MeasureCoverageOut>
  ): void {
    if (call.request && call.request.files) {
      let coverageItems: CoverageItem[] = [];
      const program = ts.createProgram({
        options: {},
        rootNames: call.request.files,
      });

      for (const sourceFile of program.getSourceFiles()) {
        const fileName = path.resolve(sourceFile.fileName);
        if (fileName.includes('node_modules')) {
          continue;
        }

        if (visitor.isVisited(fileName)) {
          continue;
        }

        const items = coverage.fileToCoverageItems(sourceFile);
        coverageItems = [...coverageItems, ...items];
      }

      callback(null, {coverageItems: coverageItems});
    } else {
      callback(
        {
          code: grpc.status.NOT_FOUND,
          details: '',
          metadata: new grpc.Metadata(),
        },
        undefined
      );
    }
  },
};
