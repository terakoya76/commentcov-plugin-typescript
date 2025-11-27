import * as path from 'path';
import * as ts from 'typescript';

import * as block from './block';
import * as comment from './comment';
import * as regex from '../regex/regex';
import {
  CoverageItem,
  _commentcov_plugin_CoverageItem_Scope,
  _commentcov_plugin_CoverageItem_Scope as Scope,
} from '../generated/commentcov/plugin/CoverageItem';

/**
 * Print the given CoverageItem in the human-readable format.
 * @param {CoverageItem} ci - The target of Print.
 */
export function printCoverageItem(ci: CoverageItem) {
  console.log('scope:');
  console.log(ci.scope);
  console.log('targetBlock:');
  console.log(ci.targetBlock);
  console.log('file:');
  console.log(ci.file);
  console.log('identifier:');
  console.log(ci.identifier);
  console.log('extension:');
  console.log(ci.extension);
  console.log('header comments:');
  console.log(ci.headerComments);
  console.log('inline comments:');
  console.log(ci.inlineComments);
}

/**
 * Returns a list of CoverageItems from the given SourceFile.
 * @param {ts.SourceFile} sourceFile - Target SourceFile to be measured.
 * @return {CoverageItem[]} - The list of CoverageItems.
 */
export function fileToCoverageItems(sourceFile: ts.SourceFile): CoverageItem[] {
  const coverageItems: CoverageItem[] = [];
  const visit = (node: ts.Node): void => {
    // cf. https://typescript-jp.gitbook.io/deep-dive/overview/emitter/emitter-functions
    if (ts.isClassDeclaration(node)) {
      const ci = processClassCoverage(sourceFile, node);
      coverageItems.push(ci);

      // for class members
      ts.forEachChild(node, visit);
    } else if (ts.isEnumDeclaration(node)) {
      const ci = processEnumCoverage(sourceFile, node);
      coverageItems.push(ci);
    } else if (ts.isExportDeclaration(node)) {
      modifyPublicity(sourceFile, node, coverageItems);
    } else if (ts.isFunctionDeclaration(node)) {
      const ci = processFunctionCoverage(sourceFile, node);
      coverageItems.push(ci);
    } else if (ts.isInterfaceDeclaration(node)) {
      const ci = processInterfaceCoverage(sourceFile, node);
      coverageItems.push(ci);
    } else if (ts.isMethodDeclaration(node)) {
      const ci = processMethodCoverage(sourceFile, node);
      coverageItems.push(ci);
    } else if (ts.isModuleDeclaration(node)) {
      const ci = processModuleCoverage(sourceFile, node);
      coverageItems.push(ci);
    } else if (ts.isVariableStatement(node)) {
      const ci = processVariableCoverage(sourceFile, node);
      coverageItems.push(ci);
    } else {
      // do nothing
    }
  };

  // https://typescript-jp.gitbook.io/deep-dive/overview/ast/ast-tip-children
  ts.forEachChild(sourceFile, node => {
    visit(node);
  });

  return coverageItems;
}

/**
 * Returns CoverageItem from the given Class Declaration Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.ClassDeclaration} decl - Target of coverage measuring.
 * @return {CoverageItem} - The coverage of the target node.
 */
export function processClassCoverage(
  sourceFile: ts.SourceFile,
  decl: ts.ClassDeclaration,
): CoverageItem {
  const scope: _commentcov_plugin_CoverageItem_Scope =
    decl.modifiers &&
    decl.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
      ? Scope.PUBLIC_CLASS
      : Scope.PRIVATE_CLASS;

  const hcs = comment.nodeToHeaderComments(sourceFile, decl);
  const ics = comment.nodeToInlineComments(sourceFile, decl);

  return {
    scope: scope,
    targetBlock: block.NodeToBlock(sourceFile, decl),
    file: path.resolve(sourceFile.fileName),
    identifier: decl.name ? decl.name.text : '',
    extension: regex.getExtension(sourceFile.fileName),
    headerComments: hcs,
    inlineComments: comment.difference(ics, hcs),
  };
}

/**
 * Returns CoverageItem from the given Enum Declaration Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.EnumDeclaration} decl - Target of coverage measuring.
 * @return {CoverageItem} - The coverage of the target node.
 */
export function processEnumCoverage(
  sourceFile: ts.SourceFile,
  decl: ts.EnumDeclaration,
): CoverageItem {
  const scope: _commentcov_plugin_CoverageItem_Scope =
    decl.modifiers &&
    decl.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
      ? Scope.PUBLIC_VARIABLE
      : Scope.PRIVATE_VARIABLE;

  const hcs = comment.nodeToHeaderComments(sourceFile, decl);
  const ics = comment.nodeToInlineComments(sourceFile, decl);

  return {
    scope: scope,
    targetBlock: block.NodeToBlock(sourceFile, decl),
    file: path.resolve(sourceFile.fileName),
    identifier: decl.name ? decl.name.text : '',
    extension: regex.getExtension(sourceFile.fileName),
    headerComments: hcs,
    inlineComments: comment.difference(ics, hcs),
  };
}

