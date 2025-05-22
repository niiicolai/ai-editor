import { idValidator } from "../../src/validators/id_validator.js";
import { expect, test } from "vitest";

test.each([
    [{ _id: '68213300c858cc74afe42af1' }], 
    [{ _id: '68213300c858cc74afe42af2' }], 
])("idValidator valid partitions", async ({ _id }) => {
  expect(
    idValidator(_id)
  ).toBeUndefined();
});

test.each([
    [{ _id: 'A', e: '_id must be a valid ObjectId' }], 
    [{ _id: 'Aa', e: '_id must be a valid ObjectId'}], 
])("idValidator invalid partitions", async ({ _id, e }) => {
  expect(() =>
    idValidator(_id, '_id')
  ).toThrowError(e);
});
