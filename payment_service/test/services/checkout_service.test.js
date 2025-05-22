import CheckoutService from "../../src/services/checkout_service.js";
import UserProductModel from "../../src/mongodb/models/user_product_model.js";
import UserModel from "../../src/mongodb/models/user_model.js";
import ProductModel from "../../src/mongodb/models/product_model.js";
import CheckoutModel from "../../src/mongodb/models/checkout_model.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const userId = new ObjectId().toString();
const prodId = new ObjectId().toString();
const userProdId = new ObjectId().toString();
const checkId = new ObjectId().toString();
const sessionId = new ObjectId().toString();

beforeAll(async () => {
  await UserModel.deleteMany();
  await UserProductModel.deleteMany();
  await ProductModel.deleteMany();
  await CheckoutModel.deleteMany();

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
      noOfCredits: 123,
    },
  });
  await CheckoutModel.create({
    _id: checkId,
    user: userId,
    state: "open",
    sessionId,
    products: {
      product: prodId,
      quantity: 2,
    },
  });
});

test.each([[{ page: 1, limit: 1, state: "open" }]])(
  "CheckoutService.findAll valid partitions",
  async ({ page, limit, state }) => {
    const findAllResult = await CheckoutService.findAll(
      page,
      limit,
      userId,
      state
    );

    expect(findAllResult.page).toBe(page);
    expect(findAllResult.limit).toBe(limit);
    expect(findAllResult.checkouts[0].user).toBeDefined();
    expect(findAllResult.checkouts[0].state).toBeDefined();
    expect(findAllResult.checkouts[0].products).toBeDefined();
  }
);

test.each([
  [
    {
      page: 0,
      limit: 1,
      user_id: userId,
      state: "open",
      e: "page 0 out of bounds. Min page is 1",
    },
  ],
  [
    {
      page: 1,
      limit: 0,
      user_id: userId,
      state: "open",
      e: "limit 0 out of bounds. Min limit is 1",
    },
  ],
  [
    {
      page: 1,
      limit: 101,
      user_id: userId,
      state: "open",
      e: "limit 101 out of bounds. Max limit is 100",
    },
  ],
  [
    {
      page: 1,
      limit: 100,
      user_id: "",
      state: "open",
      e: "userId is required",
    },
  ],
  [
    {
      page: 1,
      limit: 100,
      user_id: "Aa",
      state: "open",
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      page: 1,
      limit: 100,
      user_id: userId,
      state: "",
      e: "state is required",
    },
  ],
])(
  "CheckoutService.findAll invalid partitions",
  async ({ page, limit, user_id, state, e }) => {
    await expect(
      CheckoutService.findAll(page, limit, user_id, state)
    ).rejects.toThrowError(e);
  }
);

test("CheckoutService.find valid partition", async () => {
  const findResult = await CheckoutService.find(checkId, userId);

  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
  expect(findResult.user).toBeDefined();
  expect(findResult.state).toBeDefined();
  expect(findResult.products).toBeDefined();
  expect(findResult._id.toString()).toStrictEqual(checkId);
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
])("CheckoutService.find invalid partitions", async ({ _id, user_id, e }) => {
  await expect(CheckoutService.find(_id, user_id)).rejects.toThrowError(e);
});

test("CheckoutService.findOrCreate valid partition", async () => {
  const findResult = await CheckoutService.findOrCreate(userId);

  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
  expect(findResult.user).toBeDefined();
  expect(findResult.state).toBeDefined();
  expect(findResult.products).toBeDefined();
  expect(findResult._id.toString()).toStrictEqual(checkId);
});

test.each([
  [
    {
      user_id: "",
      e: "userId is required",
    },
  ],
  [
    {
      user_id: "aa",
      e: "userId must be a valid ObjectId",
    },
  ],
])(
  "CheckoutService.findOrCreate invalid partitions",
  async ({ user_id, e }) => {
    await expect(CheckoutService.findOrCreate(user_id)).rejects.toThrowError(e);
  }
);

test("CheckoutService.create valid partition", async () => {
  const createResult = await CheckoutService.create(
    {
      products: [
        {
          product: prodId,
          quantity: 2,
        },
      ],
    },
    userId
  );

  expect(createResult.created_at).toBeDefined();
  expect(createResult.updated_at).toBeDefined();
  expect(createResult.user).toBeDefined();
  expect(createResult.state).toBeDefined();
  expect(createResult.products).toBeDefined();
  expect(createResult._id).toBeDefined();
});

test.each([
  [
    {
      body: {
        product: [],
      },
      user_id: "",
      e: "userId is required",
    },
  ],
  [
    {
      body: {
        product: [],
      },
      user_id: "aa",
      e: "userId must be a valid ObjectId",
    },
  ],
])(
  "CheckoutService.create invalid partitions",
  async ({ body, user_id, e }) => {
    await expect(CheckoutService.create(body, user_id)).rejects.toThrowError(e);
  }
);

test("CheckoutService.update valid partition", async () => {
  const createResult = await CheckoutService.update(
    checkId,
    {
      products: [
        {
          product: prodId,
          quantity: 5,
        },
      ],
    },
    userId
  );

  expect(createResult.created_at).toBeDefined();
  expect(createResult.updated_at).toBeDefined();
  expect(createResult.user).toBeDefined();
  expect(createResult.state).toBeDefined();
  expect(createResult.products).toBeDefined();
  expect(createResult._id).toBeDefined();
});

test.each([
  [
    {
      _id: checkId,
      body: {
        product: [],
      },
      user_id: "",
      e: "userId is required",
    },
  ],
  [
    {
      _id: checkId,
      body: {
        product: [],
      },
      user_id: "aa",
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      _id: "",
      body: {
        product: [],
      },
      user_id: userId,
      e: "_id is required",
    },
  ],
  [
    {
      _id: "aa",
      body: {
        product: [],
      },
      user_id: userId,
      e: "_id must be a valid ObjectId",
    },
  ],
])(
  "CheckoutService.update invalid partitions",
  async ({ _id, body, user_id, e }) => {
    await expect(
      CheckoutService.update(_id, body, user_id)
    ).rejects.toThrowError(e);
  }
);

test("CheckoutService.startCheckout valid partition", async () => {
  const startCheckoutResult = await CheckoutService.startCheckout(
    checkId,
    userId
  );

  expect(startCheckoutResult).toBeDefined();
});

test.each([
  [
    {
      _id: checkId,
      user_id: "",
      e: "userId is required",
    },
  ],
  [
    {
      _id: checkId,
      user_id: "aa",
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      _id: "",
      user_id: userId,
      e: "_id is required",
    },
  ],
  [
    {
      _id: "aa",
      user_id: userId,
      e: "_id must be a valid ObjectId",
    },
  ],
])(
  "CheckoutService.startCheckout invalid partitions",
  async ({ _id, user_id, e }) => {
    await expect(
      CheckoutService.startCheckout(_id, user_id)
    ).rejects.toThrowError(e);
  }
);
