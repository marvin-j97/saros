export function normalizeExtension(ext: string | number): string {
  const str = ext.toString();
  if (str.startsWith(".")) return str;
  return "." + str;
}

export function isFittingExtension(
  extensions: string[],
  path: string,
): boolean {
  if (!extensions.length) return true;
  return extensions.some((ext) => path.endsWith(ext));
}

export function isFileIgnored(exclude: string[], file: string): boolean {
  if (!exclude.length) return false;
  return exclude.some((ex) => ex == file);
}
