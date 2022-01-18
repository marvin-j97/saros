import readline from "readline";
import { createReadStream } from "fs";
import * as logger from "./debug";

export interface IFileLines {
  numBlanks: number;
  numUsed: number;
}

export async function countLines(path: string): Promise<IFileLines> {
  return new Promise((resolve) => {
    logger.log(`Counting lines of ${path}`);

    const result: IFileLines = {
      numBlanks: 0,
      numUsed: 0,
    };

    readline
      .createInterface({
        input: createReadStream(path),
      })
      .on("line", (line) => {
        if (line.length) {
          result.numUsed++;
        } else {
          result.numBlanks++;
        }
      })
      .on("close", () => {
        resolve(result);
      });
  });
}
