import * as ts from 'typescript';
import {fs} from 'memfs';
import {
  fileToCoverageItems,
  getScopeKey,
  isProperty,
  makeScopePublic,
  findCoverageItemByIdentifier,
} from './coverage';
import {_commentcov_plugin_CoverageItem_Scope as Scope} from '../generated/commentcov/plugin/CoverageItem';

/**
 * Returns ts.SourceFile compiled on memory-fs with the given filePath and content.
 * @param {string} filePath - The file is created with that path on memory-fs.
 * @param {string} content - The content of creating file.
 * @return {ts.SourceFile | undefined} - The result of compilation.
 */
function stringToProgram(
  filePath: string,
  content: string
): ts.SourceFile | undefined {
  fs.writeFileSync(filePath, content);

  const host = ts.createCompilerHost({
    module: ts.ModuleKind.AMD,
    target: ts.ScriptTarget.ES5,
  });
  host.readFile = (fileName: string): string => {
    return fs.readFileSync(fileName, 'utf8').toString();
  };

  const program = ts.createProgram({
    options: {},
    rootNames: [filePath],
    host: host,
  });

  return program.getSourceFile(filePath);
}

describe('fileToCoverageItems processClassCoverage', () => {
  test('processClassCoverage PrivateClass JSDoc', () => {
    const fileName = '/processClassCoverage.ts';
    const str = `
/**
 * Class A Header1
 * Class A Header2
 */
class A {
  /**
   * Class A myVar
   * @type {string}
   */
  myVar: string;

  /**
   * Class A foo
   * @param {string} arg - hoge
   * @return {string} - hoge
   */
  foo(arg: string): string {
    return arg;
  } // Class A foo Inline
} // Class A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciClass = {
        extension: '.ts',
        file: '/processClassCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 5,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Class A Header1\nClass A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 10,
              startColumn: 3,
              startLine: 7,
            },
            comment: 'Class A myVar\n@type {string}',
          },
          {
            block: {
              endColumn: 5,
              endLine: 17,
              startColumn: 3,
              startLine: 13,
            },
            comment:
              'Class A foo\n@param {string} arg - hoge\n@return {string} - hoge',
          },
          {
            block: {
              endColumn: 25,
              endLine: 20,
              startColumn: 5,
              startLine: 20,
            },
            comment: 'Class A foo Inline',
          },
          {
            block: {
              endColumn: 19,
              endLine: 21,
              startColumn: 3,
              startLine: 21,
            },
            comment: 'Class A Inline',
          },
        ],
        scope: 5,
        targetBlock: {
          endColumn: 1,
          endLine: 21,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciClass.headerComments.length).toBe(1);
      expect(ciClass.inlineComments.length).toBe(4);

      const ciClassMethod = {
        extension: '.ts',
        file: '/processClassCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 5,
              endLine: 17,
              startColumn: 3,
              startLine: 13,
            },
            comment: 'Class A foo',
          },
        ],
        identifier: 'foo',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 17,
              startColumn: 3,
              startLine: 13,
            },
            comment:
              'Class A foo\n@param {string} arg - hoge\n@return {string} - hoge',
          },
          {
            block: {
              endColumn: 25,
              endLine: 20,
              startColumn: 5,
              startLine: 20,
            },
            comment: 'Class A foo Inline',
          },
        ],
        scope: 9,
        targetBlock: {
          endColumn: 3,
          endLine: 20,
          startColumn: 17,
          startLine: 11,
        },
      };
      expect(ciClassMethod.headerComments.length).toBe(1);
      expect(ciClassMethod.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(2);
      expect(result).toStrictEqual([ciClass, ciClassMethod]);
    }
  });

  test('processClassCoverage PublicClass JSDoc', () => {
    const fileName = '/processClassCoverage.ts';
    const str = `
/**
 * Class A Header1
 * Class A Header2
 */
export class A {
  /**
   * Class A myVar
   * @type {string}
   */
  myVar: string;

  /**
   * Class A foo
   * @param {string} arg - hoge
   * @return {string} - hoge
   */
  foo(arg: string): string {
    return arg;
  } // Class A foo Inline
} // Class A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciClass = {
        extension: '.ts',
        file: '/processClassCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 5,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Class A Header1\nClass A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 10,
              startColumn: 3,
              startLine: 7,
            },
            comment: 'Class A myVar\n@type {string}',
          },
          {
            block: {
              endColumn: 5,
              endLine: 17,
              startColumn: 3,
              startLine: 13,
            },
            comment:
              'Class A foo\n@param {string} arg - hoge\n@return {string} - hoge',
          },
          {
            block: {
              endColumn: 25,
              endLine: 20,
              startColumn: 5,
              startLine: 20,
            },
            comment: 'Class A foo Inline',
          },
          {
            block: {
              endColumn: 19,
              endLine: 21,
              startColumn: 3,
              startLine: 21,
            },
            comment: 'Class A Inline',
          },
        ],
        scope: 4,
        targetBlock: {
          endColumn: 1,
          endLine: 21,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciClass.headerComments.length).toBe(1);
      expect(ciClass.inlineComments.length).toBe(4);

      const ciClassMethod = {
        extension: '.ts',
        file: '/processClassCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 5,
              endLine: 17,
              startColumn: 3,
              startLine: 13,
            },
            comment: 'Class A foo',
          },
        ],
        identifier: 'foo',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 17,
              startColumn: 3,
              startLine: 13,
            },
            comment:
              'Class A foo\n@param {string} arg - hoge\n@return {string} - hoge',
          },
          {
            block: {
              endColumn: 25,
              endLine: 20,
              startColumn: 5,
              startLine: 20,
            },
            comment: 'Class A foo Inline',
          },
        ],
        scope: 9,
        targetBlock: {
          endColumn: 3,
          endLine: 20,
          startColumn: 17,
          startLine: 11,
        },
      };
      expect(ciClassMethod.headerComments.length).toBe(1);
      expect(ciClassMethod.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(2);
      expect(result).toStrictEqual([ciClass, ciClassMethod]);
    }
  });

  test('processClassCoverage PrivateClass', () => {
    const fileName = '/processClassCoverage.ts';
    const str = `
// Class A Header1
// Class A Header2
export class A {
  // Class A myVar1
  // Class A myVar2
  myVar: string;

  // Class A foo1
  // Class A foo2
  foo(arg: string): string {
    return arg;
  } // Class A foo Inline
} // Class A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciClass = {
        extension: '.ts',
        file: '/processClassCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 18,
              endLine: 2,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Class A Header1',
          },
          {
            block: {
              endColumn: 18,
              endLine: 3,
              startColumn: 1,
              startLine: 3,
            },
            comment: 'Class A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 19,
              endLine: 5,
              startColumn: 3,
              startLine: 5,
            },
            comment: 'Class A myVar1',
          },
          {
            block: {
              endColumn: 19,
              endLine: 6,
              startColumn: 3,
              startLine: 6,
            },
            comment: 'Class A myVar2',
          },
          {
            block: {
              endColumn: 17,
              endLine: 9,
              startColumn: 3,
              startLine: 9,
            },
            comment: 'Class A foo1',
          },
          {
            block: {
              endColumn: 17,
              endLine: 10,
              startColumn: 3,
              startLine: 10,
            },
            comment: 'Class A foo2',
          },
          {
            block: {
              endColumn: 25,
              endLine: 13,
              startColumn: 5,
              startLine: 13,
            },
            comment: 'Class A foo Inline',
          },
          {
            block: {
              endColumn: 19,
              endLine: 14,
              startColumn: 3,
              startLine: 14,
            },
            comment: 'Class A Inline',
          },
        ],
        scope: 4,
        targetBlock: {
          endColumn: 1,
          endLine: 14,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciClass.headerComments.length).toBe(2);
      expect(ciClass.inlineComments.length).toBe(6);

      const ciClassMethod = {
        extension: '.ts',
        file: '/processClassCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 17,
              endLine: 9,
              startColumn: 3,
              startLine: 9,
            },
            comment: 'Class A foo1',
          },
          {
            block: {
              endColumn: 17,
              endLine: 10,
              startColumn: 3,
              startLine: 10,
            },
            comment: 'Class A foo2',
          },
        ],
        identifier: 'foo',
        inlineComments: [
          {
            block: {
              endColumn: 25,
              endLine: 13,
              startColumn: 5,
              startLine: 13,
            },
            comment: 'Class A foo Inline',
          },
        ],
        scope: 9,
        targetBlock: {
          endColumn: 3,
          endLine: 13,
          startColumn: 17,
          startLine: 7,
        },
      };
      expect(ciClassMethod.headerComments.length).toBe(2);
      expect(ciClassMethod.inlineComments.length).toBe(1);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(2);
      expect(result).toStrictEqual([ciClass, ciClassMethod]);
    }
  });
});

describe('fileToCoverageItems processEnumCoverage', () => {
  test('processEnumCoverage PrivateEnum JSDoc', () => {
    const fileName = '/processEnumCoverage.ts';
    const str = `
/**
 * Enum A Header1
 * Enum A Header2
 */
enum A {
  /**
   * Enum A myVar
   * @type {number}
   */
  myVar0 = 0;
  myVar1;
} // Enum A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciEnum = {
        extension: '.ts',
        file: '/processEnumCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 5,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Enum A Header1\nEnum A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 10,
              startColumn: 3,
              startLine: 7,
            },
            comment: 'Enum A myVar\n@type {number}',
          },
          {
            block: {
              endColumn: 18,
              endLine: 13,
              startColumn: 3,
              startLine: 13,
            },
            comment: 'Enum A Inline',
          },
        ],
        scope: 11,
        targetBlock: {
          endColumn: 1,
          endLine: 13,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciEnum.headerComments.length).toBe(1);
      expect(ciEnum.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciEnum]);
    }
  });

  test('processEnumCoverage PublicEnum JSDoc', () => {
    const fileName = '/processEnumCoverage.ts';
    const str = `
/**
 * Enum A Header1
 * Enum A Header2
 */
export enum A {
  /**
   * Enum A myVar
   * @type {number}
   */
  myVar0 = 0;
  myVar1;
} // Enum A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciEnum = {
        extension: '.ts',
        file: '/processEnumCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 5,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Enum A Header1\nEnum A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 10,
              startColumn: 3,
              startLine: 7,
            },
            comment: 'Enum A myVar\n@type {number}',
          },
          {
            block: {
              endColumn: 18,
              endLine: 13,
              startColumn: 3,
              startLine: 13,
            },
            comment: 'Enum A Inline',
          },
        ],
        scope: 10,
        targetBlock: {
          endColumn: 1,
          endLine: 13,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciEnum.headerComments.length).toBe(1);
      expect(ciEnum.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciEnum]);
    }
  });

  test('processEnumCoverage PrivateEnum', () => {
    const fileName = '/processEnumCoverage.ts';
    const str = `
// Enum A Header1
// Enum A Header2
export enum A {
  // Enum A myVar1
  // Enum A myVar2
  myVar0 = 0;
  myVar1;
} // Enum A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciEnum = {
        extension: '.ts',
        file: '/processEnumCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 17,
              endLine: 2,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Enum A Header1',
          },
          {
            block: {
              endColumn: 17,
              endLine: 3,
              startColumn: 1,
              startLine: 3,
            },
            comment: 'Enum A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 18,
              endLine: 5,
              startColumn: 3,
              startLine: 5,
            },
            comment: 'Enum A myVar1',
          },
          {
            block: {
              endColumn: 18,
              endLine: 6,
              startColumn: 3,
              startLine: 6,
            },
            comment: 'Enum A myVar2',
          },
          {
            block: {
              endColumn: 18,
              endLine: 9,
              startColumn: 3,
              startLine: 9,
            },
            comment: 'Enum A Inline',
          },
        ],
        scope: 10,
        targetBlock: {
          endColumn: 1,
          endLine: 9,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciEnum.headerComments.length).toBe(2);
      expect(ciEnum.inlineComments.length).toBe(3);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciEnum]);
    }
  });
});

