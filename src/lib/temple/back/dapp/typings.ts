export type ExtensionMessage = ExtensionRequest | ExtensionResponse;

export type ExtensionRequest =
  | ExtensionGetCurrentPermissionRequest
  | ExtensionPermissionRequest
  // | ExtensionOperationRequest
  | ExtensionSignRequest;
// | ExtensionBroadcastRequest;

export type ExtensionResponse =
  | ExtensionGetCurrentPermissionResponse
  | ExtensionPermissionResponse
  // | ExtensionOperationResponse
  | ExtensionSignResponse;
// | ExtensionBroadcastResponse;

export interface ExtensionMessageBase {
  type: ExtensionMessageType;
}

export enum ExtensionMessageType {
  GetCurrentPermissionRequest = 'GET_CURRENT_PERMISSION_REQUEST',
  GetCurrentPermissionResponse = 'GET_CURRENT_PERMISSION_RESPONSE',
  PermissionRequest = 'PERMISSION_REQUEST',
  PermissionResponse = 'PERMISSION_RESPONSE',
  OperationRequest = 'OPERATION_REQUEST',
  OperationResponse = 'OPERATION_RESPONSE',
  SignRequest = 'SIGN_REQUEST',
  SignResponse = 'SIGN_RESPONSE',
  BroadcastRequest = 'BROADCAST_REQUEST',
  BroadcastResponse = 'BROADCAST_RESPONSE'
}

/**
 * Messages
 */

export interface ExtensionGetCurrentPermissionRequest extends ExtensionMessageBase {
  type: ExtensionMessageType.GetCurrentPermissionRequest;
}

export interface ExtensionGetCurrentPermissionResponse extends ExtensionMessageBase {
  type: ExtensionMessageType.GetCurrentPermissionResponse;
  permission: ExtensionPermission;
}

export interface ExtensionPermissionRequest extends ExtensionMessageBase {
  type: ExtensionMessageType.PermissionRequest;
  network: ExtensionNetwork;
  appMeta: ExtensionDAppMetadata;
  force?: boolean;
}

export interface ExtensionPermissionResponse extends ExtensionMessageBase {
  type: ExtensionMessageType.PermissionResponse;
  pkh: string;
  publicKey: string;
  rpc: string;
}

// export interface ExtensionOperationRequest extends ExtensionMessageBase {
//   type: ExtensionMessageType.OperationRequest;
//   sourcePkh: string;
//   opParams: any[];
// }
//
// export interface ExtensionOperationResponse extends ExtensionMessageBase {
//   type: ExtensionMessageType.OperationResponse;
//   opHash: string;
// }

export interface ExtensionSignRequest extends ExtensionMessageBase {
  type: ExtensionMessageType.SignRequest;
  sourcePkh: string;
  payload: string;
}

export interface ExtensionSignResponse extends ExtensionMessageBase {
  type: ExtensionMessageType.SignResponse;
  transactionId: string;
  fullHash: string;
}

// export interface ExtensionBroadcastRequest extends ExtensionMessageBase {
//   type: ExtensionMessageType.BroadcastRequest;
//   signedOpBytes: string;
// }
//
// export interface ExtensionBroadcastResponse extends ExtensionMessageBase {
//   type: ExtensionMessageType.BroadcastResponse;
//   opHash: string;
// }

export enum ExtensionErrorType {
  NotGranted = 'NOT_GRANTED',
  NotFound = 'NOT_FOUND',
  InvalidParams = 'INVALID_PARAMS',
  Operation = 'OPERATION'
}

export type ExtensionPermission = {
  rpc: string;
  pkh: string;
  publicKey: string;
} | null;

export type ExtensionSigned = {
  transactionId: string;
  fullHash: string;
} | null;

export type ExtensionNetwork = string | { name: string; rpc: string };

export interface ExtensionDAppMetadata {
  name: string;
}

export interface PageMessage {
  type: PageMessageType;
  payload: any;
  reqId?: string | number;
}

export enum PageMessageType {
  Request = 'SIGNUM_PAGE_REQUEST',
  Response = 'SIGNUM_PAGE_RESPONSE',
  ErrorResponse = 'SIGNUM_PAGE_ERROR_RESPONSE'
}
