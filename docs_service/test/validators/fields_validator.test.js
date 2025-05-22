import { fieldsValidator } from "../../src/validators/fields_validator.js";
import { expect, test } from "vitest";

test.each([
    [{ fields: ['_id'], allowedFields: ['_id'] }], 
    [{ fields: ['_id', 'name'], allowedFields: ['_id', 'name']}], 
])("fieldsValidator valid partitions", async ({ fields, allowedFields }) => {
  expect(
    fieldsValidator(fields, allowedFields)
  ).toStrictEqual(fields);
});

test.each([
    [{ fields: ['_id'], allowedFields: [], e: 'invalid field _id. Allowed fields are ' }], 
    [{ fields: ['_id', 'name'], allowedFields: ['_id'], e: 'invalid field name. Allowed fields are _id'}], 
])("fieldsValidator invalid partitions", async ({ fields, allowedFields, e }) => {
  expect(() =>
    fieldsValidator(fields, allowedFields)
  ).toThrowError(e);
});
