import test from "ava-ts";
import { isFittingExtension } from "../../src/utility";

const tests = [
  [[], ".json", true],
  [[], "", true],
  [[".json"], ".json", true],
  [[".json"], ".txt", false],
  [[".json", ".txt"], ".json", true],
  [[".json", ".txt"], ".txt", true],
  [[".json", ".txt"], ".avi", false],
] as [string[], string, boolean][];

for (const testCase of tests) {
  test.serial(`Fitting extension ${testCase[1]}`, async (t) => {
    const result = isFittingExtension(testCase[0], testCase[1]);
    t.is(result, testCase[2]);
  });
}
