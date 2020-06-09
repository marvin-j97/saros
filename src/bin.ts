import args from "./args";
import { normalizeExtension } from "./utility";
import { getStats, listFiles, ISarosOptions } from "./runner";
import * as logger from "./debug";

const argv = args.argv;

async function main() {
  logger.log("Entered main");

  const opts: ISarosOptions = {
    path: <string>argv.path,
    recursive: argv.recursive,
    extensions: argv.ext.map(normalizeExtension),
    ignore: argv.ignore,
  };

  if (!argv.list) {
    const result = await getStats(opts);
    if (argv.details) {
      console.log(result);
    } else {
      console.log(result.numLines);
    }
  } else {
    await listFiles(opts);
  }

  logger.log("Main done");
  process.exit();
}

main();
