import { numberValidator } from "../../src/validators/number_validator.js";
import { expect, test } from "vitest";

test.each([[0], [1], [2]])("numberValidator valid partitions", async (n) => {
  expect(
    numberValidator(n, "n", {
      min: { enabled: true, value: -1 },
      max: { enabled: true, value: 3 },
    })
  ).toBeUndefined();
});

test.each([
  [{ n: 0, e: "n 0 out of bounds. Min n is 3" }],
  [{ n: 1, e: "n 1 out of bounds. Min n is 3" }],
  [{ n: 2, e: "n 2 out of bounds. Min n is 3" }],
])("numberValidator outer boundary - min", async ({ n, e }) => {
  expect(() =>
    numberValidator(n, "n", {
      min: { enabled: true, value: 3 },
      max: { enabled: false, value: 0 },
    })
  ).toThrowError(e);
});

test.each([
  [{ n: 0, e: "n 0 out of bounds. Max n is -1" }],
  [{ n: 1, e: "n 1 out of bounds. Max n is -1" }],
  [{ n: 2, e: "n 2 out of bounds. Max n is -1" }],
])("numberValidator outer boundary - max", async ({ n, e }) => {
  expect(() =>
    numberValidator(n, "n", {
      min: { enabled: false, value: 0 },
      max: { enabled: true, value: -1 },
    })
  ).toThrowError(e);
});
