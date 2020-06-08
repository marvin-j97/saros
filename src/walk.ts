import { promises } from "fs";
import { resolve, join, basename } from "path";
import { Stack } from "./stack";
import { isFittingExtension, isFileIgnored } from "./utility";

const { stat, readdir } = promises;

type FileCallback = (err: Error | null, path: string) => Promise<boolean>;

export interface IWalkOptions {
  root: string;
  cb: FileCallback;
  recursive: boolean;
  extensions: string[];
  exclude: string[];
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
  const { root, cb, recursive, extensions, exclude } = opts;
  const folderStack = new Stack<string>();
  folderStack.push(root);

  while (folderStack.peek()) {
    const top = folderStack.pop();
    if (!top) return;

    const path = resolve(top);

    const dirContent = await readdir(path);
    const { files, folders } = await readdirSplit(path, dirContent);

    for (const file of files) {
      const checkedExtension = isFittingExtension(extensions, file);
      const checkedIgnoreList = !isFileIgnored(exclude, basename(file));

      if (checkedExtension && checkedIgnoreList) {
        const result = await cb(null, file);
        if (result === true) return;
      }
    }

    if (recursive) {
      // Push on stack backwards, so the folders are sorted A-Z
      for (let i = folders.length - 1; i >= 0; i--) {
        const folder = folders[i];
        if (!isFileIgnored(exclude, basename(folder))) {
          folderStack.push(folder);
        }
      }
    }
  }
}
