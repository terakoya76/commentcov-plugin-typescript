// Original file: commentcov-proto/commentcov_plugin.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { MeasureCoverageIn as _commentcov_plugin_MeasureCoverageIn, MeasureCoverageIn__Output as _commentcov_plugin_MeasureCoverageIn__Output } from '../../commentcov/plugin/MeasureCoverageIn';
import type { MeasureCoverageOut as _commentcov_plugin_MeasureCoverageOut, MeasureCoverageOut__Output as _commentcov_plugin_MeasureCoverageOut__Output } from '../../commentcov/plugin/MeasureCoverageOut';

export interface CommentcovPluginClient extends grpc.Client {
  MeasureCoverage(argument: _commentcov_plugin_MeasureCoverageIn, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_commentcov_plugin_MeasureCoverageOut__Output>): grpc.ClientUnaryCall;
  MeasureCoverage(argument: _commentcov_plugin_MeasureCoverageIn, metadata: grpc.Metadata, callback: grpc.requestCallback<_commentcov_plugin_MeasureCoverageOut__Output>): grpc.ClientUnaryCall;
  MeasureCoverage(argument: _commentcov_plugin_MeasureCoverageIn, options: grpc.CallOptions, callback: grpc.requestCallback<_commentcov_plugin_MeasureCoverageOut__Output>): grpc.ClientUnaryCall;
  MeasureCoverage(argument: _commentcov_plugin_MeasureCoverageIn, callback: grpc.requestCallback<_commentcov_plugin_MeasureCoverageOut__Output>): grpc.ClientUnaryCall;
  measureCoverage(argument: _commentcov_plugin_MeasureCoverageIn, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_commentcov_plugin_MeasureCoverageOut__Output>): grpc.ClientUnaryCall;
  measureCoverage(argument: _commentcov_plugin_MeasureCoverageIn, metadata: grpc.Metadata, callback: grpc.requestCallback<_commentcov_plugin_MeasureCoverageOut__Output>): grpc.ClientUnaryCall;
  measureCoverage(argument: _commentcov_plugin_MeasureCoverageIn, options: grpc.CallOptions, callback: grpc.requestCallback<_commentcov_plugin_MeasureCoverageOut__Output>): grpc.ClientUnaryCall;
  measureCoverage(argument: _commentcov_plugin_MeasureCoverageIn, callback: grpc.requestCallback<_commentcov_plugin_MeasureCoverageOut__Output>): grpc.ClientUnaryCall;
  
}

export interface CommentcovPluginHandlers extends grpc.UntypedServiceImplementation {
  MeasureCoverage: grpc.handleUnaryCall<_commentcov_plugin_MeasureCoverageIn__Output, _commentcov_plugin_MeasureCoverageOut>;
  
}

export interface CommentcovPluginDefinition extends grpc.ServiceDefinition {
  MeasureCoverage: MethodDefinition<_commentcov_plugin_MeasureCoverageIn, _commentcov_plugin_MeasureCoverageOut, _commentcov_plugin_MeasureCoverageIn__Output, _commentcov_plugin_MeasureCoverageOut__Output>
}
