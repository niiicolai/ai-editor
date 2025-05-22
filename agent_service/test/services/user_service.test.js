import UserService from "../../src/services/user_service.js";
import UserModel from "../../src/mongodb/models/user_model.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const _id = new ObjectId().toString();

beforeAll(async () => {
  await UserModel.deleteMany();
  await UserModel.create({
    _id,
    username: "test55",
    email: "test@55test.com",
  });
})

test("UserService.find valid partition", async () => {
  const findResult = await UserService.find(_id);

  expect(findResult.username).toBe("test55");
  expect(findResult.email).toBe("test@55test.com");
  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
  expect(findResult._id.toString()).toStrictEqual(_id);
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
      _id: "123",
      fields: ["_id"],
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id: new ObjectId()._id.toString(),
      fields: ["not_a_valid_field"],
      e: "invalid field not_a_valid_field. Allowed fields are _id, username, email, credit, created_at, updated_at",
    },
  ],
])("UserService.find invalid partitions", async ({ _id, fields, e }) => {
  await expect(UserService.find(_id, fields)).rejects.toThrowError(e);
});
