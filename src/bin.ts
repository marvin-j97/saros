import args from "./args";
import { normalizeExtension } from "./utility";

const argv = args.argv;

async function main() {
  console.log(argv);
  const extensions = (argv.ext || []).map(normalizeExtension);
}

main();
