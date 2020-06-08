import test from "ava-ts";
import { isFileIgnored } from "../../src/utility";

const tests = [
  [["test"], "test.json", true],
  [["test"], "test2.json", false],
  [["test", "test2"], "test2.json", true],
  [[], "test2.json", false],
  [["test"], "test.mp4", true],
  [["test"], "test", true],
] as [string[], string, boolean][];

for (const testCase of tests) {
  test.serial(`Ignore ${testCase[1]}`, async (t) => {
    const result = isFileIgnored(testCase[0], testCase[1]);
    t.is(result, testCase[2]);
  });
}
