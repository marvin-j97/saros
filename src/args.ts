import yargs from "yargs";

export default yargs
  .scriptName("saros")
  .version("0.0.1")
  .command("$0 <path>", "Count lines in path")
  .options({
    format: {
      alias: "f",
      default: "json",
      type: "string",
      description: "Output format (when using --details). JSON or YAML",
    },
    ignore: {
      alias: "I",
      default: [],
      type: "array",
      description: "Ignore files/folders, using glob syntax",
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
      description: "Visit subfolders",
    },
    details: {
      alias: "D",
      default: false,
      type: "boolean",
      description: "Show more detailed statistics",
    },
    list: {
      alias: "l",
      default: false,
      type: "boolean",
      description: "List all file names instead",
    },
  })
  .check((argv) => {
    if (argv.list && argv.details) {
      throw new Error("Error: Use list or details");
    }
    return true;
  })
  .check((argv) => {
    const format = argv.format.toUpperCase();
    if (format != "JSON" && format != "YAML" && format != "YML") {
      throw new Error("Error: Invalid format " + format);
    }
    return true;
  });
