import test from "ava-ts";
import { normalizeExtension } from "../../src/utility";

const tests = [
  ["", ""],
  ["txt", ".txt"],
  [".json", ".json"],
] as [string, string][];

for (const testCase of tests) {
  test.serial(`Normalize ${testCase[0]}`, async (t) => {
    const result = normalizeExtension(testCase[0]);
    t.is(result, testCase[1]);
  });
}
