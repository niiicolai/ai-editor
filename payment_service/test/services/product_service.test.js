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

test.each([
  [
    {
      body: {
        title: "aa",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: 123,
        stripePriceId: "123"
      },
    },
  ],
  [
    {
      body: {
        title: "aaa",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: 123,
        stripePriceId: "1234"
      },
    },
  ],
  [
    {
      body: {
        title: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist321123321232",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: 123,
        stripePriceId: "12345"
      },
    },
  ],
])("ProductService.create valid partitions", async ({ body, e }) => {
  const product = await ProductService.create(body);

  expect(product._id).toBeDefined();
  expect(product.title).toBe(body.title);
  expect(product.description).toBe(body.description);
  expect(product.category).toBe(body.category);
  expect(product.noOfCredits).toBe(body.noOfCredits);
  expect(product.price).toBe(body.price);
});


test.each([
  [
    {
      body: {
        title: "",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: 123,
        stripePriceId: "123"
      },
      e: "body.title is required",
    },
  ],
  [
    {
      body: {
        title: "a",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: 123,
        stripePriceId: "123"
      },
      e: "body.title a out of bounds. Min body.title is 2",
    },
  ],
  [
    {
      body: {
        title: "1",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: 123,
        stripePriceId: "123"
      },
      e: "body.title 1 out of bounds. Min body.title is 2",
    },
  ],
  [
    {
      body: {
        title: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: 123,
        stripePriceId: "123"
      },
      e: "body.title etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322 out of bounds. Max body.title is 100",
    },
  ],
  [
    {
      body: {
        title: "title",
        description: "",
        category: "category",
        noOfCredits: 123,
        price: 123,
        stripePriceId: "123"
      },
      e: "body.description is required",
    },
  ],
  [
    {
      body: {
        title: "title",
        description: "description",
        category: "",
        noOfCredits: 123,
        price: 123,
        stripePriceId: "123"
      },
      e: "body.category is required",
    },
  ],
  [
    {
      body: {
        title: "title",
        description: "description",
        category: "category",
        noOfCredits: null,
        price: 123,
        stripePriceId: "123"
      },
      e: "body.noOfCredits must be a number",
    },
  ],
  [
    {
      body: {
        title: "title",
        description: "description",
        category: "category",
        noOfCredits: 0,
        price: 123,
        stripePriceId: "123"
      },
      e: "body.noOfCredits 0 out of bounds. Min body.noOfCredits is 1",
    },
  ],
  [
    {
      body: {
        title: "title",
        description: "description",
        category: "category",
        noOfCredits: 100001,
        price: 123,
        stripePriceId: "123"
      },
      e: "body.noOfCredits 100001 out of bounds. Max body.noOfCredits is 100000",
    },
  ],
  [
    {
      body: {
        title: "title",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: null,
        stripePriceId: "123"
      },
      e: "body.price must be a number",
    },
  ],
  [
    {
      body: {
        title: "title",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: 0,
        stripePriceId: "123"
      },
      e: "body.price 0 out of bounds. Min body.price is 1",
    },
  ],
  [
    {
      body: {
        title: "title",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: 100001,
        stripePriceId: "123"
      },
      e: "body.price 100001 out of bounds. Max body.price is 100000",
    },
  ],
  [
    {
      body: {
        title: "title",
        description: "description",
        category: "category",
        noOfCredits: 123,
        price: 123,
        stripePriceId: ""
      },
      e: "stripePriceId is required",
    },
  ],
])("ProductService.create invalid partitions", async ({ body, e }) => {
  await expect(ProductService.create(body)).rejects.toThrowError(e);
});

