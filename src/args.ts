import yargs from "yargs";

export default yargs
  .scriptName("saros")
  .command("$0 <path>", "Count lines in path")
  .version("0.0.1")
  .array("ext")
  .boolean("recursive")
  .boolean("bail")
  .boolean("list")
  .boolean("details")
  .alias("R", "recursive")
  .alias("v", "version")
  .alias("list", "l")
  .check((argv) => {
    if (argv.list && argv.details) {
      throw new Error("Error: Use list or details");
    }
    return true;
  });
