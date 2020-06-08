import args from "./args";
import { normalizeExtension } from "./utility";
import { getStats, listFiles, ISarosOptions } from "./runner";

const argv = args.argv;

async function main() {
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

  process.exit();
}

main();
