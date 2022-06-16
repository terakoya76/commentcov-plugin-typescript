/**
 * Returns extension of the given filename string.
 * @param {string} filename - Target filename.
 * @return {string} - The extension is returned in the format `.xxx`. If the extension is not found in the filename, an empty string is returned.
 */
export function getExtension(fileName: string): string {
  const re = /(?:(\.[^.]+))?$/;
  const result = re.exec(fileName);
  return result ? result[1] : '';
}