/**
 * Returns CoverageItem from the given Function Declaration Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.FunctionDeclaration} decl - Target of coverage measuring.
 * @return {CoverageItem} - The coverage of the target node.
 */
export function processFunctionCoverage(
  sourceFile: ts.SourceFile,
  decl: ts.FunctionDeclaration,
): CoverageItem {
  const scope: _commentcov_plugin_CoverageItem_Scope =
    decl.modifiers &&
    decl.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
      ? Scope.PUBLIC_FUNCTION
      : Scope.PRIVATE_FUNCTION;

  const hcs = comment.nodeToHeaderComments(sourceFile, decl);
  const ics = comment.nodeToInlineComments(sourceFile, decl);

  return {
    scope: scope,
    targetBlock: block.NodeToBlock(sourceFile, decl),
    file: path.resolve(sourceFile.fileName),
    identifier: decl.name ? decl.name.text : '',
    extension: regex.getExtension(sourceFile.fileName),
    headerComments: hcs,
    inlineComments: comment.difference(ics, hcs),
  };
}

/**
 * Returns CoverageItem from the given Interface Declaration Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.InterfaceDeclaration} decl - Target of coverage measuring.
 * @return {CoverageItem} - The coverage of the target node.
 */
export function processInterfaceCoverage(
  sourceFile: ts.SourceFile,
  decl: ts.InterfaceDeclaration,
): CoverageItem {
  const scope: _commentcov_plugin_CoverageItem_Scope =
    decl.modifiers &&
    decl.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
      ? Scope.PUBLIC_CLASS
      : Scope.PRIVATE_CLASS;

  const hcs = comment.nodeToHeaderComments(sourceFile, decl);
  const ics = comment.nodeToInlineComments(sourceFile, decl);

  return {
    scope: scope,
    targetBlock: block.NodeToBlock(sourceFile, decl),
    file: path.resolve(sourceFile.fileName),
    identifier: decl.name ? decl.name.text : '',
    extension: regex.getExtension(sourceFile.fileName),
    headerComments: hcs,
    inlineComments: comment.difference(ics, hcs),
  };
}

/**
 * Returns CoverageItem from the given Method Declaration Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.MethodDeclaration} decl - Target of coverage measuring.
 * @return {CoverageItem} - The coverage of the target node.
 */
export function processMethodCoverage(
  sourceFile: ts.SourceFile,
  decl: ts.MethodDeclaration,
): CoverageItem {
  const scope: _commentcov_plugin_CoverageItem_Scope =
    decl.modifiers &&
    decl.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
      ? Scope.PUBLIC_FUNCTION
      : Scope.PRIVATE_FUNCTION;

  let identifier = '';
  if (ts.isIdentifier(decl.name)) {
    identifier = decl.name ? decl.name.text : '';
  }

  const hcs = comment.nodeToHeaderComments(sourceFile, decl);
  const ics = comment.nodeToInlineComments(sourceFile, decl);

  return {
    scope: scope,
    targetBlock: block.NodeToBlock(sourceFile, decl),
    file: path.resolve(sourceFile.fileName),
    identifier: identifier,
    extension: regex.getExtension(sourceFile.fileName),
    headerComments: hcs,
    inlineComments: comment.difference(ics, hcs),
  };
}

/**
 * Returns CoverageItem from the given Module Declaration Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.MethodDeclaration} decl - Target of coverage measuring.
 * @return {CoverageItem} - The coverage of the target node.
 */
export function processModuleCoverage(
  sourceFile: ts.SourceFile,
  decl: ts.ModuleDeclaration,
): CoverageItem {
  const scope: _commentcov_plugin_CoverageItem_Scope =
    decl.modifiers &&
    decl.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
      ? Scope.PUBLIC_MODULE
      : Scope.PRIVATE_MODULE;

  const hcs = comment.nodeToHeaderComments(sourceFile, decl);
  const ics = comment.nodeToInlineComments(sourceFile, decl);

  return {
    scope: scope,
    targetBlock: block.NodeToBlock(sourceFile, decl),
    file: path.resolve(sourceFile.fileName),
    identifier: decl.name ? decl.name.text : '',
    extension: regex.getExtension(sourceFile.fileName),
    headerComments: hcs,
    inlineComments: comment.difference(ics, hcs),
  };
}

/**
 * Returns CoverageItem from the given Variable Statement Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.VariableStatement} statement - Target of coverage measuring.
 * @return {CoverageItem} - The coverage of the target node.
 */
