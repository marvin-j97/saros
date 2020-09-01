#!/usr/bin/env node

import args from "./args";
import { normalizeExtension } from "./utility";
import { getStats, listFiles, ISarosOptions, countFiles } from "./runner";
import * as logger from "./debug";
import YAML from "yaml";

const argv = args.argv;

function printFormatted(content: unknown, format: string) {
  format = format.toUpperCase();
  if (format === "JSON") {
    console.log(JSON.stringify(content, null, 2));
  } else if (format === "YAML" || format === "YML") {
    console.log(YAML.stringify(content));
  }
}

async function main() {
  logger.log("Entered main");

  const opts: ISarosOptions = {
    path: <string>argv.path,
    recursive: argv.recursive,
    extensions: argv.ext.map(normalizeExtension),
    ignore: argv.ignore,
  };

  if (argv.list) {
    await listFiles(opts);
  } else {
    if (argv["files-only"]) {
      const result = await countFiles(opts);
      if (argv.details) {
        printFormatted(result, argv.format);
      } else {
        console.log(result.numFiles);
      }
    } else {
      const result = await getStats(opts);
      if (argv.details) {
        printFormatted(result, argv.format);
      } else {
        console.log(result.numLines);
      }
    }
  }

  logger.log("Main done");
  process.exit();
}

main();
