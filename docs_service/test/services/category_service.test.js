import CategoryModel from "../../src/mongodb/models/category_model.js";
import CategoryService from "../../src/services/category_service.js";
import { expect, test, beforeAll } from "vitest";

const name = new Date().toLocaleString();

beforeAll(async () => {
  await CategoryModel.deleteMany();
  await CategoryModel.create({
    name,
    order: 1,
  });
});

test.each([[{ page: 1, limit: 1 }]])(
  "CategoryService.findAll valid partitions",
  async ({ page, limit }) => {
    const findAllResult = await CategoryService.findAll(page, limit);

    expect(findAllResult.page).toBe(page);
    expect(findAllResult.limit).toBe(limit);
    expect(findAllResult.data[0].name).toBe(name);
  }
);

test.each([
  [
    {
      page: 0,
      limit: 1,
      e: "page 0 out of bounds. Min page is 1",
    },
  ],
  [
    {
      page: 1,
      limit: 0,
      e: "limit 0 out of bounds. Min limit is 1",
    },
  ],
  [
    {
      page: 1,
      limit: 101,
      e: "limit 101 out of bounds. Max limit is 100",
    },
  ],
])("CategoryService.findAll invalid partitions", async ({ page, limit, e }) => {
  await expect(CategoryService.findAll(page, limit)).rejects.toThrowError(e);
});

test("CategoryService.find valid partition", async () => {
  const findAllResult = await CategoryService.findAll(1, 1);
  const findResult = await CategoryService.find(
    findAllResult.data[0]._id.toString()
  );

  expect(findResult.name).toBeDefined();
});

test.each([
  [
    {
      _id: "Aa",
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id: "",
      e: "_id is required",
    },
  ],
])("CategoryService.find invalid partitions", async ({ _id, e }) => {
  await expect(CategoryService.find(_id)).rejects.toThrowError(e);
});
