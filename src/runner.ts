import { walkFiles } from "walk-it";
import { extname } from "path";

import { countLines } from "./linecount";
import { Timer } from "./timer";
import * as logger from "./debug";
import { fileIgnorer, isFittingExtension, normalizeExtension } from "./utility";

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

type CountOnlyResult = Omit<
  ICountResult,
  | "numLines"
  | "numUsedLines"
  | "numBlankLines"
  | "percentUsed"
  | "percentBlank"
  | "numLinesPerExtension"
>;

export interface ISarosOptions {
  path: string;
  recursive: boolean;
  extensions: string[];
  ignore: string[];
}

export async function listFiles(opts: ISarosOptions): Promise<void> {
  logger.log("Entered listFiles");
  const { path, recursive, extensions, ignore } = opts;

  const isIgnoredFile = fileIgnorer(ignore);

  for await (const file of walkFiles(path, {
    recursive,
    excludeFolder: fileIgnorer(ignore),
  })) {
    const checkedExtension = isFittingExtension(
      extensions.map(normalizeExtension),
      file,
    );
    const checkedIgnoreList = !isIgnoredFile(file);

    if (checkedExtension && checkedIgnoreList) {
      console.log(file);
    }
  }
}

export async function countFiles(
  opts: ISarosOptions,
): Promise<CountOnlyResult> {
  logger.log("Entered countFiles");
  const { path, recursive, extensions, ignore } = opts;

  let numFiles = 0;
  const numFilesPerExtension: Record<string, number> = {};

  const timer = new Timer();

  const isIgnoredFile = fileIgnorer(ignore);

  for await (const file of walkFiles(path, {
    recursive,
    excludeFolder: fileIgnorer(ignore),
  })) {
    const checkedExtension = isFittingExtension(
      extensions.map(normalizeExtension),
      file,
    );
    const checkedIgnoreList = !isIgnoredFile(file);

    if (checkedExtension && checkedIgnoreList) {
      logger.log(`Runner: Got file ${file}`);
      numFiles++;
      const ext = extname(file);
      if (ext.length) {
        if (numFilesPerExtension[ext]) numFilesPerExtension[ext] += 1;
        else numFilesPerExtension[ext] = 1;
      }
    }
  }

  logger.log(`All files done, composing result`);

  return {
    timeMs: timer.asMilli(),
    numFiles,
    numFilesPerExtension,
  };
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

  const isIgnoredFile = fileIgnorer(ignore);

  for await (const file of walkFiles(path, {
    recursive,
    excludeFolder: fileIgnorer(ignore),
  })) {
    const checkedExtension = isFittingExtension(
      extensions.map(normalizeExtension),
      file,
    );
    const checkedIgnoreList = !isIgnoredFile(file);

    if (checkedExtension && checkedIgnoreList) {
      logger.log(`Runner: Got file ${file}`);
      const result = await countLines(file);
      numFiles++;
      numUsedLines += result.numUsed;
      numBlankLines += result.numBlanks;
      const ext = extname(file);
      if (ext.length) {
        if (numFilesPerExtension[ext]) numFilesPerExtension[ext] += 1;
        else numFilesPerExtension[ext] = 1;

        const lineCount = result.numUsed + result.numBlanks;
        if (numLinesPerExtension[ext]) numLinesPerExtension[ext] += lineCount;
        else numLinesPerExtension[ext] = lineCount;
      }
    }
  }

  logger.log(`All files done, composing result`);

  const numLines = numUsedLines + numBlankLines;

  const percentUsed = numLines ? numUsedLines / numLines : null;

  return {
    timeMs: timer.asMilli(),
    numFiles,
    numLines,
    numUsedLines,
    numBlankLines,
    percentUsed: percentUsed,
    percentBlank: percentUsed ? 1 - percentUsed : null,
    numFilesPerExtension,
    numLinesPerExtension,
  };
}
