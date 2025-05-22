import { stringValidator } from "../../src/validators/string_validator.js";
import { expect, test } from "vitest";

test.each([
    ["A"], 
    ["Aa"], 
    ["Aaa"]
])("stringValidator valid partitions", async (s) => {
  expect(
    stringValidator(s, "s", {
      min: { enabled: true, value: 1 },
      max: { enabled: true, value: 3 },
      regex: null
    })
  ).toBeUndefined();
});

test.each([
  [{ s: "A", e: "s A out of bounds. Min s is 3" }],
  [{ s: "Aa", e: "s Aa out of bounds. Min s is 3" }],
])("stringValidator outer boundary - min", async ({ s, e }) => {
  expect(() =>
    stringValidator(s, "s", {
      min: { enabled: true, value: 3 },
      max: { enabled: false, value: 0 },
      regex: null
    })
  ).toThrowError(e);
});

test.each([
  [{ s: "Aa", e: "s Aa out of bounds. Max s is 1" }],
  [{ s: "Aaa", e: "s Aaa out of bounds. Max s is 1" }],
])("stringValidator outer boundary - max", async ({ s, e }) => {
  expect(() =>
    stringValidator(s, "s", {
      min: { enabled: false, value: 0 },
      max: { enabled: true, value: 1 },
      regex: null
    })
  ).toThrowError(e);
});

test.each([
  [{ s: "Aa", r: /ww/, e: "s Aa does not match the required pattern" }],
  [{ s: "Aaa", r: /www/, e: "s Aaa does not match the required pattern" }],
])("stringValidator outer boundary - max", async ({ s, r, e }) => {
  expect(() =>
    stringValidator(s, "s", {
      min: { enabled: false, value: 0 },
      max: { enabled: false, value: 1 },
      regex: { enabled: true, value: r }
    })
  ).toThrowError(e);
});
