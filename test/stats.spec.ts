import test from "ava-ts";
import { getStats } from "../src";

test.serial("Count .txt", async (t) => {
  const result = await getStats({
    ignore: [],
    extensions: [".txt"],
    path: "test/fixture",
    recursive: false,
  });

  // @ts-ignore
  delete result.timeMs;

  t.deepEqual(<Omit<typeof result, "timeMs">>result, {
    numFiles: 2,
    numLines: 10,
    numBlankLines: 5,
    numUsedLines: 5,
    numFilesPerExtension: {
      ".txt": 2,
    },
    numLinesPerExtension: {
      ".txt": 10,
    },
    percentBlank: 0.5,
    percentUsed: 0.5,
  });
});

test.serial("Count.json", async (t) => {
  const result = await getStats({
    ignore: [],
    extensions: [".json"],
    path: "test/fixture",
    recursive: true,
  });

  // @ts-ignore
  delete result.timeMs;

  t.deepEqual(<Omit<typeof result, "timeMs">>result, {
    numFiles: 1,
    numLines: 3,
    numBlankLines: 0,
    numUsedLines: 3,
    numFilesPerExtension: {
      ".json": 1,
    },
    numLinesPerExtension: {
      ".json": 3,
    },
    percentBlank: null,
    percentUsed: 1,
  });
});

test.serial("Count all", async (t) => {
  const result = await getStats({
    ignore: [],
    extensions: [],
    path: "test/fixture",
    recursive: true,
  });

  // @ts-ignore
  delete result.timeMs;

  t.deepEqual(<Omit<typeof result, "timeMs">>result, {
    numFiles: 3,
    numLines: 13,
    numBlankLines: 5,
    numUsedLines: 8,
    numFilesPerExtension: {
      ".json": 1,
      ".txt": 2,
    },
    numLinesPerExtension: {
      ".json": 3,
      ".txt": 10,
    },
    percentBlank: 5 / 13,
    percentUsed: 8 / 13,
  });
});

test.serial("Count all, but ignore 'test.json'", async (t) => {
  const result = await getStats({
    ignore: ["test.json"],
    extensions: [],
    path: "./test/fixture",
    recursive: true,
  });

  // @ts-ignore
  delete result.timeMs;

  t.deepEqual(<Omit<typeof result, "timeMs">>result, {
    numFiles: 2,
    numLines: 10,
    numBlankLines: 5,
    numUsedLines: 5,
    numFilesPerExtension: {
      ".txt": 2,
    },
    numLinesPerExtension: {
      ".txt": 10,
    },
    percentBlank: 0.5,
    percentUsed: 0.5,
  });
});
