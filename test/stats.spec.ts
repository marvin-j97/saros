import test from "ava-ts";
import { getStats } from "../src";
import floatEqual from "float-equal";

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
    percentBlank: 0,
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

  t.is(result.numFiles, 3);
  t.is(result.numLines, 13);
  t.is(result.numBlankLines, 5);
  t.is(result.numUsedLines, 8);
  t.deepEqual(result.numFilesPerExtension, {
    ".json": 1,
    ".txt": 2,
  });
  t.deepEqual(result.numLinesPerExtension, {
    ".json": 3,
    ".txt": 10,
  });
  t.is(floatEqual(<number>result.percentBlank, 5 / 13), true);
  t.is(floatEqual(<number>result.percentUsed, 8 / 13), true);
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
