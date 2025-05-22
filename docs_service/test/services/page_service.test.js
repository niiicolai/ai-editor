import CategoryModel from "../../src/mongodb/models/category_model.js";
import PageModel from "../../src/mongodb/models/page_model.js";
import PageService from "../../src/services/page_service.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const catId = new ObjectId();

beforeAll(async () => {
  await CategoryModel.deleteMany();
  await PageModel.deleteMany();
  await CategoryModel.create({
    _id: catId,
    name: "test",
    order: 1,
  });
  await PageModel.create({
    name: "test",
    content: "test",
    order: 1,
    category: catId,
  });
});


test.each([[{ page: 1, limit: 1, category: "test" }]])(
  "PageService.findAll valid partitions",
  async ({ page, limit, category }) => {
    const findAllResult = await PageService.findAll(page, limit, category);
    
    expect(findAllResult.total).toBe(1);
    expect(findAllResult.pages).toBe(1);
    expect(findAllResult.page).toBe(page);
    expect(findAllResult.limit).toBe(limit);
    expect(findAllResult.data[0].name).toBe("test");
  }
);

test.each([
  [
    {
      page: 0,
      limit: 1, 
      category: "test",
      e: "page 0 out of bounds. Min page is 1",
    },
  ],
  [
    {
      page: 1,
      limit: 0, 
      category: "test",
      e: "limit 0 out of bounds. Min limit is 1",
    },
  ],
  [
    {
      page: 1,
      limit: 101, 
      category: "test",
      e: "limit 101 out of bounds. Max limit is 100",
    },
  ],
])("PageService.findAll invalid partitions", async ({ page, limit, category, e }) => {
  await expect(PageService.findAll(page, limit, category)).rejects.toThrowError(e);
});

test("PageService.find valid partition",
  async () => {
    const findAllResult = await PageService.findAll(1, 1, "test");
    const findResult = await PageService.find(findAllResult.data[0]._id.toString());

    expect(findResult.name).toBe("test");
  }
);

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
  await expect(PageService.find(_id)).rejects.toThrowError(e);
});
