import { walk } from "./walk";
import { extname } from "path";
import { countLines } from "./linecount";
import { Timer } from "./timer";

export interface ICountResult {
  numFiles: number;
  numLines: number;
  numUsedLines: number;
  numBlankLines: number;
  numFilesPerExtension: Record<string, number>;
  numLinesPerExtension: Record<string, number>;
  timeMs: number;
}

export async function run(
  // TODO: object
  path: string,
  recursive: boolean,
  extensions: string[],
): Promise<ICountResult> {
  let numFiles = 0;
  let numUsedLines = 0;
  let numBlankLines = 0;
  const numFilesPerExtension: Record<string, number> = {};
  const numLinesPerExtension: Record<string, number> = {};

  const timer = new Timer();

  await walk({
    root: path,
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
    recursive,
    extensions,
  });

  return {
    timeMs: timer.asMilli(),
    numFiles,
    numLines: numUsedLines + numBlankLines,
    numUsedLines,
    numBlankLines,
    numFilesPerExtension,
    numLinesPerExtension,
  };
}
