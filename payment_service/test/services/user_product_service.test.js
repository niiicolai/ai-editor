import UserProductService from "../../src/services/user_product_service.js";
import UserProductModel from "../../src/mongodb/models/user_product_model.js";
import UserModel from "../../src/mongodb/models/user_model.js";
import ProductModel from "../../src/mongodb/models/product_model.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const userId = new ObjectId().toString();
const prodId = new ObjectId().toString();
const userProdId = new ObjectId().toString();

beforeAll(async () => {
  await UserModel.deleteMany();
  await UserProductModel.deleteMany();
  await ProductModel.deleteMany();

  await UserModel.create({
    _id: userId,
    username: "test55",
    email: "test@55test.com",
  });
  await ProductModel.create({
    _id: prodId,
    title: "test",
    description: "test",
    category: "test",
    noOfCredits: 123,
    price: 123,
    stripePriceId: "test",
  });
  await UserProductModel.create({
    _id: userProdId,
    user: userId,
    credit: {
        noOfCredits: 123
    },
  });
})

test.each([[{ page: 1, limit: 1 }]])(
  "UserProductService.findAll valid partitions",
  async ({ page, limit }) => {
    const findAllResult = await UserProductService.findAll(page, limit, userId);

    expect(findAllResult.page).toBe(page);
    expect(findAllResult.limit).toBe(limit);
    expect(findAllResult.products[0].user).toBeDefined();
    expect(findAllResult.products[0].credit).toBeDefined();
  }
);

test.each([
  [
    {
      page: 0,
      limit: 1,
      user_id: userId,
      e: "page 0 out of bounds. Min page is 1",
    },
  ],
  [
    {
      page: 1,
      limit: 0,
      user_id: userId,
      e: "limit 0 out of bounds. Min limit is 1",
    },
  ],
  [
    {
      page: 1,
      limit: 101,
      user_id: userId,
      e: "limit 101 out of bounds. Max limit is 100",
    },
  ],
  [
    {
      page: 1,
      limit: 100,
      user_id: "",
      e: "userId is required",
    },
  ],
  [
    {
      page: 1,
      limit: 100,
      user_id: "Aa",
      e: "userId must be a valid ObjectId",
    },
  ],
])("UserProductService.findAll invalid partitions", async ({ page, limit, user_id, e }) => {
  await expect(UserProductService.findAll(page, limit, user_id)).rejects.toThrowError(e);
});

test("UserProductService.find valid partition", async () => {
  const findResult = await UserProductService.find(userProdId, userId);

  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
  expect(findResult.user).toBeDefined();
  expect(findResult.credit).toBeDefined();
  expect(findResult._id.toString()).toStrictEqual(userProdId);
});

test.each([
  [
    {
      _id: "",
      user_id: userId,
      e: "_id is required",
    },
  ],
  [
    {
      _id: "123",
      user_id: userId,
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id: "68213300c858cc74afe42af2",
      user_id: "",
      e: "userId is required",
    },
  ],
  [
    {
      _id: "68213300c858cc74afe42af2",
      user_id: "aa",
      e: "userId must be a valid ObjectId",
    },
  ],
])("UserProductService.find invalid partitions", async ({ _id, user_id, e }) => {
  await expect(UserProductService.find(_id, user_id)).rejects.toThrowError(e);
});
