import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { CommentcovPluginClient as _commentcov_plugin_CommentcovPluginClient, CommentcovPluginDefinition as _commentcov_plugin_CommentcovPluginDefinition } from './commentcov/plugin/CommentcovPlugin';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  commentcov: {
    plugin: {
      Block: MessageTypeDefinition
      Comment: MessageTypeDefinition
      CommentcovPlugin: SubtypeConstructor<typeof grpc.Client, _commentcov_plugin_CommentcovPluginClient> & { service: _commentcov_plugin_CommentcovPluginDefinition }
      CoverageItem: MessageTypeDefinition
      MeasureCoverageIn: MessageTypeDefinition
      MeasureCoverageOut: MessageTypeDefinition
    }
  }
}

