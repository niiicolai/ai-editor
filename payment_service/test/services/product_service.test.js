import ProductModel from "../../src/mongodb/models/product_model.js";
import ProductService from "../../src/services/product_service.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const prodId = new ObjectId().toString();
const title = new Date().toLocaleString();
const stripePriceId = new Date().toLocaleString();

beforeAll(async () => {
  await ProductModel.deleteMany();
  await ProductModel.create({
      _id: prodId,
      title,
      description: "test",
      category: "test",
      noOfCredits: 123,
      price: 123,
      stripePriceId,
    });
});

test.each([[{ category: "test", page: 1, limit: 1 }]])(
  "ProductService.findAll valid partitions",
  async ({ page, limit, category }) => {
    const findAllResult = await ProductService.findAll(page, limit, category);

    expect(findAllResult.page).toBe(page);
    expect(findAllResult.limit).toBe(limit);
    expect(findAllResult.products[0].title).toBeDefined();
    expect(findAllResult.products[0].description).toBeDefined();
    expect(findAllResult.products[0].category).toBeDefined();
    expect(findAllResult.products[0].noOfCredits).toBeDefined();
    expect(findAllResult.products[0].price).toBeDefined();
  }
);

test.each([
  [
    {
      category: "test",
      page: 0,
      limit: 1,
      e: "page 0 out of bounds. Min page is 1",
    },
  ],
  [
    {
      category: "test",
      page: 1,
      limit: 0,
      e: "limit 0 out of bounds. Min limit is 1",
    },
  ],
  [
    {
      category: "test",
      page: 1,
      limit: 101,
      e: "limit 101 out of bounds. Max limit is 100",
    },
  ],
])("ProductService.findAll invalid partitions", async ({ page, limit, category, e }) => {
  await expect(ProductService.findAll(page, limit, category)).rejects.toThrowError(e);
});

test("ProductService.find valid partition",
  async () => {
    const findResult = await ProductService.find(prodId);

    expect(findResult.title).toBe(title);
    expect(findResult.description).toBe("test");
    expect(findResult.category).toBe("test");
    expect(findResult.noOfCredits).toBe(123);
    expect(findResult.price).toBe(123);
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
])("ProductService.find invalid partitions", async ({ _id, e }) => {
  await expect(ProductService.find(_id)).rejects.toThrowError(e);
});
