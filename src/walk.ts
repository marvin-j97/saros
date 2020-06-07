import { promises } from "fs";
import { resolve, join } from "path";
import { Stack } from "./stack";
import { isFittingExtension } from "./utility";

const { stat, readdir } = promises;

export const EndWalk = Symbol();

type FileCallback = (
  err: Error | null,
  path: string,
) => Promise<typeof EndWalk | false>;

export interface IWalkOptions {
  root: string;
  cb: FileCallback;
  recursive: boolean;
  extensions: string[];
}

export async function walk(opts: IWalkOptions): Promise<void> {
  const { root, cb, recursive, extensions } = opts;
  const fileStack = new Stack<string>();
  fileStack.push(root);

  while (fileStack.peek()) {
    const top = fileStack.pop();
    if (!top) return;

    const path = resolve(top);

    let stats;
    try {
      stats = await stat(path);
    } catch (error) {
      if (error.code === "EPERM") {
        const result = await cb(error, path);
        if (result === EndWalk) return;
      } else {
        throw error;
      }
    }

    if (stats) {
      if (stats.isDirectory() && recursive) {
        const newFiles = await readdir(path);
        fileStack.push(...newFiles.map((f) => join(path, f)));
      } else {
        if (isFittingExtension(extensions, path)) {
          const result = await cb(null, path);
          if (result === EndWalk) return;
        }
      }
    }
  }
}
