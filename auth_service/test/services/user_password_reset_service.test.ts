import UserPasswordResetService from "../../src/services/user_password_reset_service";
import UserPasswordResetModel from "../../src/mongodb/models/user_password_reset_model";
import UserModel from "../../src/mongodb/models/user_model";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const resetId = new ObjectId().toString();
const userId = new ObjectId().toString();
const email = "test@552test.com";

beforeAll(async () => {
  await UserModel.deleteMany();
  await UserPasswordResetModel.deleteMany();
  await UserModel.create({
    _id: userId,
    username: "test552",
    email,
    role: "member",
    logins: [
      {
        type: "password",
        password:
          "$2b$10$AcGCSTG4pKABtPFppsR8GOSJ3B4BdXuI08jb9MBmSLrla7b1vMP2i",
      },
    ],
  });
  await UserPasswordResetModel.create({
    _id: resetId,
    user: userId,
    expired_at: new Date(Date.now() + 10 * 60 * 1000),
    deleted_at: null,
  })
})

test("UserPasswordResetService.find valid partition", async () => {
  const findResult = await UserPasswordResetService.find(resetId);

  expect(findResult.expired_at).toBeDefined();
  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
});

test.each([
  [
    {
      _id: "",
      fields: ["_id"],
      e: "_id is required",
    },
  ],
  [
    {
      _id: "Aa",
      fields: ["_id"],
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id: "68213300c858cc74afe42af2",
      fields: ["test"],
      e: "invalid field test. Allowed fields are expired_at, created_at, updated_at",
    },
  ],
])("UserPasswordResetService.find invalid partition", async ({ _id, fields, e }) => {
  await expect(UserPasswordResetService.find(_id, fields)).rejects.toThrowError(e);
});
