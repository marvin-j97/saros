import test from "ava";
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

for (let i = 0; i < tests.length; i++) {
  const testCase = tests[i];
  test.serial(`Fitting extension ${i}`, async (t) => {
    const result = isFittingExtension(testCase[0], testCase[1]);
    t.is(result, testCase[2]);
  });
}
