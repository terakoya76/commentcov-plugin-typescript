// Original file: commentcov-proto/commentcov_plugin.proto

import type { Block as _commentcov_plugin_Block, Block__Output as _commentcov_plugin_Block__Output } from '../../commentcov/plugin/Block';

export interface Comment {
  'block'?: (_commentcov_plugin_Block | null);
  'comment'?: (string);
}

export interface Comment__Output {
  'block': (_commentcov_plugin_Block__Output | null);
  'comment': (string);
}
