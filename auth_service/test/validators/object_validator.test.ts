import { objectValidator } from "../../src/validators/object_validator";
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
