import { paginatorValidator } from "../../src/validators/paginator_validator";
import { expect, test } from "vitest";

test.each([
    [{ page: 1, limit: 1 }], 
    [{ page: 2, limit: 2 }], 
])("paginatorValidator valid partitions", async ({ page, limit }) => {
  expect(
    paginatorValidator(page, limit)
  ).toBeUndefined();
});

test.each([
    [{ page: 0, limit: 1, e: 'page 0 out of bounds. Min page is 1' }], 
    [{ page: -1, limit: 2, e: 'page -1 out of bounds. Min page is 1' }], 
])("paginatorValidator page outer bounds - min", async ({ page, limit, e }) => {
  expect(() =>
    paginatorValidator(page, limit, {
        minLimit: 1,
        maxLimit: 100
    })
  ).toThrowError(e);
});

test.each([
    [{ page: 1, limit: 0, e: 'limit 0 out of bounds. Min limit is 1' }], 
    [{ page: 2, limit: -1, e: 'limit -1 out of bounds. Min limit is 1' }], 
])("paginatorValidator limit outer bounds - min", async ({ page, limit, e }) => {
  expect(() =>
    paginatorValidator(page, limit, {
        minLimit: 1,
        maxLimit: 100
    })
  ).toThrowError(e);
});


test.each([
    [{ page: 1, limit: 101, e: 'limit 101 out of bounds. Max limit is 100' }], 
    [{ page: 2, limit: 102, e: 'limit 102 out of bounds. Max limit is 100' }], 
])("paginatorValidator limit outer bounds - max", async ({ page, limit, e }) => {
  expect(() =>
    paginatorValidator(page, limit, {
        minLimit: 1,
        maxLimit: 100
    })
  ).toThrowError(e);
});

