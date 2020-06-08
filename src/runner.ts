import { walk } from "./walk";
import { extname } from "path";
import { countLines } from "./linecount";
import { Timer } from "./timer";

export interface ICountResult {
  numFiles: number;
  numLines: number;
  numUsedLines: number;
  numBlankLines: number;
  percentUsed: number;
  percentBlank: number;
  numFilesPerExtension: Record<string, number>;
  numLinesPerExtension: Record<string, number>;
  timeMs: number;
}

export interface ISarosOptions {
  path: string;
  recursive: boolean;
  extensions: string[];
  exclude: string[];
}

export async function listFiles(opts: ISarosOptions) {
  const { path, recursive, extensions, exclude } = opts;

  await walk({
    root: path,
    extensions,
    recursive,
    exclude,
    cb: async (err, file) => {
      if (err) {
        console.error(err);
      } else {
        console.log(file);
      }
      return false;
    },
  });
}

export async function getStats(opts: ISarosOptions): Promise<ICountResult> {
  const { path, recursive, extensions, exclude } = opts;

  let numFiles = 0;
  let numUsedLines = 0;
  let numBlankLines = 0;
  const numFilesPerExtension: Record<string, number> = {};
  const numLinesPerExtension: Record<string, number> = {};

  const timer = new Timer();

  await walk({
    root: path,
    recursive,
    extensions,
    exclude,
    cb: async (err, path) => {
      if (err) {
        console.error(err);
      } else {
        const result = await countLines(path);
        numFiles++;
        numUsedLines += result.numUsed;
        numBlankLines += result.numBlanks;
        const ext = extname(path);
        if (ext.length) {
          if (numFilesPerExtension[ext]) numFilesPerExtension[ext] += 1;
          else numFilesPerExtension[ext] = 1;

          if (numLinesPerExtension[ext])
            numLinesPerExtension[ext] += result.numUsed;
          else numLinesPerExtension[ext] = result.numUsed;
        }
      }
      return false;
    },
  });

  const numLines = numUsedLines + numBlankLines;

  return {
    timeMs: timer.asMilli(),
    numFiles,
    numLines,
    numUsedLines,
    numBlankLines,
    percentUsed: numUsedLines / numLines,
    percentBlank: numBlankLines / numLines,
    numFilesPerExtension,
    numLinesPerExtension,
  };
}
