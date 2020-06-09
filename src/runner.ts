import { walk } from "./walk";
import { extname } from "path";
import { countLines } from "./linecount";
import { Timer } from "./timer";
import * as logger from "./debug";

export interface ICountResult {
  numFiles: number;
  numLines: number;
  numUsedLines: number;
  numBlankLines: number;
  percentUsed: number | null;
  percentBlank: number | null;
  numFilesPerExtension: Record<string, number>;
  numLinesPerExtension: Record<string, number>;
  timeMs: number;
}

export interface ISarosOptions {
  path: string;
  recursive: boolean;
  extensions: string[];
  ignore: string[];
}

export async function listFiles(opts: ISarosOptions): Promise<void> {
  logger.log("Entered listFiles");
  const { path, recursive, extensions, ignore } = opts;

  await walk({
    root: path,
    extensions,
    recursive,
    ignore,
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
  logger.log("Entered getStats");
  const { path, recursive, extensions, ignore } = opts;

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
    ignore,
    cb: async (err, path) => {
      if (err) {
        console.error(err);
      } else {
        logger.log(`Runner: Got file ${path}`);
        const result = await countLines(path);
        numFiles++;
        numUsedLines += result.numUsed;
        numBlankLines += result.numBlanks;
        const ext = extname(path);
        if (ext.length) {
          if (numFilesPerExtension[ext]) numFilesPerExtension[ext] += 1;
          else numFilesPerExtension[ext] = 1;

          const lineCount = result.numUsed + result.numBlanks;
          if (numLinesPerExtension[ext]) numLinesPerExtension[ext] += lineCount;
          else numLinesPerExtension[ext] = lineCount;
        }
      }
      return false;
    },
  });

  logger.log(`All files done, composing result`);

  const numLines = numUsedLines + numBlankLines;

  return {
    timeMs: timer.asMilli(),
    numFiles,
    numLines,
    numUsedLines,
    numBlankLines,
    percentUsed: numUsedLines / numLines || null,
    percentBlank: numBlankLines / numLines || null,
    numFilesPerExtension,
    numLinesPerExtension,
  };
}
