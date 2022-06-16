// Original file: commentcov-proto/commentcov_plugin.proto

import type { Block as _commentcov_plugin_Block, Block__Output as _commentcov_plugin_Block__Output } from '../../commentcov/plugin/Block';
import type { Comment as _commentcov_plugin_Comment, Comment__Output as _commentcov_plugin_Comment__Output } from '../../commentcov/plugin/Comment';

// Original file: commentcov-proto/commentcov_plugin.proto

export enum _commentcov_plugin_CoverageItem_Scope {
  UNKNOWN = 0,
  FILE = 1,
  PUBLIC_MODULE = 2,
  PRIVATE_MODULE = 3,
  PUBLIC_CLASS = 4,
  PRIVATE_CLASS = 5,
  PUBLIC_TYPE = 6,
  PRIVATE_TYPE = 7,
  PUBLIC_FUNCTION = 8,
  PRIVATE_FUNCTION = 9,
  PUBLIC_VARIABLE = 10,
  PRIVATE_VARIABLE = 11,
}

export interface CoverageItem {
  'scope'?: (_commentcov_plugin_CoverageItem_Scope | keyof typeof _commentcov_plugin_CoverageItem_Scope);
  'targetBlock'?: (_commentcov_plugin_Block | null);
  'file'?: (string);
  'identifier'?: (string);
  'extension'?: (string);
  'headerComments'?: (_commentcov_plugin_Comment)[];
  'inlineComments'?: (_commentcov_plugin_Comment)[];
}

export interface CoverageItem__Output {
  'scope': (_commentcov_plugin_CoverageItem_Scope);
  'targetBlock': (_commentcov_plugin_Block__Output | null);
  'file': (string);
  'identifier': (string);
  'extension': (string);
  'headerComments': (_commentcov_plugin_Comment__Output)[];
  'inlineComments': (_commentcov_plugin_Comment__Output)[];
}
