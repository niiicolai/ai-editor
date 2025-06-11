import UserCreditModificationService from "../../src/services/user_credit_modification_service.js";
import UserModel from "../../src/mongodb/models/user_model.js";
import UserCreditModificationModel from "../../src/mongodb/models/user_credit_modification_model.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const _id = new ObjectId().toString();
const userId = new ObjectId().toString();

beforeAll(async () => {
  await UserCreditModificationModel.deleteMany();
  await UserModel.deleteMany();
  await UserModel.create({
    _id: userId,
    username: "test55",
    email: "test@55test.com",
  });
  await UserCreditModificationModel.create({
    _id,
    user_product: "test",
    amount: 2,
    user: userId,
  });
});

test("UserCreditModificationService.find valid partition", async () => {
  const findResult = await UserCreditModificationService.find(_id, userId);

  expect(findResult.user_product).toBe("test");
  expect(findResult.amount).toBe(2);
  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
  expect(findResult.user.toString()).toStrictEqual(userId);
  expect(findResult._id.toString()).toStrictEqual(_id);
});

test.each([
  [
    {
      _id: "",
      userId,
      fields: ["_id"],
      e: "_id is required",
    },
  ],
  [
    {
      _id: "123",
      userId,
      fields: ["_id"],
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id,
      userId: "",
      fields: ["_id"],
      e: "userId is required",
    },
  ],
  [
    {
      _id,
      userId: "123",
      fields: ["_id"],
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      _id: new ObjectId()._id.toString(),
      userId,
      fields: ["not_a_valid_field"],
      e: "invalid field not_a_valid_field. Allowed fields are _id, user_product, amount, user, created_at, updated_at",
    },
  ],
])(
  "UserCreditModificationService.find invalid partitions",
  async ({ _id, userId, fields, e }) => {
    await expect(
      UserCreditModificationService.find(_id, userId, fields)
    ).rejects.toThrowError(e);
  }
);

test.each([
  [
    {
      page: 1,
      limit: 1,
      userId,
      fields: ["_id"],
    },
  ],
  [
    {
      page: 1,
      limit: 1,
      userId,
      fields: null,
    },
  ],
])(
  "UserCreditModificationService.findAll valid partitions",
  async ({ page, limit, userId, fields }) => {
    const data = await UserCreditModificationService.findAll(
      page,
      limit,
      userId,
      fields
    );

    expect(data.limit).toBeDefined();
    expect(data.page).toBeDefined();
    expect(data.pages).toBeDefined();
    expect(data.total).toBeDefined();
    expect(data.modifications).toBeDefined();
  }
);

test.each([
  [
    {
      page: 1,
      limit: 1,
      userId: "",
      fields: ["_id"],
      e: "userId is required",
    },
  ],
  [
    {
      page: 1,
      limit: 1,
      userId: "123",
      fields: ["_id"],
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      userId,
      page: 1,
      limit: 1,
      fields: ["not_a_valid_field"],
      e: "invalid field not_a_valid_field. Allowed fields are _id, user_product, amount, user, created_at, updated_at",
    },
  ],
])(
  "UserCreditModificationService.findAll invalid partitions",
  async ({ page, limit, userId, fields, e }) => {
    await expect(
      UserCreditModificationService.findAll(page, limit, userId, fields)
    ).rejects.toThrowError(e);
  }
);

test.each([
  [
    {
      body: {
        user_product: "test",
        amount: 2,
      },
      userId,
    },
  ],
  [
    {
      body: {
        user_product:
          "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist321123321232",
        amount: 2,
      },
      userId,
    },
  ],
  [
    {
      body: {
        user_product: "te",
        amount: 1,
      },
      userId,
    },
  ],
])(
  "UserCreditModificationService.create valid partitions",
  async ({ body, userId }) => {
    const data = await UserCreditModificationService.create(body, userId);

    expect(data.created_at).toBeDefined();
    expect(data.updated_at).toBeDefined();
    expect(data.user_product).toBe(body.user_product);
    expect(data.amount).toBe(body.amount);
    expect(data.user.toString()).toStrictEqual(userId);
    expect(data._id).toBeDefined();
  }
);

test.each([
  [
    {
      body: {
        user_product: "",
        amount: 2,
      },
      userId,
      e: "body.user_product is required",
    },
  ],
  [
    {
      body: {
        user_product: "a",
        amount: 2,
      },
      userId,
      e: "body.user_product a out of bounds. Min body.user_product is 2",
    },
  ],
  [
    {
      body: {
        user_product:
          "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322",
        amount: 2,
      },
      userId,
      e: "body.user_product etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322 out of bounds. Max body.user_product is 100",
    },
  ],
  [
    {
      body: {
        user_product: "aaaaa",
        amount: 0,
      },
      userId,
      e: "body.amount 0 out of bounds. Min body.amount is 1",
    },
  ],
  [
    {
      body: {
        user_product: "aaaaa",
        amount: 100001,
      },
      userId,
      e: "body.amount 100001 out of bounds. Max body.amount is 100000",
    },
  ],
])(
  "UserCreditModificationService.create invalid partitions",
  async ({ body, userId, e }) => {
    await expect(
      UserCreditModificationService.create(body, userId)
    ).rejects.toThrowError(e);
  }
);

test("UserCreditModificationService.destroy valid partition", async () => {
  const newid = new ObjectId().toString();
  await UserCreditModificationModel.create({
    _id: newid,
    user_product: "test",
    amount: 2,
    user: userId,
  });
  await UserCreditModificationService.destroy(newid, userId);

  await expect(
    UserCreditModificationService.find(newid, userId)
  ).rejects.toThrowError("user credit modification not found");
});

test.each([
  [
    {
      _id: "",
      userId,
      e: "_id is required",
    },
  ],
  [
    {
      _id: "123",
      userId,
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id,
      userId: "",
      e: "userId is required",
    },
  ],
  [
    {
      _id,
      userId: "123",
      e: "userId must be a valid ObjectId",
    },
  ],
])(
  "UserCreditModificationService.destroy invalid partitions",
  async ({ _id, userId, e }) => {
    await expect(
      UserCreditModificationService.destroy(_id, userId)
    ).rejects.toThrowError(e);
  }
);
