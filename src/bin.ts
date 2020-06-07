import args from "./args";
import { normalizeExtension } from "./utility";
import { run } from "./run";

const argv = args.argv;

async function main() {
  const extensions = (argv.ext || []).map(normalizeExtension);
  const result = await run(
    <string>argv.path,
    argv.recursive || false,
    extensions,
  );

  if (argv.details) {
    console.log(result);
  } else {
    console.log(result.numLines);
  }

  process.exit();
}

main();