describe('fileToCoverageItems processFunctionCoverage', () => {
  test('processFunctionCoverage PrivateFunction JSDoc', () => {
    const fileName = '/processFunctionCoverage.ts';
    const str = `
/**
 * Function A Header1
 * Function A Header2
 * @param {number} a - arg 1.
 * @param {number} b - arg 2.
 * @return {number} - sum.
 */
function A(a: number, b: number): number {
  /**
   * Function A Inline
   */
  return a + b;
} // Function A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processFunctionCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 8,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Function A Header1\nFunction A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 3,
              endLine: 8,
              startColumn: 1,
              startLine: 2,
            },
            comment:
              'Function A Header1\nFunction A Header2\n@param {number} a - arg 1.\n@param {number} b - arg 2.\n@return {number} - sum.',
          },
          {
            block: {
              endColumn: 5,
              endLine: 12,
              startColumn: 3,
              startLine: 10,
            },
            comment: 'Function A Inline',
          },
          {
            block: {
              endColumn: 22,
              endLine: 14,
              startColumn: 3,
              startLine: 14,
            },
            comment: 'Function A Inline',
          },
        ],
        scope: 9,
        targetBlock: {
          endColumn: 1,
          endLine: 14,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(3);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processFunctionCoverage PublicFunction JSDoc', () => {
    const fileName = '/processFunctionCoverage.ts';
    const str = `
/**
 * Function A Header1
 * Function A Header2
 * @param {number} a - arg 1.
 * @param {number} b - arg 2.
 * @return {number} - sum.
 */
export function A(a: number, b: number): number {
  /**
   * Function A Inline
   */
  return a + b;
} // Function A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processFunctionCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 8,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Function A Header1\nFunction A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 3,
              endLine: 8,
              startColumn: 1,
              startLine: 2,
            },
            comment:
              'Function A Header1\nFunction A Header2\n@param {number} a - arg 1.\n@param {number} b - arg 2.\n@return {number} - sum.',
          },
          {
            block: {
              endColumn: 5,
              endLine: 12,
              startColumn: 3,
              startLine: 10,
            },
            comment: 'Function A Inline',
          },
          {
            block: {
              endColumn: 22,
              endLine: 14,
              startColumn: 3,
              startLine: 14,
            },
            comment: 'Function A Inline',
          },
        ],
        scope: 8,
        targetBlock: {
          endColumn: 1,
          endLine: 14,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(3);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processFunctionCoverage PrivateFunction', () => {
    const fileName = '/processFunctionCoverage.ts';
    const str = `
// Function A Header1
// Function A Header2
export function A(a: number, b: number): number {
  // Function A Inline1
  // Function A Inline2
  return a + b;
} // Function A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processFunctionCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 21,
              endLine: 2,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Function A Header1',
          },
          {
            block: {
              endColumn: 21,
              endLine: 3,
              startColumn: 1,
              startLine: 3,
            },
            comment: 'Function A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 23,
              endLine: 5,
              startColumn: 3,
              startLine: 5,
            },
            comment: 'Function A Inline1',
          },
          {
            block: {
              endColumn: 23,
              endLine: 6,
              startColumn: 3,
              startLine: 6,
            },
            comment: 'Function A Inline2',
          },
          {
            block: {
              endColumn: 22,
              endLine: 8,
              startColumn: 3,
              startLine: 8,
            },
            comment: 'Function A Inline',
          },
        ],
        scope: 8,
        targetBlock: {
          endColumn: 1,
          endLine: 8,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(2);
      expect(ciFunction.inlineComments.length).toBe(3);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });
});

describe('fileToCoverageItems processInterfaceCoverage', () => {
  test('processInterfaceCoverage PrivateInterface JSDoc', () => {
    const fileName = '/processInterfaceCoverage.ts';
    const str = `
/**
 * Interface A Header1
 * Interface A Header2
 */
interface A {
  /**
   * Interface A foo
   * @param {string} arg - hoge
   * @return {string} - hoge
   */
  foo(arg: string): string;
} // Interface A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processInterfaceCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 5,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Interface A Header1\nInterface A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 11,
              startColumn: 3,
              startLine: 7,
            },
            comment:
              'Interface A foo\n@param {string} arg - hoge\n@return {string} - hoge',
          },
          {
            block: {
              endColumn: 23,
              endLine: 13,
              startColumn: 3,
              startLine: 13,
            },
            comment: 'Interface A Inline',
          },
        ],
        scope: 5,
        targetBlock: {
          endColumn: 1,
          endLine: 13,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processInterfaceCoverage PublicInterface JSDoc', () => {
    const fileName = '/processInterfaceCoverage.ts';
    const str = `
/**
 * Interface A Header1
 * Interface A Header2
 */
export interface A {
  /**
   * Interface A foo
   * @param {string} arg - hoge
   * @return {string} - hoge
   */
  foo(arg: string): string;
} // Interface A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processInterfaceCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 5,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Interface A Header1\nInterface A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 11,
              startColumn: 3,
              startLine: 7,
            },
            comment:
              'Interface A foo\n@param {string} arg - hoge\n@return {string} - hoge',
          },
          {
            block: {
              endColumn: 23,
              endLine: 13,
              startColumn: 3,
              startLine: 13,
            },
            comment: 'Interface A Inline',
          },
        ],
        scope: 4,
        targetBlock: {
          endColumn: 1,
          endLine: 13,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processInterfaceCoverage PrivateInterface', () => {
    const fileName = '/processInterfaceCoverage.ts';
    const str = `
// Interface A Header1
// Interface A Header2
interface A {
  // Interface A foo1
  // Interface A foo2
  foo(arg: string): string;
} // Interface A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processInterfaceCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 22,
              endLine: 2,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Interface A Header1',
          },
          {
            block: {
              endColumn: 22,
              endLine: 3,
              startColumn: 1,
              startLine: 3,
            },
            comment: 'Interface A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 21,
              endLine: 5,
              startColumn: 3,
              startLine: 5,
            },
            comment: 'Interface A foo1',
          },
          {
            block: {
              endColumn: 21,
              endLine: 6,
              startColumn: 3,
              startLine: 6,
            },
            comment: 'Interface A foo2',
          },
          {
            block: {
              endColumn: 23,
              endLine: 8,
              startColumn: 3,
              startLine: 8,
            },
            comment: 'Interface A Inline',
          },
        ],
        scope: 5,
        targetBlock: {
          endColumn: 1,
          endLine: 8,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(2);
      expect(ciFunction.inlineComments.length).toBe(3);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });
});

