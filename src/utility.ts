import { basename } from "path";
import micromatch from "micromatch";

export function normalizeExtension(ext: string | number): string {
  const str = ext.toString();
  if (!str.length) return "";
  if (str.startsWith(".")) return str;
  return "." + str;
}

export function fileIgnorer(ignore: string[]) {
  return (path: string): boolean => {
    const filename = basename(path);
    if (!ignore.length) return false;
    const isMatch = micromatch.isMatch(filename, ignore);
    return isMatch;
  };
}

export function isFittingExtension(
  extensions: string[],
  path: string,
): boolean {
  if (!extensions.length) return true;
  return extensions.some((ext) => path.endsWith(ext));
}
