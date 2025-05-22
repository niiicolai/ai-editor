import { objectValidator } from "../../src/validators/object_validator.js";
import { expect, test } from "vitest";

test.each([
    [{}], 
    [{ a: 1 }], 
    [{ a: 1, b: 2 }]
])("objectValidator valid partitions", async (o) => {
  expect(
    objectValidator(o, "o")
  ).toBeUndefined();
});

test.each([
  [{ o: null, e: "o is required" }],
  [{ o: undefined, e: "o is required" }],
  [{ o: 1, e: "o must be an object" }],
])("objectValidator invalid partitions", async ({ o, e }) => {
  expect(() =>
    objectValidator(o, "o")
  ).toThrowError(e);
});