describe('fileToCoverageItems processModuleCoverage', () => {
  test('processModuleCoverage PrivateModule JSDoc', () => {
    const fileName = '/processModuleCoverage.ts';
    const str = `
/**
 * Module A Header1
 * Module A Header2
 */
module A {
  /**
   * Module A myVar
   * @type {string}
   */
  export const myVar = 'string';
} // Module A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processModuleCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 5,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Module A Header1\nModule A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 10,
              startColumn: 3,
              startLine: 7,
            },
            comment: 'Module A myVar\n@type {string}',
          },
          {
            block: {
              endColumn: 20,
              endLine: 12,
              startColumn: 3,
              startLine: 12,
            },
            comment: 'Module A Inline',
          },
        ],
        scope: 3,
        targetBlock: {
          endColumn: 1,
          endLine: 12,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processModuleCoverage PublicModule JSDoc', () => {
    const fileName = '/processModuleCoverage.ts';
    const str = `
/**
 * Module A Header1
 * Module A Header2
 */
export module A {
  /**
   * Module A myVar
   * @type {string}
   */
  export const myVar = 'string';
} // Module A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processModuleCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 5,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Module A Header1\nModule A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 10,
              startColumn: 3,
              startLine: 7,
            },
            comment: 'Module A myVar\n@type {string}',
          },
          {
            block: {
              endColumn: 20,
              endLine: 12,
              startColumn: 3,
              startLine: 12,
            },
            comment: 'Module A Inline',
          },
        ],
        scope: 2,
        targetBlock: {
          endColumn: 1,
          endLine: 12,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processModuleCoverage PrivateModule', () => {
    const fileName = '/processModuleCoverage.ts';
    const str = `
// Module A Header1
// Module A Header2
module A {
  // Module A Inline1
  // Module A Inline2
  export const myVar = 'string';
} // Module A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processModuleCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 19,
              endLine: 2,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Module A Header1',
          },
          {
            block: {
              endColumn: 19,
              endLine: 3,
              startColumn: 1,
              startLine: 3,
            },
            comment: 'Module A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 21,
              endLine: 5,
              startColumn: 3,
              startLine: 5,
            },
            comment: 'Module A Inline1',
          },
          {
            block: {
              endColumn: 21,
              endLine: 6,
              startColumn: 3,
              startLine: 6,
            },
            comment: 'Module A Inline2',
          },
          {
            block: {
              endColumn: 20,
              endLine: 8,
              startColumn: 3,
              startLine: 8,
            },
            comment: 'Module A Inline',
          },
        ],
        scope: 3,
        targetBlock: {
          endColumn: 1,
          endLine: 8,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(2);
      expect(ciFunction.inlineComments.length).toBe(3);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processModuleCoverage PrivateNamespace JSDoc', () => {
    const fileName = '/processModuleCoverage.ts';
    const str = `
/**
 * Namespace A Header1
 * Namespace A Header2
 */
namespace A {
  /**
   * Namespace A myVar
   * @type {string}
   */
  export const myVar = 'string';
} // Namespace A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processModuleCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 5,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Namespace A Header1\nNamespace A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 10,
              startColumn: 3,
              startLine: 7,
            },
            comment: 'Namespace A myVar\n@type {string}',
          },
          {
            block: {
              endColumn: 23,
              endLine: 12,
              startColumn: 3,
              startLine: 12,
            },
            comment: 'Namespace A Inline',
          },
        ],
        scope: 3,
        targetBlock: {
          endColumn: 1,
          endLine: 12,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processModuleCoverage PublicModule JSDoc', () => {
    const fileName = '/processModuleCoverage.ts';
    const str = `
/**
 * Namespace A Header1
 * Namespace A Header2
 */
export namespace A {
  /**
   * Namespace A myVar
   * @type {string}
   */
  export const myVar = 'string';
} // Namespace A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processModuleCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 5,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Namespace A Header1\nNamespace A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 5,
              endLine: 10,
              startColumn: 3,
              startLine: 7,
            },
            comment: 'Namespace A myVar\n@type {string}',
          },
          {
            block: {
              endColumn: 23,
              endLine: 12,
              startColumn: 3,
              startLine: 12,
            },
            comment: 'Namespace A Inline',
          },
        ],
        scope: 2,
        targetBlock: {
          endColumn: 1,
          endLine: 12,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processModuleCoverage PrivateModule', () => {
    const fileName = '/processModuleCoverage.ts';
    const str = `
// Namespace A Header1
// Namespace A Header2
module A {
  // Namespace A Inline1
  // Namespace A Inline2
  export const myVar = 'string';
} // Namespace A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processModuleCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 22,
              endLine: 2,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Namespace A Header1',
          },
          {
            block: {
              endColumn: 22,
              endLine: 3,
              startColumn: 1,
              startLine: 3,
            },
            comment: 'Namespace A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 24,
              endLine: 5,
              startColumn: 3,
              startLine: 5,
            },
            comment: 'Namespace A Inline1',
          },
          {
            block: {
              endColumn: 24,
              endLine: 6,
              startColumn: 3,
              startLine: 6,
            },
            comment: 'Namespace A Inline2',
          },
          {
            block: {
              endColumn: 23,
              endLine: 8,
              startColumn: 3,
              startLine: 8,
            },
            comment: 'Namespace A Inline',
          },
        ],
        scope: 3,
        targetBlock: {
          endColumn: 1,
          endLine: 8,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(2);
      expect(ciFunction.inlineComments.length).toBe(3);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });
});

