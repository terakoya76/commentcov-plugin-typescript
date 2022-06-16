import {getExtension} from './regex';

describe('getExtension', () => {
  test('standard', () => {
    expect(getExtension('file.ts')).toBe('.ts');
    expect(getExtension('dir1/file.ts')).toBe('.ts');
    expect(getExtension('dir2/dir1/file.ts')).toBe('.ts');
    expect(getExtension('dir2/dir1/file.ts.zip')).toBe('.zip');
    expect(getExtension('dir2/dir1.suffix/file')).toBe('.suffix/file');
  });
});
