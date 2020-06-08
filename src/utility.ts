import { basename, extname } from "path";

export function normalizeExtension(ext: string | number): string {
  const str = ext.toString();
  if (!str.length) return "";
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

export function isFileIgnored(ignore: string[], file: string): boolean {
  const filename = basename(file, extname(file));
  if (!ignore.length) return false;
  return ignore.some((ex) => ex == filename);
}
