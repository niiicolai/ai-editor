import UserService from "../../src/services/user_service";
import UserModel from "../../src/mongodb/models/user_model";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const _id = new ObjectId().toString();

beforeAll(async () => {
  await UserModel.deleteMany();
  await UserModel.create({
    _id,
    username: "test55",
    email: "test@55test.com",
    role: "member",
    logins: []
  });
})

test.each([
  [
    {
      body: {
        username: "test",
        password: "Te1!stTest",
        email: "test@test.com",
        role: "member",
      },
    },
  ],
])("UserService.create valid partitions", async ({ body }) => {
  const { user, token } = await UserService.create(body);

  expect(user.username).toBe(body.username);
  expect(user.email).toBe(body.email);
  expect(user.role).toBe(body.role);
  expect(user.created_at).toBeDefined();
  expect(user.updated_at).toBeDefined();
  expect(user._id).toBeDefined();
  expect(token).toBeDefined();
});

test.each([
  [
    {
      body: {
        username: "",
        password: "Te1!stTest",
        email: "test@test.com",
        role: "member",
      },
      e: "username is required",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "",
        email: "test@test.com",
        role: "member",
      },
      e: "password is required",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "Te1!stTest",
        email: "",
        role: "member",
      },
      e: "email is required",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "Te1!stTest",
        email: "test@test.com",
        role: "",
      },
      e: "role is required",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "Te1!stTest",
        email: "test@test.com",
        role: "member",
      },
      e: "username already exists",
    },
  ],
])("UserService.create invalid partitions", async ({ body, e }) => {
  await expect(UserService.create(body)).rejects.toThrowError(e);
});

test("UserService.find valid partition", async () => {
  const findResult = await UserService.find(_id);

  expect(findResult.username).toBe("test55");
  expect(findResult.email).toBe("test@55test.com");
  expect(findResult.role).toBe("member");
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
      e: "invalid field not_a_valid_field. Allowed fields are _id, username, email, role, created_at, updated_at, logins.type, logins.created_at, logins.updated_at",
    },
  ],
])("UserService.find invalid partitions", async ({ _id, fields, e }) => {
  await expect(UserService.find(_id, fields)).rejects.toThrowError(e);
});

test.each([
  [
    {
      body: {
        username: "test4",
        password: "Te1!4stTest",
        email: "test@4test.com",
      },
    },
  ],
])("UserService.update valid partitions", async ({ body }) => {
  const updateResult = await UserService.update(_id, body);

  expect(updateResult.username).toBe(body.username);
  expect(updateResult.email).toBe(body.email);
  expect(updateResult.role).toBe("member");
  expect(updateResult._id.toString()).toStrictEqual(_id);
  expect(updateResult.created_at).toBeDefined();
  expect(updateResult.updated_at).toBeDefined();
});