export function processVariableCoverage(
  sourceFile: ts.SourceFile,
  statement: ts.VariableStatement,
): CoverageItem {
  const scope: _commentcov_plugin_CoverageItem_Scope =
    statement.modifiers &&
    statement.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
      ? Scope.PUBLIC_VARIABLE
      : Scope.PRIVATE_VARIABLE;

  const identifier = statement.declarationList.declarations
    .map((d: ts.VariableDeclaration) => {
      const n = d.name;
      if (ts.isIdentifier(n)) {
        return n ? n.text : '';
      } else {
        return '';
      }
    })
    .join(',');

  const hcs = comment.nodeToHeaderComments(sourceFile, statement);
  const ics = comment.nodeToInlineComments(sourceFile, statement);

  return {
    scope: scope,
    targetBlock: block.NodeToBlock(sourceFile, statement),
    file: path.resolve(sourceFile.fileName),
    identifier: identifier,
    extension: regex.getExtension(sourceFile.fileName),
    headerComments: hcs,
    inlineComments: comment.difference(ics, hcs),
  };
}

/**
 * Make public a CoverageItem with the same Identifier as the ExportSpecifier propertyName in the given ExportDeclaration.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.ExportDeclaration} decl - Target ExportDeclaration.
 * @param {CoverageItem[]} list - A list of CoverageItems which might include target CoverageItems.
 */
export function modifyPublicity(
  sourceFile: ts.SourceFile,
  decl: ts.ExportDeclaration,
  list: CoverageItem[],
) {
  if (decl.exportClause === undefined) {
    return;
  }

  if (ts.isNamedExports(decl.exportClause)) {
    decl.exportClause.elements.forEach((es: ts.ExportSpecifier) => {
      const identifier = es.propertyName;
      if (identifier === undefined) {
        return;
      }

      const ci = findCoverageItemByIdentifier(identifier.text, list);
      if (ci === null) {
        return;
      }

      if (ci.scope === undefined) {
        return;
      }

      const k = getScopeKey(ci.scope);
      if (k === null) {
        return;
      }

      const pk = makeScopePublic(k);
      if (isProperty(pk)) {
        ci.scope = Scope[pk];
      }
    });
  }
}

/**
 * Returns string version of `Scope` key according to the given interface value.
 * @param {Scope} scope - The value of Scope[`return_value`].
 * @return {string | null} - String when the value according to the give interface value or null.
 */
export function getScopeKey(scope: Scope | keyof typeof Scope): string | null {
  let k = null;
  Object.entries(Scope).forEach(([key, value]) => {
    if (value === scope) {
      k = key;
    }
  });

  return k;
}

/**
 * Returns true if the given string is a part of `keyof Scope`.
 * @param {string]} v - Any string value.
 * @return {boolean} - Whether the given string is a part of `keyof Scope`.
 */
export function isProperty(v: string): v is keyof typeof Scope {
  return (
    v === 'UNKNOWN' ||
    v === 'FILE' ||
    v === 'PUBLIC_MODULE' ||
    v === 'PRIVATE_MODULE' ||
    v === 'PUBLIC_CLASS' ||
    v === 'PRIVATE_CLASS' ||
    v === 'PUBLIC_TYPE' ||
    v === 'PRIVATE_TYPE' ||
    v === 'PUBLIC_FUNCTION' ||
    v === 'PRIVATE_FUNCTION' ||
    v === 'PUBLIC_VARIABLE' ||
    v === 'PRIVATE_VARIABLE'
  );
}

/**
 * Returns string version of the one of the `keyof CoverageItem.ScopeMap`.
 * @param {string} k - k is expected to be `PRIVATE_XXX`.
 * @return {string} - String version of the one of the `keyof CoverageItem.ScopeMap` like `PUBLIC_XXX`.
 */
export function makeScopePublic(k: string): string {
  const arr = k.split('_');
  if (arr.length !== 2 || arr[0] !== 'PRIVATE') {
    return k;
  }

  return 'PUBLIC' + '_' + arr[1];
}

/**
 * Returns CoverageItem with the same Identifier as the propertyName with the given ts.Identifier.
 * @param {ts.Identifier} id - Target Identifier.
 * @param {CoverageItem[]} list - A list of CoverageItems.
 * @return {CoverageItem | null} - CoverageItem with the same Identifier as the propertyName with the given ts.Identifier or null.
 */
export function findCoverageItemByIdentifier(
  identifier: string,
  list: CoverageItem[],
): CoverageItem | null {
  let ret: CoverageItem | null = null;
  list.forEach((ci: CoverageItem) => {
    if (identifier === ci.identifier) {
      ret = ci;
    }
  });

  return ret;
}
