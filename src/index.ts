import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import wrapServerWithReflection from 'grpc-node-server-reflection';
import path from 'path';

import {
  CommentcovPluginProtoGrpcType,
  HealthProtoGrpcType,
  ServingStatus,
  initStatusMap,
  healthImplementation,
  pluginImplementation,
  sleep,
} from './module';

/**
 * root path of the project.
 * @type {string}
 */
const rootPath = path.resolve(__dirname, '..');

/**
 * HealthCheck Service Definition.
 * @type {grpc.GrpcObject}
 */
const healthProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(rootPath + '/grpc.health.v1/health.proto')
) as unknown as HealthProtoGrpcType;

initStatusMap({
  plugin: ServingStatus.SERVING,
});

/**
 * CommentcovPlugin Service Definition.
 * @type {grpc.GrpcObject}
 */
const commentcovPluginProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(rootPath + '/commentcov-proto/commentcov_plugin.proto')
) as unknown as CommentcovPluginProtoGrpcType;

/**
 * gRPC Server.
 * @type {grpc.Server}
 */
const s = wrapServerWithReflection(new grpc.Server());
s.addService(healthProto.grpc.health.v1.Health.service, healthImplementation);
s.addService(
  commentcovPluginProto.commentcov.plugin.CommentcovPlugin.service,
  pluginImplementation
);

s.bindAsync(
  '127.0.0.1:0',
  grpc.ServerCredentials.createInsecure(),
  (err: Error | null, port: number) => {
    if (err) {
      console.error(`Server error: ${err.message}`);
    } else {
      s.start();

      // handshake info for hashicorp/go-plugin
      // cf. https://github.com/hashicorp/go-plugin/blob/master/docs/guide-plugin-write-non-go.md#4-output-handshake-information
      console.log(`1|1|tcp|127.0.0.1:${port}|grpc`);

      // SIGINT Handler
      process.on('SIGINT', () => {
        console.log('Caught interrupt signal');
        // eslint-disable-next-line n/no-process-exit
        process.exit(1);
      });

      // Infinite loop until got SIGINT.
      setInterval(() => {
        sleep(1);
      }, 0);
    }
  }
);
