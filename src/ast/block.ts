import * as ts from 'typescript';

import {Block} from '../generated/commentcov/plugin/Block';

/**
 * Returns Block from the given Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.Node} node - Target Node.
 * @return {proto.Block} - The block of the target node.
 */
export function NodeToBlock(sourceFile: ts.SourceFile, node: ts.Node): Block {
  const sr = ts.getLineAndCharacterOfPosition(sourceFile, node.getFullStart());
  const er = ts.getLineAndCharacterOfPosition(sourceFile, node.getEnd());

  return {
    startLine: sr.line + 1,
    startColumn: sr.character + 1,
    endLine: er.line + 1,
    endColumn: er.character,
  };
}

/**
 * Returns Block from the given CommentRange.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.Node} node - Target CommentRange.
 * @return {proto.Block} - The block of the target CommentRange.
 */
export function CommentRangeToBlock(
  sourceFile: ts.SourceFile,
  comment: ts.CommentRange,
): Block {
  const sr = ts.getLineAndCharacterOfPosition(sourceFile, comment.pos);
  const er = ts.getLineAndCharacterOfPosition(sourceFile, comment.end);

  return {
    startLine: sr.line + 1,
    startColumn: sr.character + 1,
    endLine: er.line + 1,
    endColumn: er.character,
  };
}

/**
 * Returns Block from the given JSDoc Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.Node} node - Target JSDoc Node.
 * @return {proto.Block} - The block of the target JSDoc Node.
 */
export function JsDocToBlock(sourceFile: ts.SourceFile, doc: ts.JSDoc): Block {
  const sr = ts.getLineAndCharacterOfPosition(sourceFile, doc.pos);
  const er = ts.getLineAndCharacterOfPosition(sourceFile, doc.end);

  return {
    startLine: sr.line + 1,
    startColumn: sr.character + 1,
    endLine: er.line + 1,
    endColumn: er.character,
  };
}

/**
 * Determine if two given blocks are equal.
 * @param {proto.Block} a - One of the equality determination target.
 * @param {proto.Block} b - One of the equality determination target.
 * @return {boolean} - Whether two given blocks are equal.
 */
export function isEqual(a: Block, b: Block): boolean {
  return (
    a.startLine === b.startLine &&
    a.startColumn === b.startColumn &&
    a.endLine === b.endLine &&
    a.endColumn === b.endColumn
  );
}
