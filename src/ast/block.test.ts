import {isEqual} from './block';

describe('isEqual', () => {
  test('equal', () => {
    const a = {
      endColumn: 10,
      endLine: 10,
      startColumn: 10,
      startLine: 10,
    };
    const b = {
      endColumn: 10,
      endLine: 10,
      startColumn: 10,
      startLine: 10,
    };

    expect(isEqual(a, b)).toBe(true);
  });

  test('endColumn is not equal', () => {
    const a = {
      endColumn: 10,
      endLine: 10,
      startColumn: 10,
      startLine: 10,
    };
    const b = {
      endColumn: 20,
      endLine: 10,
      startColumn: 10,
      startLine: 10,
    };

    expect(isEqual(a, b)).toBe(false);
  });

  test('endLine is not equal', () => {
    const a = {
      endColumn: 10,
      endLine: 10,
      startColumn: 10,
      startLine: 10,
    };
    const b = {
      endColumn: 10,
      endLine: 20,
      startColumn: 10,
      startLine: 10,
    };

    expect(isEqual(a, b)).toBe(false);
  });

  test('startColumn is not equal', () => {
    const a = {
      endColumn: 10,
      endLine: 10,
      startColumn: 10,
      startLine: 10,
    };
    const b = {
      endColumn: 10,
      endLine: 10,
      startColumn: 20,
      startLine: 10,
    };

    expect(isEqual(a, b)).toBe(false);
  });

  test('startLine is not equal', () => {
    const a = {
      endColumn: 10,
      endLine: 10,
      startColumn: 10,
      startLine: 10,
    };
    const b = {
      endColumn: 10,
      endLine: 10,
      startColumn: 10,
      startLine: 20,
    };

    expect(isEqual(a, b)).toBe(false);
  });
});
