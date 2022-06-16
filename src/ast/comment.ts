import * as ts from 'typescript';
import * as utils from 'tsutils';

import * as block from './block';
import {Comment} from '../generated/commentcov/plugin/Comment';

/**
 * Returns HeaderComments from the given Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.Node} node - Node that wants to return comments belonging to itself.
 * @return {Comment[]} - The list of HeaderComments of the given node.
 */
export function nodeToHeaderComments(
  sourceFile: ts.SourceFile,
  node: ts.Node
): Comment[] {
  let hcs: Comment[] = [];
  if (utils.canHaveJsDoc(node)) {
    hcs = nodeJsDocToHeaderComments(sourceFile, node);
    if (hcs.length > 0) {
      return hcs;
    }
  }

  // cf. https://typescript-jp.gitbook.io/deep-dive/overview/ast/ast-trivia
  const leadingCRs = ts.getLeadingCommentRanges(
    sourceFile.getFullText(),
    node.getFullStart()
  );

  if (leadingCRs?.length) {
    return leadingCRs.map(comment => {
      return {
        block: block.CommentRangeToBlock(sourceFile, comment),
        comment: normalizeText(utils.commentText(sourceFile.text, comment)),
      };
    });
  }

  return hcs;
}

/**
 * Returns HeaderComments from the given Node JsDoc.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.Node} node - Node that wants to return comments belonging to itself.
 * @return {Comment[]} - The list of HeaderComments of the given node.
 */
function nodeJsDocToHeaderComments(
  sourceFile: ts.SourceFile,
  node: ts.Node
): Comment[] {
  return utils.getJsDoc(node, sourceFile).map((doc: ts.JSDoc): Comment => {
    let text: string;
    if (!doc.comment) {
      text = '';
    } else if (typeof doc.comment === 'string') {
      text = normalizeText(doc.comment);
    } else {
      // ts.NodeArray<ts.JSDocComment>
      text = doc.comment
        .map((jsdc: ts.JSDocComment) => {
          return normalizeText(jsdc.text);
        })
        .join('\n');
    }

    return {
      block: block.JsDocToBlock(sourceFile, doc),
      comment: text,
    };
  });
}

/**
 * Returns InlineComments from the given Node.
 * @param {ts.SourceFile} sourceFile - SourceFile where the given node belongs to.
 * @param {ts.Node} node - Node that wants to return comments belonging to itself.
 * @return {Comment[]} - The list of InlineComments of the given node.
 */
export function nodeToInlineComments(
  sourceFile: ts.SourceFile,
  node: ts.Node
): Comment[] {
  const comments: Comment[] = [];

  utils.forEachComment(
    node,
    (fullText: string, comment: ts.CommentRange) => {
      comments.push({
        block: block.CommentRangeToBlock(sourceFile, comment),
        comment: normalizeText(utils.commentText(fullText, comment)),
      });
    },
    sourceFile
  );

  return comments;
}

/**
 * Normalize given comment text.
 * @param {string} str - The raw text.
 * @return {string} - Normalized text.
 */
export function normalizeText(str: string): string {
  return str
    .replace(/^\s+/, '')
    .replace(/\s*(\r\n|\r|\n)\s*/g, '$1')
    .replace(/\*\s+/g, '')
    .replace(/(\r\n|\r|\n)+$/, '')
    .replace(/\s+$/, '');
}

/**
 * Determine if two given comments are equal.
 * @param {Commment} a - One of the equality determination target.
 * @param {Commment} b - One of the equality determination target.
 * @return {boolean} - Whether two given comments are equal.
 */
export function isEqual(a: Comment, b: Comment): boolean {
  const ab = a.block;
  const bb = b.block;
  if (!ab || !bb) {
    return false;
  }

  return block.isEqual(ab, bb) && a.comment === b.comment;
}

/**
 * Returns the difference from the two given comment arrays.
 * @param {Commment} a - One of the difference target.
 * @param {Commment} b - One of the difference target.
 * @return {Comment[]} - Difference of the a and b.
 */
export function difference(a: Comment[], b: Comment[]): Comment[] {
  return a.filter(aV => !b.some(bV => isEqual(aV, bV)));
}
