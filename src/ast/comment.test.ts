import {normalizeText, isEqual, difference} from './comment';

describe('normalizeText', () => {
  test('space', () => {
    expect(normalizeText('hoge')).toBe('hoge');
    expect(normalizeText(' hoge ')).toBe('hoge');
    expect(normalizeText('   hoge   ')).toBe('hoge');
    expect(normalizeText('   hoge fuga   ')).toBe('hoge fuga');
  });

  test('return code', () => {
    expect(normalizeText('hoge')).toBe('hoge');
    expect(normalizeText('\nhoge\n')).toBe('hoge');
    expect(normalizeText(' \nhoge\n ')).toBe('hoge');
    expect(normalizeText('\n hoge \n')).toBe('hoge');
    expect(normalizeText('hoge\n ')).toBe('hoge');
    expect(normalizeText('hoge \n ')).toBe('hoge');
    expect(normalizeText('\n   hoge   \n')).toBe('hoge');
    expect(normalizeText('\n   hoge   \n   ')).toBe('hoge');
  });

  test('JSDoc *', () => {
    expect(normalizeText('hoge')).toBe('hoge');
    expect(normalizeText('*hoge')).toBe('*hoge');
    expect(normalizeText('* hoge')).toBe('hoge');
    expect(normalizeText('* hoge *')).toBe('hoge *');
    expect(normalizeText('*   hoge')).toBe('hoge');
  });
});

describe('isEqual', () => {
  test('equal', () => {
    const a = {
      block: {
        endColumn: 10,
        endLine: 10,
        startColumn: 10,
        startLine: 10,
      },
      comment: 'comment',
    };
    const b = {
      block: {
        endColumn: 10,
        endLine: 10,
        startColumn: 10,
        startLine: 10,
      },
      comment: 'comment',
    };

    expect(isEqual(a, b)).toBe(true);
  });

  test('block is not equal', () => {
    const a = {
      block: {
        endColumn: 10,
        endLine: 10,
        startColumn: 10,
        startLine: 10,
      },
      comment: 'comment',
    };
    const b = {
      block: {
        endColumn: 20,
        endLine: 10,
        startColumn: 10,
        startLine: 10,
      },
      comment: 'comment',
    };

    expect(isEqual(a, b)).toBe(false);
  });

  test('comment is not equal', () => {
    const a = {
      block: {
        endColumn: 10,
        endLine: 10,
        startColumn: 10,
        startLine: 10,
      },
      comment: 'comment',
    };
    const b = {
      block: {
        endColumn: 10,
        endLine: 10,
        startColumn: 10,
        startLine: 10,
      },
      comment: 'not comment',
    };

    expect(isEqual(a, b)).toBe(false);
  });
});

describe('difference', () => {
  const a = {
    block: {
      endColumn: 10,
      endLine: 10,
      startColumn: 10,
      startLine: 10,
    },
    comment: 'comment',
  };
  const b = {
    block: {
      endColumn: 10,
      endLine: 10,
      startColumn: 10,
      startLine: 10,
    },
    comment: 'not comment',
  };

  test('empty', () => {
    expect(difference([], [])).toStrictEqual([]);
  });

  test('[a,b] - [a,b]', () => {
    expect(difference([a, b], [a, b])).toStrictEqual([]);
  });

  test('[a,b] - [a]', () => {
    expect(difference([a, b], [a])).toStrictEqual([b]);
  });

  test('[a] - [a,b]', () => {
    expect(difference([a], [a, b])).toStrictEqual([]);
  });

  test('[a] - [b]', () => {
    expect(difference([a], [b])).toStrictEqual([a]);
  });

  test('[a,b] - []', () => {
    expect(difference([a, b], [])).toStrictEqual([a, b]);
  });

  test('[] - [a,b]', () => {
    expect(difference([], [a, b])).toStrictEqual([]);
  });
});
