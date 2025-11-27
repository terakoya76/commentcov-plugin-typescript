import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { Block as _commentcov_plugin_Block, Block__Output as _commentcov_plugin_Block__Output } from './commentcov/plugin/Block';
import type { Comment as _commentcov_plugin_Comment, Comment__Output as _commentcov_plugin_Comment__Output } from './commentcov/plugin/Comment';
import type { CommentcovPluginClient as _commentcov_plugin_CommentcovPluginClient, CommentcovPluginDefinition as _commentcov_plugin_CommentcovPluginDefinition } from './commentcov/plugin/CommentcovPlugin';
import type { CoverageItem as _commentcov_plugin_CoverageItem, CoverageItem__Output as _commentcov_plugin_CoverageItem__Output } from './commentcov/plugin/CoverageItem';
import type { MeasureCoverageIn as _commentcov_plugin_MeasureCoverageIn, MeasureCoverageIn__Output as _commentcov_plugin_MeasureCoverageIn__Output } from './commentcov/plugin/MeasureCoverageIn';
import type { MeasureCoverageOut as _commentcov_plugin_MeasureCoverageOut, MeasureCoverageOut__Output as _commentcov_plugin_MeasureCoverageOut__Output } from './commentcov/plugin/MeasureCoverageOut';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  commentcov: {
    plugin: {
      Block: MessageTypeDefinition<_commentcov_plugin_Block, _commentcov_plugin_Block__Output>
      Comment: MessageTypeDefinition<_commentcov_plugin_Comment, _commentcov_plugin_Comment__Output>
      CommentcovPlugin: SubtypeConstructor<typeof grpc.Client, _commentcov_plugin_CommentcovPluginClient> & { service: _commentcov_plugin_CommentcovPluginDefinition }
      CoverageItem: MessageTypeDefinition<_commentcov_plugin_CoverageItem, _commentcov_plugin_CoverageItem__Output>
      MeasureCoverageIn: MessageTypeDefinition<_commentcov_plugin_MeasureCoverageIn, _commentcov_plugin_MeasureCoverageIn__Output>
      MeasureCoverageOut: MessageTypeDefinition<_commentcov_plugin_MeasureCoverageOut, _commentcov_plugin_MeasureCoverageOut__Output>
    }
  }
}