describe('fileToCoverageItems processVariableCoverage', () => {
  test('processVariableCoverage PrivateLet JSDoc', () => {
    const fileName = '/processVariableCoverage.ts';
    const str = `
/**
 * Let A Header1
 * Let A Header2
 * @type {string}
 */
let A = 'hoge'; // Let A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processVariableCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 6,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Let A Header1\nLet A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 3,
              endLine: 6,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Let A Header1\nLet A Header2\n@type {string}',
          },
          {
            block: {
              endColumn: 31,
              endLine: 7,
              startColumn: 17,
              startLine: 7,
            },
            comment: 'Let A Inline',
          },
        ],
        scope: 11,
        targetBlock: {
          endColumn: 15,
          endLine: 7,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processVariableCoverage PublicLet JSDoc', () => {
    const fileName = '/processVariableCoverage.ts';
    const str = `
/**
 * Let A Header1
 * Let A Header2
 * @type {string}
 */
export let A = 'hoge'; // Let A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processVariableCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 6,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Let A Header1\nLet A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 3,
              endLine: 6,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Let A Header1\nLet A Header2\n@type {string}',
          },
          {
            block: {
              endColumn: 38,
              endLine: 7,
              startColumn: 24,
              startLine: 7,
            },
            comment: 'Let A Inline',
          },
        ],
        scope: 10,
        targetBlock: {
          endColumn: 22,
          endLine: 7,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processVariableCoverage PrivateLet', () => {
    const fileName = '/processVariableCoverage.ts';
    const str = `
// Let A Header1
// Let A Header2
let A = 'hoge'; // Let A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processVariableCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 16,
              endLine: 2,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Let A Header1',
          },
          {
            block: {
              endColumn: 16,
              endLine: 3,
              startColumn: 1,
              startLine: 3,
            },
            comment: 'Let A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 31,
              endLine: 4,
              startColumn: 17,
              startLine: 4,
            },
            comment: 'Let A Inline',
          },
        ],
        scope: 11,
        targetBlock: {
          endColumn: 15,
          endLine: 4,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(2);
      expect(ciFunction.inlineComments.length).toBe(1);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processVariableCoverage PrivateConst JSDoc', () => {
    const fileName = '/processVariableCoverage.ts';
    const str = `
/**
 * Const A Header1
 * Const A Header2
 * @type {string}
 */
const A = 'hoge'; // Const A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processVariableCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 6,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Const A Header1\nConst A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 3,
              endLine: 6,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Const A Header1\nConst A Header2\n@type {string}',
          },
          {
            block: {
              endColumn: 35,
              endLine: 7,
              startColumn: 19,
              startLine: 7,
            },
            comment: 'Const A Inline',
          },
        ],
        scope: 11,
        targetBlock: {
          endColumn: 17,
          endLine: 7,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processVariableCoverage PublicConst JSDoc', () => {
    const fileName = '/processVariableCoverage.ts';
    const str = `
/**
 * Const A Header1
 * Const A Header2
 * @type {string}
 */
export const A = 'hoge'; // Const A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processVariableCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 3,
              endLine: 6,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Const A Header1\nConst A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 3,
              endLine: 6,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Const A Header1\nConst A Header2\n@type {string}',
          },
          {
            block: {
              endColumn: 42,
              endLine: 7,
              startColumn: 26,
              startLine: 7,
            },
            comment: 'Const A Inline',
          },
        ],
        scope: 10,
        targetBlock: {
          endColumn: 24,
          endLine: 7,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(1);
      expect(ciFunction.inlineComments.length).toBe(2);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });

  test('processVariableCoverage PrivateConst', () => {
    const fileName = '/processVariableCoverage.ts';
    const str = `
// Const A Header1
// Const A Header2
const A = 'hoge'; // Const A Inline
  `;

    const sourceFile = stringToProgram(fileName, str);
    if (sourceFile === undefined) {
      throw new Error('sourceFile should be present');
    } else {
      const ciFunction = {
        extension: '.ts',
        file: '/processVariableCoverage.ts',
        headerComments: [
          {
            block: {
              endColumn: 18,
              endLine: 2,
              startColumn: 1,
              startLine: 2,
            },
            comment: 'Const A Header1',
          },
          {
            block: {
              endColumn: 18,
              endLine: 3,
              startColumn: 1,
              startLine: 3,
            },
            comment: 'Const A Header2',
          },
        ],
        identifier: 'A',
        inlineComments: [
          {
            block: {
              endColumn: 35,
              endLine: 4,
              startColumn: 19,
              startLine: 4,
            },
            comment: 'Const A Inline',
          },
        ],
        scope: 11,
        targetBlock: {
          endColumn: 17,
          endLine: 4,
          startColumn: 1,
          startLine: 1,
        },
      };
      expect(ciFunction.headerComments.length).toBe(2);
      expect(ciFunction.inlineComments.length).toBe(1);

      const result = fileToCoverageItems(sourceFile);
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([ciFunction]);
    }
  });
});

describe('getScopeKey', () => {
  test('getScopeKey', () => {
    expect(getScopeKey(Scope.UNKNOWN)).toBe('UNKNOWN');
    expect(getScopeKey(Scope.FILE)).toBe('FILE');
    expect(getScopeKey(Scope.PUBLIC_MODULE)).toBe('PUBLIC_MODULE');
    expect(getScopeKey(Scope.PRIVATE_MODULE)).toBe('PRIVATE_MODULE');
    expect(getScopeKey(Scope.PUBLIC_CLASS)).toBe('PUBLIC_CLASS');
    expect(getScopeKey(Scope.PRIVATE_CLASS)).toBe('PRIVATE_CLASS');
    expect(getScopeKey(Scope.PUBLIC_TYPE)).toBe('PUBLIC_TYPE');
    expect(getScopeKey(Scope.PRIVATE_TYPE)).toBe('PRIVATE_TYPE');
    expect(getScopeKey(Scope.PUBLIC_FUNCTION)).toBe('PUBLIC_FUNCTION');
    expect(getScopeKey(Scope.PRIVATE_FUNCTION)).toBe('PRIVATE_FUNCTION');
    expect(getScopeKey(Scope.PUBLIC_VARIABLE)).toBe('PUBLIC_VARIABLE');
    expect(getScopeKey(Scope.PRIVATE_VARIABLE)).toBe('PRIVATE_VARIABLE');
  });
});

describe('isProperty', () => {
  test('isProperty', () => {
    expect(isProperty('UNKNOWN')).toBe(true);
    expect(isProperty('FILE')).toBe(true);
    expect(isProperty('PUBLIC_MODULE')).toBe(true);
    expect(isProperty('PRIVATE_MODULE')).toBe(true);
    expect(isProperty('PUBLIC_CLASS')).toBe(true);
    expect(isProperty('PRIVATE_CLASS')).toBe(true);
    expect(isProperty('PUBLIC_TYPE')).toBe(true);
    expect(isProperty('PRIVATE_TYPE')).toBe(true);
    expect(isProperty('PUBLIC_FUNCTION')).toBe(true);
    expect(isProperty('PRIVATE_FUNCTION')).toBe(true);
    expect(isProperty('PUBLIC_VARIABLE')).toBe(true);
    expect(isProperty('PRIVATE_VARIABLE')).toBe(true);
  });
});

describe('makeScopePublic', () => {
  test('makeScopePublic', () => {
    expect(makeScopePublic('UNKNOWN')).toBe('UNKNOWN');
    expect(makeScopePublic('FILE')).toBe('FILE');
    expect(makeScopePublic('PUBLIC_MODULE')).toBe('PUBLIC_MODULE');
    expect(makeScopePublic('PRIVATE_MODULE')).toBe('PUBLIC_MODULE');
    expect(makeScopePublic('PUBLIC_CLASS')).toBe('PUBLIC_CLASS');
    expect(makeScopePublic('PRIVATE_CLASS')).toBe('PUBLIC_CLASS');
    expect(makeScopePublic('PUBLIC_TYPE')).toBe('PUBLIC_TYPE');
    expect(makeScopePublic('PRIVATE_TYPE')).toBe('PUBLIC_TYPE');
    expect(makeScopePublic('PUBLIC_FUNCTION')).toBe('PUBLIC_FUNCTION');
    expect(makeScopePublic('PRIVATE_FUNCTION')).toBe('PUBLIC_FUNCTION');
    expect(makeScopePublic('PUBLIC_VARIABLE')).toBe('PUBLIC_VARIABLE');
    expect(makeScopePublic('PRIVATE_VARIABLE')).toBe('PUBLIC_VARIABLE');
  });
});

describe('findCoverageItemByIdentifier', () => {
  test('findCoverageItemByIdentifier', () => {
    const aIdent = 'A';
    const bIdent = 'B';
    const cIdent = 'C';

    const aCI = {
      extension: '.ts',
      file: '/a.ts',
      headerComments: [
        {
          block: {
            endColumn: 22,
            endLine: 2,
            startColumn: 1,
            startLine: 2,
          },
          comment: 'A Header',
        },
      ],
      identifier: aIdent,
      inlineComments: [
        {
          block: {
            endColumn: 21,
            endLine: 5,
            startColumn: 3,
            startLine: 5,
          },
          comment: 'A Inline',
        },
      ],
      scope: 5,
      targetBlock: {
        endColumn: 1,
        endLine: 8,
        startColumn: 1,
        startLine: 1,
      },
    };

    const bCI = {
      extension: '.ts',
      file: '/b.ts',
      headerComments: [
        {
          block: {
            endColumn: 22,
            endLine: 2,
            startColumn: 1,
            startLine: 2,
          },
          comment: 'B Header',
        },
      ],
      identifier: bIdent,
      inlineComments: [
        {
          block: {
            endColumn: 21,
            endLine: 5,
            startColumn: 3,
            startLine: 5,
          },
          comment: 'B Inline',
        },
      ],
      scope: 5,
      targetBlock: {
        endColumn: 1,
        endLine: 8,
        startColumn: 1,
        startLine: 1,
      },
    };

    const cis = [aCI, bCI];
    expect(findCoverageItemByIdentifier(aIdent, cis)).toBe(aCI);
    expect(findCoverageItemByIdentifier(bIdent, cis)).toBe(bCI);
    expect(findCoverageItemByIdentifier(cIdent, cis)).toBe(null);
  });
});
