import * as grpc from '@grpc/grpc-js';

import {
  HealthCheckResponse,
  _grpc_health_v1_HealthCheckResponse_ServingStatus,
  _grpc_health_v1_HealthCheckResponse_ServingStatus as ServingStatus,
} from '../generated/grpc/health/v1/HealthCheckResponse';
import {HealthCheckRequest} from '../generated/grpc/health/v1/HealthCheckRequest';
import {HealthHandlers} from '../generated/grpc/health/v1/Health';

/**
 * StartMap maps service and its grpc_server status.
 * @type {{[key: string]: _grpc_health_v1_HealthCheckResponse_ServingStatus}}
 */
type StatusMap = {
  [key: string]: _grpc_health_v1_HealthCheckResponse_ServingStatus;
};

/**
 * @type {StatusMap}
 */
let _statusMap: StatusMap = {};

/**
 * initStatusMap initializes StatusMap with the given statusMap.
 * @type {(StatusMap) => void}
 */
export const initStatusMap = (statusMap: StatusMap): void => {
  _statusMap = statusMap;
};

/**
 * Update statusMap.
 * @type {(string, _grpc_health_v1_HealthCheckResponse_ServingStatus) => void}
 */
const setStatus = (
  service: string,
  status: _grpc_health_v1_HealthCheckResponse_ServingStatus,
): void => {
  _statusMap[service] = status;
};

/**
 * Extract status from statusMap.
 * @type {(string) => _grpc_health_v1_HealthCheckResponse_ServingStatus}
 */
const getStatus = (
  service: string,
): _grpc_health_v1_HealthCheckResponse_ServingStatus | undefined => {
  return _statusMap[service];
};

/**
 * ErrorMap maps service and its error occuring status.
 * @type {{[key: string]: Error}}
 */
type ErrorMap = {
  [key: string]: Error;
};

/**
 * @type {ErrorMap}
 */
const _errorMap: ErrorMap = {};

/**
 * Update errorMap.
 * @type {(string, Error) => void}
 */
const setError = (service: string, err: Error): void => {
  _errorMap[service] = err;
};

/**
 * Extract error from errorMap.
 * @type {(string) => number}
 */
const getError = (service: string): Error => {
  return _errorMap[service];
};

/**
 * Implements grpc.health.v1 HealthService
 * @type {HealthHandlers}
 */
export const healthImplementation: HealthHandlers = {
  Check(
    call: grpc.ServerUnaryCall<HealthCheckRequest, HealthCheckResponse>,
    callback: grpc.sendUnaryData<HealthCheckResponse>,
  ): void {
    if (call.request && call.request.service) {
      const service = call.request.service;
      console.log(service);
      const status = getStatus(service);
      callback(null, {
        status: status,
      });
    } else {
      callback(
        {
          code: grpc.status.NOT_FOUND,
          details: '',
          metadata: new grpc.Metadata(),
        },
        undefined,
      );
    }
  },

  Watch(
    call: grpc.ServerWritableStream<HealthCheckRequest, HealthCheckResponse>,
  ): void {
    if (call.request && call.request.service) {
      const service = call.request.service;
      const interval = setInterval(() => {
        let newStatus: _grpc_health_v1_HealthCheckResponse_ServingStatus =
          ServingStatus.SERVING;
        if (getStatus(service) !== undefined) {
          newStatus = ServingStatus.SERVICE_UNKNOWN;
          setStatus(service, newStatus);
          call.write({status: newStatus});
        }

        if (getError(service) !== undefined) {
          const prevStatus = getStatus(service);
          if (prevStatus !== newStatus) {
            setStatus(service, newStatus);
            call.write({status: newStatus}, (error?: Error) => {
              if (error) {
                setError(service, error);
              }
            });
          }
        } else {
          clearInterval(interval);
          call.end(undefined);
        }
      }, 1000);
    } else {
      call.write({status: ServingStatus.SERVING});
    }
  },
};
