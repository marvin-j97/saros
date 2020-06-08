import yargs from "yargs";

export default yargs
  .scriptName("saros")
  .version("0.0.1")
  .command("$0 <path>", "Count lines in path")
  .options({
    ignore: {
      alias: "I",
      default: [],
      type: "array",
      description: "Ignore file/folder with name equal to any of the strings",
    },
    ext: {
      default: [],
      type: "array",
      description: "File extensions filter, will count all files if empty",
    },
    recursive: {
      alias: "R",
      default: false,
      type: "boolean",
      description: "Whether to visit subfolders",
    },
    list: {
      alias: "l",
      default: false,
      type: "boolean",
      description: "List all file names",
    },
    details: {
      default: false,
      type: "boolean",
      description: "Show more detailed statistics",
    },
  })
  .check((argv) => {
    if (argv.list && argv.details) {
      throw new Error("Error: Use list or details");
    }
    return true;
  });
