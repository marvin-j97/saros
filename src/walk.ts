import { promises } from "fs";
import { resolve, join } from "path";
import { Stack } from "./stack";
import { isFittingExtension, fileIgnorer } from "./utility";
import * as logger from "./debug";

const { stat, readdir } = promises;

type FileCallback = (err: Error | null, path: string) => Promise<boolean>;

export interface IWalkOptions {
  root: string;
  cb: FileCallback;
  recursive: boolean;
  extensions: string[];
  ignore: string[];
}

interface IDirectoryListing {
  files: string[];
  folders: string[];
}

async function readdirSplit(
  root: string,
  paths: string[],
): Promise<IDirectoryListing> {
  const dir: IDirectoryListing = {
    files: [],
    folders: [],
  };

  for (const path of paths) {
    try {
      const resolved = join(root, path);
      const stats = await stat(resolved);
      if (stats.isDirectory()) {
        dir.folders.push(resolved);
      } else {
        dir.files.push(resolved);
      }
    } catch (error) {
      if (error.code === "EPERM") {
        console.error(error.message);
      } else {
        throw error;
      }
    }
  }

  return dir;
}

export async function walk(opts: IWalkOptions): Promise<void> {
  const { root, cb, recursive, extensions, ignore } = opts;
  const folderStack = new Stack<string>();
  folderStack.push(root);

  logger.log(`Walking ${root}`);

  while (folderStack.peek()) {
    const top = folderStack.pop();
    if (!top) return;

    const path = resolve(top);

    logger.log(`Reading ${path}`);

    const dirContent = await readdir(path);
    const { files, folders } = await readdirSplit(path, dirContent);

    const isIgnoredFile = fileIgnorer(ignore);

    for (const file of files) {
      logger.log(`Walk: Checking file ${file}`);
      const checkedExtension = isFittingExtension(extensions, file);
      const checkedIgnoreList = !isIgnoredFile(file);

      if (checkedExtension && checkedIgnoreList) {
        logger.log(`Walk: Calling callback with ${file}`);
        const result = await cb(null, file);
        if (result === true) {
          logger.log(`Walk: Callback = true, aborting walk`);
          return;
        }
      }
    }

    if (recursive) {
      logger.log(`Recursion ON, adding folders to stack`);
      // Push on stack backwards, so the folders are sorted A-Z
      for (let i = folders.length - 1; i >= 0; i--) {
        const folder = folders[i];
        logger.log(`Checking folder ${folder}`);
        if (!isIgnoredFile(folder)) {
          logger.log(`Adding ${folder} to stack`);
          folderStack.push(folder);
        }
      }
    } else {
      logger.log("No recursion");
    }
  }
}
