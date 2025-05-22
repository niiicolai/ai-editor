import UserService from "../../src/services/user_service";
import { expect, test } from "vitest";
import { ObjectId } from "mongodb";

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

test.each([
  [
    {
      body: {
        username: "test2",
        password: "Te1!stTest",
        email: "test@2test.com",
        role: "member",
      },
    },
  ],
])("UserService.find valid partitions", async ({ body }) => {
  const { user } = await UserService.create(body);
  const findResult = await UserService.find(user._id.toString());

  expect(findResult.username).toBe(body.username);
  expect(findResult.email).toBe(body.email);
  expect(findResult.role).toBe(body.role);
  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
  expect(findResult._id).toBeDefined();
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
      before: {
        username: "test3",
        password: "Te1!stTest",
        email: "test@3test.com",
      },
      after: {
        username: "test4",
        password: "Te1!4stTest",
        email: "test@4test.com",
      },
    },
  ],
])("UserService.update valid partitions", async ({ before, after }) => {
  const { user } = await UserService.create({ ...before, role: "member" });
  const updateResult = await UserService.update(user._id.toString(), after);

  expect(updateResult.username).toBe(after.username);
  expect(updateResult.email).toBe(after.email);
  expect(updateResult.role).toBe("member");
  expect(updateResult._id).toStrictEqual(user._id);
  expect(updateResult.created_at).toBeDefined();
  expect(updateResult.updated_at).toBeDefined();
});
