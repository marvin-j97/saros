import yargs from "yargs";

export default yargs
  .scriptName("saros")
  .version("0.1.3")
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
    "files-only": {
      alias: "count-files",
      default: false,
      type: "boolean",
      description: "Count only files",
    },
    list: {
      alias: "l",
      default: false,
      type: "boolean",
      description: "List all file names instead",
    },
  })
  .check((argv) => {
    if ([argv.list, argv.files, argv.details].filter(Boolean).length > 1) {
      throw new Error(
        "Error: Cannot use --list, --files and/or --details simultaneously",
      );
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
