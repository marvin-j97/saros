import gulp from "gulp";
import { readFileSync } from "fs";
const { exec } = require("pkg") as {
  exec: (args: string[]) => Promise<void>;
};
const pkg = exec;

const version = (() => {
  const pkgjson = readFileSync("package.json", "utf-8");
  const parsed = JSON.parse(pkgjson);
  return parsed.version as string;
})();

const NODE_VERSION = "node12";

async function build(os: string) {
  await pkg([
    "dist/bin.js",
    "--target",
    `${NODE_VERSION}-${os}`,
    "--output",
    `release/${os}/saros-${version}`,
  ]);
}

async function buildWindows() {
  return build("win-x64");
}

async function buildMac() {
  return build("mac-x64");
}

async function buildLinux() {
  return build("linux-x64");
}

gulp.task("default", gulp.series(buildWindows, buildMac, buildLinux));
