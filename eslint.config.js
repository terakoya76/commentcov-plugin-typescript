'use strict';

module.exports = [
  ...require('gts'),
  {
    rules: {
      'n/no-unpublished-import': 'off',
    },
  },
  {
    ignores: [
      'bin/',
      'build/',
      'docs/',
      'node_modules/',
      'src/generated/',
      'jest.config.js',
    ],
  },
];
