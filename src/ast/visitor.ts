/**
 * Memo Set Variable for isVisited.
 * @type {Set<string>}
 */
const visitedSourceFiles: Set<string> = new Set([]);

/**
 * Retuns if the given filename has already processed by ts.forEachChild callback.
 * @param {string} filename - Target filename.
 * @return {boolean} - Whether the filename has already processed or not.
 */
export function isVisited(fileName: string): boolean {
  if (visitedSourceFiles.has(fileName)) {
    return true;
  }

  visitedSourceFiles.add(fileName);
  return false;
}
